import { useState, type FormEvent } from "react";
import { CATEGORIES, REMIND_OPTIONS, type DocumentDraft, type Folder } from "@/lib/documents";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const fieldClass =
  "flex h-11 w-full rounded-md border border-border bg-card px-3 text-base text-foreground outline-none transition-[box-shadow,border-color] duration-150 ease-out focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 md:text-sm";

type DocumentFormProps = {
  initial: DocumentDraft;
  submitLabel: string;
  folders?: Folder[];
  onSubmit: (draft: DocumentDraft) => void;
  onCancel: () => void;
};

export function DocumentForm({
  initial,
  submitLabel,
  folders = [],
  onSubmit,
  onCancel,
}: DocumentFormProps) {
  const [draft, setDraft] = useState<DocumentDraft>(initial);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof DocumentDraft>(key: K, value: DocumentDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!draft.title.trim()) {
      setError("Give this document a name.");
      return;
    }
    if (!draft.expiryDate) {
      setError("Set an expiry date.");
      return;
    }
    setError(null);
    onSubmit(draft);
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="doc-title">Document</Label>
        <Input
          id="doc-title"
          value={draft.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="Sprinter registration"
          autoComplete="off"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="doc-category">Category</Label>
          <select
            id="doc-category"
            className={fieldClass}
            value={draft.category}
            onChange={(e) =>
              update("category", e.target.value as DocumentDraft["category"])
            }
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        {folders.length ? (
          <div className="grid gap-2">
            <Label htmlFor="doc-folder">Folder</Label>
            <select
              id="doc-folder"
              className={fieldClass}
              value={draft.folderId}
              onChange={(e) => update("folderId", e.target.value)}
            >
              <option value="">No folder</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div className="grid gap-2">
          <Label htmlFor="doc-expiry">Expiry date</Label>
          <DatePicker
            label="Expiry date"
            value={draft.expiryDate}
            onChange={(expiryDate) => update("expiryDate", expiryDate)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="doc-issuer">Issuer</Label>
          <Input
            id="doc-issuer"
            value={draft.issuer}
            onChange={(e) => update("issuer", e.target.value)}
            placeholder="Issuing authority"
            autoComplete="off"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="doc-ref">Reference</Label>
          <Input
            id="doc-ref"
            value={draft.reference}
            onChange={(e) => update("reference", e.target.value)}
            placeholder="Number or ID"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="doc-remind">Remind me</Label>
        <select
          id="doc-remind"
          className={fieldClass}
          value={draft.remindDays}
          onChange={(e) => update("remindDays", Number(e.target.value))}
        >
          {REMIND_OPTIONS.map((opt) => (
            <option key={opt.days} value={opt.days}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="doc-link">Renewal link</Label>
        <Input
          id="doc-link"
          type="url"
          value={draft.actionLink}
          onChange={(e) => update("actionLink", e.target.value)}
          placeholder="https://renewal-portal.example"
          autoComplete="off"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="doc-notes">Next steps</Label>
        <Textarea
          id="doc-notes"
          value={draft.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="What to do when the reminder arrives"
        />
      </div>

      {draft.fileName ? (
        <p className="text-sm text-muted-foreground">PDF · {draft.fileName}</p>
      ) : null}

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className={cn("sm:min-w-36")}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
