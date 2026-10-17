import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowUpDown,
  FileUp,
  Folder,
  List,
  Plus,
  Search,
  Settings,
  SquareStack,
  User,
} from "lucide-react";
import { toast } from "sonner";
import {
  BUILTIN_TEMPLATES,
  CATEGORIES,
  REMIND_OPTIONS,
  STATUS_META,
  categoryLabel,
  daysUntil,
  downloadJson,
  draftFromDocument,
  draftFromTemplate,
  emptyDraft,
  fieldsFromDocument,
  fileLimitBytes,
  formatDays,
  formatExpiry,
  isMine,
  isoFromToday,
  lockedDocumentIds,
  noticeAlertWindow,
  sortDocuments,
  statusFromDays,
  TIMEZONE_OPTIONS,
  type CategoryId,
  type DocTemplate,
  type DocumentDraft,
  type DocumentRecord,
  type Folder as FolderRecord,
  type SortId,
} from "@/lib/documents";
import { SiteFooter } from "@/components/site-footer";
import { useDocket, useDocketHydrated, type AccountProfile } from "@/lib/store";
import type { TwoFactor, TwoFactorMethod } from "@/lib/two-factor";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthScreen } from "@/components/auth-screen";
import { CheckoutScreen } from "@/components/checkout-screen";
import { DocumentCard } from "@/components/document-card";
import { DocumentRecordView, TemplatePreview } from "@/components/document-record";
import { cn } from "@/lib/utils";

type Panel = "board" | "folders" | "templates" | "account" | "settings";
type BoardView = "cards" | "list";

const fieldClass =
  "flex h-11 w-full rounded-md border border-border bg-card px-3 text-base text-foreground outline-none focus-visible:border-foreground md:text-sm";

export function Dashboard() {
  const ready = useDocketHydrated();
  const documents = useDocket((s) => s.documents);
  const customTemplates = useDocket((s) => s.customTemplates);
  const folders = useDocket((s) => s.folders);
  const addDocument = useDocket((s) => s.addDocument);
  const updateDocument = useDocket((s) => s.updateDocument);
  const renewDocument = useDocket((s) => s.renewDocument);
  const removeDocument = useDocket((s) => s.removeDocument);
  const moveDocument = useDocket((s) => s.moveDocument);
  const importDocuments = useDocket((s) => s.importDocuments);
  const importFolders = useDocket((s) => s.importFolders);
  const loadSamples = useDocket((s) => s.loadSamples);
  const addTemplate = useDocket((s) => s.addTemplate);
  const removeTemplate = useDocket((s) => s.removeTemplate);
  const addFolder = useDocket((s) => s.addFolder);
  const renameFolder = useDocket((s) => s.renameFolder);
  const removeFolder = useDocket((s) => s.removeFolder);
  const theme = useDocket((s) => s.theme);
  const timezone = useDocket((s) => s.timezone);
  const plan = useDocket((s) => s.plan);
  const setTheme = useDocket((s) => s.setTheme);
  const setTimezone = useDocket((s) => s.setTimezone);
  const setPlan = useDocket((s) => s.setPlan);
  const account = useDocket((s) => s.account);
  const passwordSet = useDocket((s) => Boolean(s.password));
  const setAccount = useDocket((s) => s.setAccount);
  const twoFactor = useDocket((s) => s.twoFactor);
  const setTwoFactor = useDocket((s) => s.setTwoFactor);
  const changePassword = useDocket((s) => s.changePassword);
  const signedIn = useDocket((s) => s.signedIn);
  const logOut = useDocket((s) => s.logOut);
  const sentAlerts = useDocket((s) => s.sentAlerts);
  const dismissAlert = useDocket((s) => s.dismissAlert);

  const [now] = useState(() => new Date());
  const [panel, setPanel] = useState<Panel>("board");
  const [view, setView] = useState<BoardView>("cards");
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [draft, setDraft] = useState<DocumentDraft | null>(null);
  const [editing, setEditing] = useState<DocumentRecord | null>(null);
  const [renewing, setRenewing] = useState<DocumentRecord | null>(null);
  const [renewDate, setRenewDate] = useState("");
  const [removing, setRemoving] = useState<DocumentRecord | null>(null);
  const [moving, setMoving] = useState<DocumentRecord | null>(null);
  const [removingFolder, setRemovingFolder] = useState<FolderRecord | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [makingTemplate, setMakingTemplate] = useState(false);
  const [record, setRecord] = useState<{
    draft: DocumentDraft;
    id: string | null;
    editing: boolean;
  } | null>(null);
  const [sort, setSort] = useState<SortId>("soonest");
  const [mineOnly, setMineOnly] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const pdfRef = useRef<HTMLInputElement>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const templates = useMemo(
    () => [...BUILTIN_TEMPLATES, ...(customTemplates ?? [])],
    [customTemplates],
  );
  const locked = useMemo(
    () => (plan === "free" ? lockedDocumentIds(documents) : new Set<string>()),
    [documents, plan],
  );
  const folderList = folders ?? [];
  const openFolder = folderList.find((folder) => folder.id === openFolderId) ?? null;
  const me = [account.firstName, account.lastName].filter(Boolean).join(" ") || account.email || "Me";
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortDocuments(
      documents.filter((doc) => {
        if (mineOnly && !isMine(doc.owner ?? "", me)) return false;
        if (openFolderId && (doc.folderId ?? "") !== openFolderId) return false;
        if (!q) return true;
        return `${doc.title} ${doc.issuer} ${doc.reference} ${doc.notes} ${doc.fileName} ${doc.owner ?? ""}`
          .toLowerCase()
          .includes(q);
      }),
      sort,
      now,
      timezone,
    );
  }, [documents, query, now, openFolderId, sort, timezone, mineOnly, me]);

  const dueAlerts = useMemo(() => {
    const sent = new Set((sentAlerts ?? []).map((item) => `${item.documentId}:${item.offsetDays}`));
    return documents.flatMap((doc) => {
      if (doc.decision === "expired") return [];
      const days = daysUntil(doc.noticeDeadline || doc.expiryDate, now, timezone);
      const window = noticeAlertWindow(days);
      if (!window || sent.has(`${doc.id}:${window}`)) return [];
      return [{ doc, window, days }];
    });
  }, [documents, sentAlerts, now, timezone]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  function withFolder(next: DocumentDraft): DocumentDraft {
    return { ...next, folderId: next.folderId || openFolderId || "" };
  }

  function openRecord(draft: DocumentDraft, id: string | null, editing: boolean) {
    const next = { ...draft, fields: { ...draft.fields } };
    if (!next.templateId) next.templateId = "personal";
    if (!Object.keys(next.fields).length) {
      next.fields = fieldsFromDocument({
        ...next,
        id: id ?? "draft",
        createdAt: new Date().toISOString(),
      });
    }
    setAddOpen(false);
    setDraft(null);
    setEditing(null);
    setRecord({ draft: next, id, editing });
    setPanel("board");
  }

  function startFromTemplate(template: DocTemplate) {
    openRecord(withFolder(draftFromTemplate(template)), null, true);
  }

  function onPdf(file: File) {
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      toast.error("Choose a PDF");
      return;
    }
    const limit = fileLimitBytes(plan);
    if (file.size > limit) {
      const mb = Math.round(limit / (1024 * 1024));
      toast.error(
        plan !== "free"
          ? `That file is over ${mb} MB.`
          : `Free keeps files at ${mb} MB. Plus allows 50 MB.`,
      );
      return;
    }
    const next = draftFromTemplate(templates.find((item) => item.id === "personal") ?? templates[0]);
    next.fileName = file.name;
    next.fields = {
      ...next.fields,
      item: file.name.replace(/\.pdf$/i, ""),
      notes: "Added from a PDF.",
    };
    next.folderId = openFolderId ?? "";
    openRecord(next, null, true);
  }

  function openEditor(item: DocumentRecord) {
    openRecord(withFolder(draftFromDocument(item)), item.id, true);
  }

  function openFile(item: DocumentRecord) {
    openRecord(draftFromDocument(item), item.id, false);
  }

  function openRenew(item: DocumentRecord) {
    setRenewing(item);
    setRenewDate(isoFromToday(365, now));
  }

  function saveDraft(next: DocumentDraft) {
    if (editing) {
      updateDocument(editing.id, next);
      toast.success("Document updated");
    } else {
      addDocument(next);
      toast.success("Document added");
    }
    setDraft(null);
    setEditing(null);
  }

  function onImport(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as {
          documents?: DocumentRecord[];
          folders?: FolderRecord[];
        };
        const docs = Array.isArray(parsed) ? parsed : parsed.documents;
        if (!Array.isArray(docs) || !docs.length) throw new Error("empty");
        importDocuments(docs);
        if (!Array.isArray(parsed) && Array.isArray(parsed.folders)) {
          importFolders(parsed.folders);
        }
        toast.success(`Imported ${docs.length}`);
      } catch {
        toast.error("Could not read that file");
      }
    };
    reader.readAsText(file);
  }

  if (!ready) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!signedIn) {
    return <AuthScreen />;
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      <aside className="hidden h-full w-[72px] shrink-0 flex-col items-center gap-1 border-r border-border bg-muted py-3 md:flex">
        <p className="mb-3 px-1 text-center text-[11px] leading-tight font-bold tracking-[-0.04em]">DigiSef</p>
        <RailButton
          active={panel === "board"}
          label="Board"
          onClick={() => {
            setOpenFolderId(null);
            setPanel("board");
          }}
        >
          <SquareStack />
        </RailButton>
        <RailButton
          active={panel === "folders"}
          label="Folders"
          onClick={() => setPanel("folders")}
        >
          <Folder />
        </RailButton>
        <div className="mt-auto flex flex-col items-center">
          <RailButton
            active={panel === "account"}
            label="Account"
            onClick={() => setPanel("account")}
          >
            <User />
          </RailButton>
          <RailButton
            active={panel === "settings"}
            label="Settings"
            onClick={() => setPanel("settings")}
          >
            <Settings />
          </RailButton>
        </div>
      </aside>

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="z-10 flex min-h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-3 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] md:px-4">
          <div className="relative min-w-0 flex-1 md:max-w-xs md:flex-none">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search documents"
              className="h-9 bg-card pl-9 shadow-none focus-visible:ring-0"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="ml-auto shrink-0 border-transparent bg-transparent font-bold text-[#ff0000] shadow-none hover:bg-[#ffd0d0] hover:text-[#ff0000]"
            onClick={() => logOut()}
          >
            Log out
          </Button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex-1">
        {showCheckout ? (
          <CheckoutScreen
            onBack={() => setShowCheckout(false)}
            onPaid={(chosen) => {
              setPlan(chosen);
              setShowCheckout(false);
              toast.success("Plus is active");
            }}
          />
        ) : null}
        {panel === "board" && record && !showCheckout ? (
          <DocumentRecordView
            key={`${record.id ?? "new"}-${record.editing}`}
            initial={record.draft}
            templates={templates}
            folders={folderList}
            editing={record.editing}
            onBack={() => setRecord(null)}
            onSave={(next) => {
              if (record.id) {
                updateDocument(record.id, next);
                toast.success("Record saved");
                setRecord({ draft: next, id: record.id, editing: false });
              } else {
                addDocument(next);
                toast.success("Record added");
                setRecord(null);
              }
            }}
          />
        ) : null}

        {panel === "board" && !record && !showCheckout ? (
          <main className="px-4 py-5 pb-16">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <ViewButton active={view === "cards"} label="Cards" onClick={() => setView("cards")}>
                <SquareStack />
              </ViewButton>
              <ViewButton active={view === "list"} label="List" onClick={() => setView("list")}>
                <List />
              </ViewButton>
              <button
                type="button"
                onClick={() => setMineOnly((on) => !on)}
                className={cn(
                  "flex h-9 items-center rounded-full px-3 text-sm",
                  mineOnly ? "bg-foreground text-background" : "bg-card text-foreground shadow-[var(--shadow-card)]",
                )}
              >
                My docs
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex h-9 items-center gap-1.5 rounded-full bg-card px-3 text-sm text-foreground shadow-[var(--shadow-card)]"
                  >
                    <ArrowUpDown className="size-4" />
                    {sort === "name" ? "Name" : sort === "latest" ? "Latest" : "Soonest"}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onSelect={() => setSort("name")}>Name</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSort("soonest")}>
                    Soonest expiry
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSort("latest")}>
                    Latest expiry
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {openFolder ? (
                <button
                  type="button"
                  onClick={() => setOpenFolderId(null)}
                  className="ml-auto text-sm font-semibold text-[#0075de]"
                >
                  All documents
                </button>
              ) : null}
            </div>
            {dueAlerts.length > 0 ? (
              <div className="mb-4 grid gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Notifications</p>
                  <button
                    type="button"
                    className="text-sm font-medium text-destructive"
                    onClick={() => {
                      for (const item of dueAlerts) dismissAlert(item.doc.id, item.window);
                    }}
                  >
                    Dismiss all
                  </button>
                </div>
                <ul className="grid gap-2">
                  {dueAlerts.map(({ doc, window, days }) => (
                    <li key={`${doc.id}-${window}`} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-danger-soft px-3 py-3 text-sm">
                      <button type="button" className="text-left font-medium text-destructive" onClick={() => openFile(doc)}>
                        {window}-day notice · {doc.title} · {days} days left
                      </button>
                      <button type="button" className="text-xs text-destructive" onClick={() => dismissAlert(doc.id, window)}>
                        Dismiss
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {view === "cards" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setAddOpen(true)}
                  className="add-tile flex min-h-52 flex-col items-start rounded-lg p-4 text-left"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-[#0075de] text-white">
                    <Plus className="size-4" />
                  </span>
                  <span className="mt-4 font-medium">Add a document</span>
                  <span className="mt-1 text-sm text-muted-foreground">
                    Start from a template, or attach a PDF.
                  </span>
                </button>
                {visible.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    now={now}
                    timeZone={timezone}
                    locked={locked.has(doc.id)}
                    onUpgrade={() => setUpgradeOpen(true)}
                    onOpen={openFile}
                    onEdit={openEditor}
                    onRenew={openRenew}
                    onRemove={setRemoving}
                    onMove={setMoving}
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg bg-card shadow-[var(--shadow-card)]">
                <button
                  type="button"
                  onClick={() => setAddOpen(true)}
                  className="flex w-full items-center gap-3 border-b border-border bg-[#f3f9fe] px-3 py-3 text-left text-sm font-semibold text-[#0075de]"
                >
                  <Plus className="size-4" />
                  Add a document
                </button>
                {visible.map((doc) => (
                  <DocumentRow
                    key={doc.id}
                    document={doc}
                    now={now}
                    timeZone={timezone}
                    locked={locked.has(doc.id)}
                    onOpen={openFile}
                    onEdit={openEditor}
                    onRenew={openRenew}
                    onRemove={setRemoving}
                    onMove={setMoving}
                  />
                ))}
                {visible.length === 0 ? (
                  <p className="px-3 py-6 text-sm text-muted-foreground">No documents here.</p>
                ) : null}
              </div>
            )}
            {query && visible.length === 0 && view === "cards" ? (
              <p className="mt-6 text-sm text-muted-foreground">Nothing matches that search.</p>
            ) : null}
          </main>
        ) : null}

        {panel === "folders" && !showCheckout ? (
          <FoldersPanel
            folders={folderList}
            documents={documents}
            onOpen={(id) => {
              setOpenFolderId(id);
              setPanel("board");
            }}
            onCreate={(folderName, ids) => {
              const id = addFolder(folderName);
              for (const docId of ids) moveDocument(docId, id);
              toast.success(ids.length ? "Folder created" : "Empty folder created");
            }}
            onRename={renameFolder}
            onRemove={setRemovingFolder}
          />
        ) : null}

        {panel === "templates" && !showCheckout ? (
          <TemplatesPanel
            customTemplates={customTemplates ?? []}
            making={makingTemplate}
            onMake={() => setMakingTemplate(true)}
            onCancelMake={() => setMakingTemplate(false)}
            onCreate={(template) => {
              addTemplate(template);
              setMakingTemplate(false);
              toast.success("Template saved");
            }}
            onUse={startFromTemplate}
            onRemove={removeTemplate}
          />
        ) : null}

        {panel === "account" && !showCheckout ? (
          <AccountPanel
            account={account}
            passwordSet={passwordSet}
            onAccount={setAccount}
            onPassword={changePassword}
            twoFactor={twoFactor}
            onTwoFactor={setTwoFactor}
            timezone={timezone}
            zones={zoneChoices(timezone)}
            onTimezone={setTimezone}
          />
        ) : null}

        {panel === "settings" && !showCheckout ? (
          <SettingsPanel
            theme={theme}
            plan={plan}
            onTheme={setTheme}
            onSubscribe={() => setShowCheckout(true)}
            onFree={() => {
              setPlan("free");
              toast.success("Back on the free plan");
            }}
            onExport={() =>
              downloadJson("digitalni-sef.json", { documents, folders: folderList })
            }
            onImport={() => importRef.current?.click()}
            onSamples={() => {
              loadSamples();
              toast.success("Sample documents restored");
            }}
          />
        ) : null}
        </div>
        <SiteFooter />
        </div>

        <nav className="flex shrink-0 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden">
          {(
            [
              ["board", "Board", SquareStack],
              ["folders", "Folders", Folder],
              ["account", "Account", User],
              ["settings", "Settings", Settings],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              aria-current={panel === id ? "page" : undefined}
              onClick={() => {
                if (id === "board") setOpenFolderId(null);
                setPanel(id);
              }}
              className={cn(
                "flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 border-t-2 text-[10px] font-medium",
                panel === id ? "border-[#0075de] font-bold text-[#0075de]" : "border-transparent text-muted-foreground",
              )}
            >
              <Icon className="size-5" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <input
        ref={pdfRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPdf(file);
          e.target.value = "";
        }}
      />
      <input
        ref={importRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onImport(file);
          e.target.value = "";
        }}
      />

      <Dialog
        open={addOpen}
        onOpenChange={(open) => {
          setAddOpen(open);
          if (!open) setShowTemplates(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a document</DialogTitle>
            <DialogDescription>
              {showTemplates ? "Pick a template." : "Add a PDF, or start from a template."}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 grid gap-2">
            {showTemplates ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowTemplates(false)}
                  className="text-left text-sm font-semibold text-[#0075de]"
                >
                  Back
                </button>
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => startFromTemplate(template)}
                    className="flex h-11 items-center justify-between rounded-md bg-muted px-3 text-left text-sm"
                  >
                    <span>{template.name}</span>
                    <span className="text-muted-foreground">Template</span>
                  </button>
                ))}
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setAddOpen(false);
                    pdfRef.current?.click();
                  }}
                  className="flex min-h-28 flex-col items-start justify-center gap-1 rounded-lg bg-foreground px-4 py-4 text-left text-background"
                >
                  <FileUp className="size-5" />
                  <span className="font-medium">Add PDF</span>
                  <span className="text-sm text-background/70">Upload the file and set the reminder.</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowTemplates(true)}
                  className="flex h-14 items-center justify-between rounded-lg border border-[#0075de] bg-[#e6f3fe] px-4 text-left text-sm text-[#0075de]"
                >
                  <span className="font-medium">Add template</span>
                  <span className="font-semibold text-[#0075de]">Choose one</span>
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={renewing !== null} onOpenChange={(open) => !open && setRenewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renew {renewing?.title}</DialogTitle>
            <DialogDescription>Set the next expiry date.</DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (!renewing || !renewDate) return;
              const was = daysUntil(renewing.expiryDate, now);
              renewDocument(renewing.id, renewDate);
              toast.success(
                was < 0 ? "Marked renewed" : `Renewed — was ${was} days out`,
              );
              setRenewing(null);
            }}
          >
            <DatePicker label="Next expiry date" value={renewDate} onChange={setRenewDate} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setRenewing(null)}>
                Cancel
              </Button>
              <Button type="submit">Save date</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reminders pause after three</DialogTitle>
            <DialogDescription>
              The first three documents keep their reminders. Subscribe in Settings for reminders
              on every document, and for files up to 50 MB.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setUpgradeOpen(false)}>
              Keep tracking
            </Button>
            <Button
              onClick={() => {
                setUpgradeOpen(false);
                setPanel("settings");
                setShowCheckout(true);
              }}
            >
              See Plus
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={moving !== null} onOpenChange={(open) => !open && setMoving(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move {moving?.title}</DialogTitle>
            <DialogDescription>Choose a folder, or leave it unfiled.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <button
              type="button"
              className="flex h-11 items-center rounded-md bg-muted px-3 text-left text-sm"
              onClick={() => {
                if (!moving) return;
                moveDocument(moving.id, "");
                setMoving(null);
                toast.success("Moved out of folders");
              }}
            >
              No folder
            </button>
            {folderList.map((folder) => (
              <button
                key={folder.id}
                type="button"
                className="flex h-11 items-center rounded-md bg-muted px-3 text-left text-sm"
                onClick={() => {
                  if (!moving) return;
                  moveDocument(moving.id, folder.id);
                  setMoving(null);
                  toast.success(`Moved to ${folder.name}`);
                }}
              >
                {folder.name}
              </button>
            ))}
            {folderList.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Create a folder from the Folders button first.
              </p>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={removingFolder !== null}
        onOpenChange={(open) => !open && setRemovingFolder(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {removingFolder?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Documents in it stay on the board. They just leave the folder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!removingFolder) return;
                removeFolder(removingFolder.id);
                if (openFolderId === removingFolder.id) setOpenFolderId(null);
                setRemovingFolder(null);
                toast.success("Folder deleted");
              }}
            >
              Delete folder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={removing !== null} onOpenChange={(open) => !open && setRemoving(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {removing?.title}?</AlertDialogTitle>
            <AlertDialogDescription>This takes it off the board on this device.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!removing) return;
                removeDocument(removing.id);
                setRemoving(null);
                toast.success("Removed");
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ViewButton({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-9 items-center gap-1.5 rounded-full px-3 text-sm",
        active ? "bg-foreground text-background" : "bg-card text-foreground shadow-[var(--shadow-card)]",
      )}
    >
      <span className="[&_svg]:size-4">{children}</span>
      {label}
    </button>
  );
}

function DocumentRow({
  document,
  now,
  timeZone,
  locked,
  onOpen,
  onEdit,
  onRenew,
  onRemove,
  onMove,
}: {
  document: DocumentRecord;
  now: Date;
  timeZone: string;
  locked: boolean;
  onOpen: (doc: DocumentRecord) => void;
  onEdit: (doc: DocumentRecord) => void;
  onRenew: (doc: DocumentRecord) => void;
  onRemove: (doc: DocumentRecord) => void;
  onMove: (doc: DocumentRecord) => void;
}) {
  const days = daysUntil(document.expiryDate, now, timeZone);
  const noticeDays = daysUntil(document.noticeDeadline || document.expiryDate, now, timeZone);
  const meta = STATUS_META[statusFromDays(Math.min(days, noticeDays))];
  const window = noticeAlertWindow(noticeDays);
  return (
    <div
      className={cn(
        "flex flex-col gap-2 border-b border-border px-3 py-3 last:border-b-0 sm:flex-row sm:items-center sm:gap-3",
        meta.row,
      )}
    >
      <button type="button" onClick={() => onOpen(document)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <span className={cn("size-2 shrink-0 rounded-full", meta.pip)} />
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">{document.title}</span>
          <span className={cn("block truncate text-xs text-muted-foreground", meta.days && "font-medium")}>
            {categoryLabel(document.category)}
            {" · "}
            {formatExpiry(document.expiryDate)}
            {" · "}
            <span className={meta.days}>{formatDays(days)}</span>
            {document.noticeDeadline ? ` · notice ${formatExpiry(document.noticeDeadline)}` : ""}
            {window ? ` · ${window}-day alert` : ""}
            {document.decision && document.decision !== "active" ? ` · ${document.decision}` : ""}
            {locked ? " · paused" : ""}
          </span>
        </span>
      </button>
      <div className="flex gap-3 pl-5 sm:pl-0">
        <button type="button" onClick={() => onMove(document)} className="text-xs text-muted-foreground">
          Move
        </button>
        <button type="button" onClick={() => onRenew(document)} className="text-xs text-muted-foreground">
          Renew
        </button>
        <button type="button" onClick={() => onRemove(document)} className="text-xs text-destructive">
          Remove
        </button>
      </div>
    </div>
  );
}

function FoldersPanel({
  folders,
  documents,
  onOpen,
  onCreate,
  onRename,
  onRemove,
}: {
  folders: FolderRecord[];
  documents: DocumentRecord[];
  onOpen: (id: string) => void;
  onCreate: (name: string, documentIds: string[]) => void;
  onRename: (id: string, name: string) => void;
  onRemove: (folder: FolderRecord) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [nameMissing, setNameMissing] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [docQuery, setDocQuery] = useState("");
  const [renaming, setRenaming] = useState<string | null>(null);
  const [rename, setRename] = useState("");

  function toggle(id: string) {
    setPicked((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  const listed = documents.filter((doc) => {
    const q = docQuery.trim().toLowerCase();
    if (!q) return true;
    return `${doc.title} ${doc.issuer} ${doc.reference} ${doc.notes}`.toLowerCase().includes(q);
  });

  return adding ? (
    <main className="px-4 py-5 pb-16 md:px-6">
      <button
        type="button"
        onClick={() => setAdding(false)}
        className="back-link"
      >
        Back to folders
      </button>
      <form
        className="rounded-lg bg-card p-4 shadow-[var(--shadow-card)] md:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (!name.trim()) {
            setNameMissing(true);
            return;
          }
          setNameMissing(false);
          onCreate(name.trim(), picked);
          setName("");
          setPicked([]);
          setDocQuery("");
          setAdding(false);
        }}
      >
        <h2 className="font-medium">Add folder</h2>
        <label className="mt-4 grid gap-1.5 text-sm">
          Name
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value.trim()) setNameMissing(false);
            }}
            placeholder="Folder name"
            aria-label="New folder name"
            aria-invalid={nameMissing}
            className={nameMissing ? "border-2 border-[#ff0000] focus-visible:border-[#ff0000]" : undefined}
          />
          {nameMissing ? (
            <span className="font-medium text-[#ff0000]">Enter a folder name.</span>
          ) : null}
        </label>
        <p className="mt-4 text-sm text-muted-foreground">
          Search the board, then pick the documents to add.
        </p>
        <div className="relative mt-3 max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={docQuery}
            onChange={(event) => setDocQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.preventDefault();
            }}
            placeholder="Search documents"
            aria-label="Search documents to add"
            className="pl-9"
          />
        </div>
        {documents.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No documents yet.</p>
        ) : listed.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Nothing matches that search.</p>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {listed.map((doc) => {
              const home = folders.find((folder) => folder.id === doc.folderId);
              return (
                <label
                  key={doc.id}
                  className="flex cursor-pointer items-start gap-3 rounded-md border border-border px-3 py-2.5"
                >
                  <input
                    type="checkbox"
                    className="mt-1 size-4"
                    checked={picked.includes(doc.id)}
                    onChange={() => toggle(doc.id)}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm">{doc.title}</span>
                    {home ? (
                      <span className="block truncate text-xs text-muted-foreground">
                        In {home.name}
                      </span>
                    ) : null}
                  </span>
                </label>
              );
            })}
          </div>
        )}
        <Button type="submit" className="mt-4">
          <Plus />
          Add folder
        </Button>
      </form>
    </main>
  ) : (
    <main className="px-4 py-5 pb-16">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="add-tile flex min-h-52 flex-col items-start rounded-lg p-4 text-left"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-[#0075de] text-white">
            <Plus className="size-4" />
          </span>
          <span className="mt-4 font-medium">Add folder</span>
          <span className="mt-1 text-sm text-muted-foreground">
            Name it, then pick documents from the board.
          </span>
        </button>
        {folders.map((folder) => {
          const count = documents.filter((doc) => doc.folderId === folder.id).length;
          return (
            <article
              key={folder.id}
              className="flex min-h-52 cursor-pointer flex-col rounded-lg bg-card p-4 shadow-[var(--shadow-card)]"
              onClick={() => onOpen(folder.id)}
            >
              {renaming === folder.id ? (
                <form
                  className="flex gap-2"
                  onClick={(event) => event.stopPropagation()}
                  onSubmit={(event) => {
                    event.preventDefault();
                    onRename(folder.id, rename);
                    setRenaming(null);
                  }}
                >
                  <Input
                    value={rename}
                    onChange={(e) => setRename(e.target.value)}
                    aria-label="Folder name"
                  />
                  <Button type="submit" size="sm">
                    Save
                  </Button>
                </form>
              ) : (
                <div>
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Folder
                  </p>
                  <h3 className="mt-2 text-lg font-medium tracking-tight">{folder.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {count} {count === 1 ? "document" : "documents"}
                  </p>
                </div>
              )}
              <div
                className="mt-auto flex gap-2 pt-4"
                onClick={(event) => event.stopPropagation()}
              >
                <Button size="sm" variant="outline" onClick={() => onOpen(folder.id)}>
                  Open
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setRenaming(folder.id);
                    setRename(folder.name);
                  }}
                >
                  Rename
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-transparent bg-transparent font-bold text-[#ff0000] shadow-none hover:bg-[#ffd0d0] hover:text-[#ff0000]"
                  onClick={() => onRemove(folder)}
                >
                  Delete
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}

function RailButton({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex w-16 flex-col items-center gap-1 rounded-md px-1 py-2 text-[10px] leading-tight",
        active ? "bg-[#e6f3fe] font-bold text-[#0075de]" : "text-muted-foreground",
      )}
    >
      <span className="[&_svg]:size-5">{children}</span>
      {label}
    </button>
  );
}

function TemplatesPanel({
  customTemplates,
  making,
  onMake,
  onCancelMake,
  onCreate,
  onUse,
  onRemove,
}: {
  customTemplates: DocTemplate[];
  making: boolean;
  onMake: () => void;
  onCancelMake: () => void;
  onCreate: (
    template: Pick<DocTemplate, "name" | "category" | "remindDays" | "notes"> & Partial<DocTemplate>,
  ) => void;
  onUse: (template: DocTemplate) => void;
  onRemove: (id: string) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CategoryId>("other");
  const [remindDays, setRemindDays] = useState(30);
  const [notes, setNotes] = useState("");
  const [preview, setPreview] = useState<DocTemplate | null>(null);

  if (preview) {
    return (
      <TemplatePreview
        template={preview}
        onBack={() => setPreview(null)}
        onUse={() => onUse(preview)}
      />
    );
  }

  return (
    <main className="px-4 py-5 pb-16">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Tap a template to preview it.</p>
        <Button size="sm" onClick={onMake}>
          <Plus />
          Make your own
        </Button>
      </div>
      {making ? (
        <form
          className="mb-4 grid gap-3 rounded-lg bg-card p-4 shadow-[var(--shadow-card)]"
          onSubmit={(event) => {
            event.preventDefault();
            if (!name.trim()) return;
            onCreate({ name, category, remindDays, notes });
            setName("");
            setNotes("");
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="tpl-name">Template name</Label>
            <Input id="tpl-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="tpl-cat">Category</Label>
              <select
                id="tpl-cat"
                className={fieldClass}
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tpl-remind">Remind</Label>
              <select
                id="tpl-remind"
                className={fieldClass}
                value={remindDays}
                onChange={(e) => setRemindDays(Number(e.target.value))}
              >
                {REMIND_OPTIONS.map((opt) => (
                  <option key={opt.days} value={opt.days}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tpl-notes">Default note</Label>
            <Textarea id="tpl-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancelMake}>
              Cancel
            </Button>
            <Button type="submit">Save template</Button>
          </div>
        </form>
      ) : null}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {BUILTIN_TEMPLATES.map((template) => (
          <TemplateCard key={template.id} template={template} onUse={onUse} onPreview={setPreview} />
        ))}
        {customTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onUse={onUse}
            onPreview={setPreview}
            onRemove={onRemove}
          />
        ))}
      </div>
    </main>
  );
}

function TemplateCard({
  template,
  onUse,
  onPreview,
  onRemove,
}: {
  template: DocTemplate;
  onUse: (template: DocTemplate) => void;
  onPreview: (template: DocTemplate) => void;
  onRemove?: (id: string) => void;
}) {
  return (
    <article className="flex min-h-40 flex-col rounded-lg bg-card p-4 shadow-[var(--shadow-card)]">
      <button type="button" onClick={() => onPreview(template)} className="text-left">
        <p className="text-xs tracking-widest text-muted-foreground uppercase">
          {onRemove ? "Yours" : "Basic"}
        </p>
        <h2 className="mt-2 font-medium">{template.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{template.summary || template.notes}</p>
      </button>
      <div className="mt-4 flex flex-1 items-end gap-2">
        <Button size="sm" variant="outline" onClick={() => onPreview(template)}>
          Preview
        </Button>
        <Button size="sm" onClick={() => onUse(template)}>
          Use
        </Button>
        {onRemove ? (
          <Button size="sm" variant="outline" onClick={() => onRemove(template.id)}>
            Delete
          </Button>
        ) : null}
      </div>
    </article>
  );
}

function zoneChoices(current: string): string[] {
  return current && !TIMEZONE_OPTIONS.includes(current)
    ? [current, ...TIMEZONE_OPTIONS]
    : TIMEZONE_OPTIONS;
}

function AccountPanel({
  account,
  passwordSet,
  onAccount,
  onPassword,
  twoFactor,
  onTwoFactor,
  timezone,
  zones,
  onTimezone,
}: {
  account: AccountProfile;
  passwordSet: boolean;
  onAccount: (account: AccountProfile) => void;
  onPassword: (current: string, next: string) => Promise<"ok" | "wrong" | "short">;
  twoFactor: TwoFactor | null;
  onTwoFactor: (method: TwoFactorMethod | null) => "ok" | "email" | "phone";
  timezone: string;
  zones: string[];
  onTimezone: (timezone: string) => void;
}) {
  const [profile, setProfile] = useState(account);
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pickingFactor, setPickingFactor] = useState(false);

  const methods: { id: TwoFactorMethod; label: string }[] = [
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone" },
    { id: "app", label: "Authenticator app" },
  ];

  function chooseFactor(method: TwoFactorMethod) {
    const result = onTwoFactor(method);
    if (result === "email") {
      toast.error("Add an email before using email codes");
      return;
    }
    if (result === "phone") {
      toast.error("Add a phone number before using text codes");
      return;
    }
    setPickingFactor(false);
    toast.success("Two-factor authentication is on");
  }

  useEffect(() => {
    setProfile(account);
  }, [account]);

  function saveAccount() {
    const email = profile.email.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Enter a valid email");
      return;
    }
    onAccount(profile);
    toast.success("Account saved");
  }

  async function savePassword() {
    if (nextPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const result = await onPassword(currentPassword, nextPassword);
    if (result === "short") {
      toast.error("Use at least 8 characters");
      return;
    }
    if (result === "wrong") {
      toast.error("Current password is wrong");
      return;
    }
    setCurrentPassword("");
    setNextPassword("");
    setConfirmPassword("");
    setChangingPassword(false);
    toast.success("Password updated");
  }

  return (
    <main className="flex min-h-full p-4 md:p-6">
      <section className="flex w-full flex-1 flex-col rounded-lg bg-card p-5 shadow-[var(--shadow-card)] md:p-8">
        <h2 className="font-medium">Your details</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Name, phone, email, and timezone for this board.
        </p>
        <div className="mt-6 grid flex-1 content-start gap-4 md:grid-cols-2 md:gap-x-8 md:gap-y-5">
          <label className="grid gap-1.5 text-sm">
            First name
            <Input
              value={profile.firstName}
              onChange={(event) => setProfile({ ...profile, firstName: event.target.value })}
              autoComplete="given-name"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            Last name
            <Input
              value={profile.lastName}
              onChange={(event) => setProfile({ ...profile, lastName: event.target.value })}
              autoComplete="family-name"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            Phone
            <Input
              value={profile.phone}
              onChange={(event) => setProfile({ ...profile, phone: event.target.value })}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            Email
            <Input
              value={profile.email}
              onChange={(event) => setProfile({ ...profile, email: event.target.value })}
              type="email"
              autoComplete="email"
            />
          </label>
          <label className="grid gap-1.5 text-sm md:col-span-2">
            Timezone
            <select
              className={fieldClass}
              value={timezone}
              onChange={(event) => onTimezone(event.target.value)}
              aria-label="Timezone"
            >
              {zones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </label>
          <p className="text-sm text-muted-foreground md:col-span-2">
            Reminders are meant for 8:00 AM in this zone.
          </p>
          {changingPassword ? (
            <div className="grid gap-2 md:col-span-2 md:grid-cols-2 md:gap-x-8">
              {passwordSet ? (
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  placeholder="Current password"
                  autoComplete="current-password"
                  className="md:col-span-2"
                />
              ) : null}
              <Input
                type="password"
                value={nextPassword}
                onChange={(event) => setNextPassword(event.target.value)}
                placeholder="New password"
                autoComplete="new-password"
              />
              <Input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm password"
                autoComplete="new-password"
              />
            </div>
          ) : null}
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          <Button size="sm" onClick={saveAccount}>
            Save account
          </Button>
          <Button size="sm" variant="outline" onClick={() => setChangingPassword((open) => !open)}>
            Change password
          </Button>
          {changingPassword ? (
            <Button size="sm" onClick={() => void savePassword()}>
              Save password
            </Button>
          ) : null}
        </div>
        <div className="mt-8 border-t border-border pt-6">
          <h2 className="font-medium">Two-factor authentication</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {twoFactor
              ? `On, using ${twoFactor.method === "app" ? "an authenticator app" : twoFactor.method === "phone" ? "your phone" : "your email"}.`
              : "Off. Turn it on and pick how you want the code."}
          </p>
          {twoFactor ? (
            <Button className="mt-3" size="sm" variant="outline" onClick={() => onTwoFactor(null)}>
              Turn off 2FA
            </Button>
          ) : (
            <Button className="mt-3" size="sm" variant="outline" onClick={() => setPickingFactor((open) => !open)}>
              {pickingFactor ? "Cancel" : "Enable 2FA"}
            </Button>
          )}
          {twoFactor || pickingFactor ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {methods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => chooseFactor(method.id)}
                  className={cn(
                    "h-11 rounded-lg text-sm font-medium",
                    twoFactor?.method === method.id ? "bg-foreground text-background" : "bg-background",
                  )}
                >
                  {method.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function SettingsPanel({
  theme,
  plan,
  onTheme,
  onSubscribe,
  onFree,
  onExport,
  onImport,
  onSamples,
}: {
  theme: "light" | "dark";
  plan: "free" | "plus" | "monthly" | "yearly" | "lifetime";
  onTheme: (theme: "light" | "dark") => void;
  onSubscribe: () => void;
  onFree: () => void;
  onExport: () => void;
  onImport: () => void;
  onSamples: () => void;
}) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 py-8">
      <section className="rounded-lg bg-card p-4 shadow-[var(--shadow-card)]">
        <h2 className="font-medium">Appearance</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {theme === "dark" ? "Dark board." : "Light board."}
        </p>
        <Button
          className="mt-3"
          variant="outline"
          size="sm"
          onClick={() => onTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "Use light mode" : "Use dark mode"}
        </Button>
      </section>
      <section className="rounded-lg bg-card p-4 shadow-[var(--shadow-card)]">
        <h2 className="font-medium">Plan</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {plan === "free"
            ? "Free: reminders on the first three documents, files up to 10 MB."
            : plan === "lifetime"
              ? "Lifetime Plus: reminders on every document, files up to 50 MB. Paid once."
              : plan === "yearly"
                ? "Yearly Plus: reminders on every document, files up to 50 MB."
                : "Plus: reminders on every document, files up to 50 MB."}
        </p>
        <div className="mt-3">
          {plan !== "free" ? (
            <Button variant="outline" size="sm" onClick={onFree}>
              Back to Free
            </Button>
          ) : (
            <Button size="sm" onClick={onSubscribe}>
              Subscribe
            </Button>
          )}
        </div>
      </section>
      <section className="rounded-lg bg-card p-4 shadow-[var(--shadow-card)]">
        <h2 className="font-medium">Library</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onExport}>
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={onImport}>
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={onSamples}>
            Restore samples
          </Button>
        </div>
      </section>
      <section className="rounded-lg bg-card p-4 shadow-[var(--shadow-card)]">
        <h2 className="font-medium">Support</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Questions about the board?{" "}
          <a className="text-foreground underline" href="mailto:sidequestbh@gmail.com">
            sidequestbh@gmail.com
          </a>
        </p>
      </section>
    </main>
  );
}
