import { useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CalendarDays,
  FilePlus,
  Search,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import {
  CATEGORIES,
  daysUntil,
  downloadJson,
  draftFromDocument,
  emptyDraft,
  formatDays,
  formatExpiry,
  isoFromToday,
  lockedDocumentIds,
  monthKey,
  monthLabel,
  sortByUrgency,
  statusFromDays,
  type CategoryId,
  type DocumentDraft,
  type DocumentRecord,
  type Status,
} from "@/lib/documents";
import { useDocket, useDocketHydrated } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocumentCard } from "@/components/document-card";
import { DocumentForm } from "@/components/document-form";
import { cn } from "@/lib/utils";

type FilterId = "all" | Status;
type ViewId = "docket" | "horizon";

const FILTERS: Array<{ id: FilterId; label: string }> = [
  { id: "all", label: "All" },
  { id: "expired", label: "Expired" },
  { id: "critical", label: "This week" },
  { id: "soon", label: "This month" },
  { id: "watch", label: "Upcoming" },
  { id: "current", label: "Current" },
];

export function DocketApp() {
  const ready = useDocketHydrated();
  const documents = useDocket((s) => s.documents);
  const addDocument = useDocket((s) => s.addDocument);
  const updateDocument = useDocket((s) => s.updateDocument);
  const renewDocument = useDocket((s) => s.renewDocument);
  const removeDocument = useDocket((s) => s.removeDocument);
  const importDocuments = useDocket((s) => s.importDocuments);
  const loadSamples = useDocket((s) => s.loadSamples);
  const fileRef = useRef<HTMLInputElement>(null);

  const [now] = useState(() => new Date());
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [view, setView] = useState<ViewId>("docket");
  const [editor, setEditor] = useState<"add" | DocumentRecord | null>(null);
  const [renewing, setRenewing] = useState<DocumentRecord | null>(null);
  const [renewDate, setRenewDate] = useState("");
  const [removing, setRemoving] = useState<DocumentRecord | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const locked = useMemo(() => lockedDocumentIds(documents), [documents]);

  const counts = useMemo(() => {
    const next = { all: documents.length, expired: 0, critical: 0, soon: 0, watch: 0, current: 0 };
    for (const doc of documents) {
      next[statusFromDays(daysUntil(doc.expiryDate, now))] += 1;
    }
    return next;
  }, [documents, now]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortByUrgency(
      documents.filter((doc) => {
        const status = statusFromDays(daysUntil(doc.expiryDate, now));
        if (filter !== "all" && status !== filter) return false;
        if (category !== "all" && doc.category !== category) return false;
        if (!q) return true;
        const hay = `${doc.title} ${doc.issuer} ${doc.reference} ${doc.notes}`.toLowerCase();
        return hay.includes(q);
      }),
      now,
    );
  }, [documents, filter, category, query, now]);

  const horizon = useMemo(() => {
    const overdue = sortByUrgency(
      documents.filter((d) => daysUntil(d.expiryDate, now) < 0),
      now,
    );
    const upcoming = sortByUrgency(
      documents.filter((d) => daysUntil(d.expiryDate, now) >= 0),
      now,
    );
    const groups: Array<{ key: string; label: string; items: DocumentRecord[] }> = [];
    if (overdue.length) groups.push({ key: "overdue", label: "Overdue", items: overdue });
    const byMonth = new Map<string, DocumentRecord[]>();
    for (const doc of upcoming) {
      const key = monthKey(doc.expiryDate);
      const list = byMonth.get(key) ?? [];
      list.push(doc);
      byMonth.set(key, list);
    }
    for (const [key, items] of byMonth) {
      groups.push({ key, label: monthLabel(items[0].expiryDate), items });
    }
    return groups;
  }, [documents, now]);

  function saveDraft(draft: DocumentDraft) {
    if (editor === "add") {
      addDocument(draft);
      toast.success("Document added");
    } else if (editor) {
      updateDocument(editor.id, draft);
      toast.success("Document updated");
    }
    setEditor(null);
  }

  function confirmRenew() {
    if (!renewing || !renewDate) return;
    renewDocument(renewing.id, renewDate);
    toast.success("Marked as renewed");
    setRenewing(null);
  }

  function confirmRemove() {
    if (!removing) return;
    removeDocument(removing.id);
    toast.success("Removed from your docket");
    setRemoving(null);
  }

  function exportDocket() {
    downloadJson(`vellum-docket.json`, documents);
    toast.success("Exported JSON");
  }

  function onImportFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as unknown;
        if (!Array.isArray(parsed)) throw new Error("Expected an array");
        const docs = parsed.filter(
          (row): row is DocumentRecord =>
            typeof row === "object" &&
            row !== null &&
            typeof (row as DocumentRecord).id === "string" &&
            typeof (row as DocumentRecord).title === "string" &&
            typeof (row as DocumentRecord).expiryDate === "string",
        );
        if (!docs.length) throw new Error("No documents in file");
        importDocuments(docs);
        toast.success(`Imported ${docs.length} document${docs.length === 1 ? "" : "s"}`);
      } catch {
        toast.error("Could not read that file");
      }
    };
    reader.readAsText(file);
  }

  if (!ready) {
    return (
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8">
        <div>
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Document reminders
          </p>
          <h1 className="font-display text-4xl font-medium tracking-tight">Digitalni Sef</h1>
          <p className="mt-2 text-sm text-muted-foreground">Opening the safe…</p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-muted" />
          ))}
        </div>
        <div className="h-64 rounded-lg bg-muted" />
      </div>
    );
  }

  const attention = counts.expired + counts.critical;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              The safe
            </p>
            <Link to="/" className="font-display text-4xl font-medium tracking-tight">
              Digitalni Sef
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImportFile(file);
                e.target.value = "";
              }}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Library</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={exportDocket}>Export JSON</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => fileRef.current?.click()}>
                  Import JSON
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => loadSamples()}>
                  Load sample documents
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setEditor("add")}>
              <FilePlus />
              Add document
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-6 pb-28">
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="On the docket" value={counts.all} hint="Tracked documents" />
          <StatCard
            label="Needs action"
            value={attention}
            hint="Expired or due this week"
            tone={attention ? "warn" : "ok"}
          />
          <StatCard label="This month" value={counts.soon} hint="Within 30 days" />
          <StatCard label="Current" value={counts.current} hint="More than 90 days out" />
        </section>

        {attention > 0 ? (
          <div className="mt-5 flex items-start gap-3 rounded-lg bg-warn-soft px-4 py-3 text-warn">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <p className="text-sm">
              {counts.expired ? (
                <>
                  {counts.expired} document{counts.expired === 1 ? " has" : "s have"} lapsed.
                </>
              ) : null}{" "}
              {counts.critical ? (
                <>
                  {counts.critical} {counts.critical === 1 ? "expires" : "expire"} within a week.
                </>
              ) : null}
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex rounded-md bg-muted p-1">
            <ViewTab active={view === "docket"} onClick={() => setView("docket")}>
              Docket
            </ViewTab>
            <ViewTab active={view === "horizon"} onClick={() => setView("horizon")}>
              Horizon
            </ViewTab>
          </div>
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documents"
              className="pl-10"
              aria-label="Search documents"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((item) => (
            <FilterChip
              key={item.id}
              active={filter === item.id}
              onClick={() => setFilter(item.id)}
              count={item.id === "all" ? counts.all : counts[item.id]}
            >
              {item.label}
            </FilterChip>
          ))}
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
            Every category
          </FilterChip>
          {CATEGORIES.map((cat) => (
            <FilterChip
              key={cat.id}
              active={category === cat.id}
              onClick={() => setCategory(cat.id)}
            >
              {cat.label}
            </FilterChip>
          ))}
        </div>

        {view === "docket" ? (
          filtered.length ? (
            <section className="mt-6 grid gap-4 md:grid-cols-2">
              {filtered.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  now={now}
                  onEdit={setEditor}
                  onRenew={(item) => {
                    setRenewing(item);
                    setRenewDate(isoFromToday(365, now));
                  }}
                  onRemove={setRemoving}
                  locked={locked.has(doc.id)}
                  onUpgrade={() => setUpgradeOpen(true)}
                />
              ))}
            </section>
          ) : (
            <EmptyState
              hasAny={documents.length > 0}
              onAdd={() => setEditor("add")}
              onSamples={loadSamples}
            />
          )
        ) : horizon.length ? (
          <section className="mt-6 space-y-8">
            {horizon.map((group) => (
              <div key={group.key}>
                <div className="mb-3 flex items-center gap-3">
                  <CalendarDays className="size-4 text-subtle" />
                  <h2 className="font-display text-2xl font-medium tracking-tight">
                    {group.label}
                  </h2>
                  <Badge className="bg-muted text-muted-foreground">{group.items.length}</Badge>
                </div>
                <ol className="divide-y divide-border rounded-lg bg-card shadow-[var(--shadow-card)]">
                  {group.items.map((doc) => {
                    const days = daysUntil(doc.expiryDate, now);
                    const status = statusFromDays(days);
                    return (
                      <li key={doc.id} className="flex items-center justify-between gap-3 px-4 py-3">
                        <button
                          type="button"
                          className="min-w-0 flex-1 text-left"
                          onClick={() => setEditor(doc)}
                        >
                          <p className="truncate font-medium">{doc.title}</p>
                          <p className="truncate text-sm text-muted-foreground">
                            {formatExpiry(doc.expiryDate)}
                          </p>
                        </button>
                        <span
                          className={cn(
                            "shrink-0 text-sm font-medium tabular-nums",
                            status === "expired" && "text-destructive",
                            status === "critical" && "text-warn",
                          )}
                        >
                          {formatDays(days)}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </section>
        ) : (
          <EmptyState
            hasAny={documents.length > 0}
            onAdd={() => setEditor("add")}
            onSamples={loadSamples}
          />
        )}
      </main>

      <Dialog open={editor !== null} onOpenChange={(open) => !open && setEditor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editor === "add" ? "Add a document" : "Edit document"}</DialogTitle>
            <DialogDescription>
              Track the expiry date and when you want to be reminded.
            </DialogDescription>
          </DialogHeader>
          {editor ? (
            <DocumentForm
              key={editor === "add" ? "add" : editor.id}
              initial={editor === "add" ? emptyDraft() : draftFromDocument(editor)}
              submitLabel={editor === "add" ? "Add to docket" : "Save changes"}
              onSubmit={saveDraft}
              onCancel={() => setEditor(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={renewing !== null} onOpenChange={(open) => !open && setRenewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark renewed</DialogTitle>
            <DialogDescription>
              {renewing
                ? `Set the new expiry date for ${renewing.title}.`
                : "Set the new expiry date."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <label htmlFor="renew-date" className="text-sm font-medium">
              New expiry date
            </label>
            <Input
              id="renew-date"
              type="date"
              value={renewDate}
              onChange={(e) => setRenewDate(e.target.value)}
            />
          </div>
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setRenewing(null)}>
              Cancel
            </Button>
            <Button onClick={confirmRenew} disabled={!renewDate}>
              Save new date
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reminders pause after three</DialogTitle>
            <DialogDescription>
              The free safe keeps reminders running on your first three documents. Everything
              after that stays on the board, and wakes up when reminders are unlimited.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex justify-end">
            <Button onClick={() => setUpgradeOpen(false)}>Keep tracking</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={removing !== null} onOpenChange={(open) => !open && setRemoving(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this document?</AlertDialogTitle>
            <AlertDialogDescription>
              {removing
                ? `${removing.title} will leave your docket. This stays on this device only.`
                : "This document will leave your docket."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: number;
  hint: string;
  tone?: "warn" | "ok";
}) {
  return (
    <div className="rounded-lg bg-card p-4 shadow-[var(--shadow-card)]">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-display text-3xl leading-none font-medium tabular-nums",
          tone === "warn" && "text-warn",
          tone === "ok" && "text-ok",
        )}
      >
        {value}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

function ViewTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-11 min-w-24 rounded-sm px-4 text-sm font-medium transition-colors duration-150",
        active ? "bg-card text-foreground shadow-[var(--shadow-card)]" : "text-muted-foreground",
      )}
    >
      {children}
    </button>
  );
}

function FilterChip({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count?: number;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-3 text-sm transition-colors duration-150",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
      {typeof count === "number" ? (
        <span className={cn("tabular-nums", active ? "text-primary-foreground" : "text-subtle")}>
          {count}
        </span>
      ) : null}
    </button>
  );
}

function EmptyState({
  hasAny,
  onAdd,
  onSamples,
}: {
  hasAny: boolean;
  onAdd: () => void;
  onSamples: () => void;
}) {
  return (
    <div className="mt-6 rounded-lg bg-card px-6 py-16 text-center shadow-[var(--shadow-card)]">
      <Upload className="mx-auto size-6 text-subtle" />
      <h2 className="mt-4 font-display text-2xl font-medium">
        {hasAny ? "Nothing matches" : "Your docket is empty"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {hasAny
          ? "Try another filter, category, or search."
          : "Add passports, licenses, policies, and contracts so nothing lapses unnoticed."}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button onClick={onAdd}>Add document</Button>
        {!hasAny ? (
          <Button variant="outline" onClick={onSamples}>
            Load samples
          </Button>
        ) : null}
      </div>
    </div>
  );
}
