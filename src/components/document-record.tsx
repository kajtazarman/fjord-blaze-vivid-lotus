import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  BUILTIN_TEMPLATES,
  DECISIONS,
  REMIND_OPTIONS,
  applyFields,
  formatExpiry,
  previewFields,
  type Decision,
  type DocumentDraft,
  type DocTemplate,
  type FieldDef,
  type Folder,
} from "@/lib/documents";
import { useDocket } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const fieldClass =
  "flex h-11 w-full rounded-md border border-border bg-background px-3 text-base text-foreground outline-none focus-visible:border-foreground md:text-sm";

type DocumentRecordViewProps = {
  initial: DocumentDraft;
  templates: DocTemplate[];
  folders: Folder[];
  editing: boolean;
  onBack: () => void;
  onSave: (draft: DocumentDraft) => void;
};

export function DocumentRecordView({
  initial,
  templates,
  folders,
  editing: startEditing,
  onBack,
  onSave,
}: DocumentRecordViewProps) {
  const template =
    templates.find((item) => item.id === initial.templateId) ?? BUILTIN_TEMPLATES[0];
  const [draft, setDraft] = useState<DocumentDraft>(initial);
  const [editing, setEditing] = useState(startEditing);
  const [error, setError] = useState<string | null>(null);
  const fields = draft.fields ?? {};
  const account = useDocket((state) => state.account);
  const documents = useDocket((state) => state.documents);
  const me = [account.firstName, account.lastName].filter(Boolean).join(" ") || account.email || "Me";
  const owners = [...new Set([me, ...documents.map((doc) => doc.owner.trim()).filter(Boolean)])];

  function setField(key: string, value: string) {
    setDraft((prev) => ({ ...prev, fields: { ...prev.fields, [key]: value } }));
  }

  function cancelEdit() {
    if (startEditing) {
      onBack();
      return;
    }
    setDraft(initial);
    setEditing(false);
    setError(null);
  }

  function save() {
    const next = applyFields(draft, template);
    if (!next.title) {
      setError("Fill in the name.");
      return;
    }
    if (!next.expiryDate) {
      setError("Set the expiration date.");
      return;
    }
    if (!next.noticeDeadline) {
      setError("Set the notice deadline.");
      return;
    }
    if (next.noticeDeadline > next.expiryDate) {
      setError("The notice deadline has to be on or before the expiration date.");
      return;
    }
    setError(null);
    onSave(next);
  }

  const grid = template.fields.filter((field) => field.section === "grid");
  const footer = template.fields.filter((field) => field.section === "footer");

  return (
    <div className="w-full px-4 py-5 pb-16 md:px-6">
      <button
        type="button"
        onClick={onBack}
        className="back-link"
      >
        <ArrowLeft className="size-4" />
        Back to the board
      </button>

      <header className="flex items-start justify-between gap-4 rounded-lg bg-foreground px-5 py-4 text-background">
        <div className="min-w-0">
          <p className="text-[11px] tracking-wide text-background/60 uppercase">{template.name}</p>
          <h1 className="text-lg font-medium tracking-tight">{draft.title || template.name}</h1>
          <p className="mt-1 text-sm text-background/70">{template.summary}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          {editing ? (
            <>
              <Button
                variant="outline"
                className="border-background/30 bg-transparent text-background hover:bg-background/10"
                onClick={cancelEdit}
              >
                Cancel
              </Button>
              <Button className="bg-background text-foreground hover:bg-background/90" onClick={save}>
                Save
              </Button>
            </>
          ) : (
            <Button className="bg-background text-foreground hover:bg-background/90" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
        </div>
      </header>

      <section className="mt-3 rounded-lg bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="grid gap-4 sm:grid-cols-2">
          {grid.map((field) => (
            <Field
              key={field.key}
              field={field}
              value={fields[field.key] ?? ""}
              editing={editing}
              onChange={setField}
            />
          ))}
        </div>
      </section>

      <section className="mt-3 rounded-lg border-l-4 border-foreground bg-muted px-4 py-3">
        <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          Reminder
        </p>
        {editing ? (
          <select
            className={cn(fieldClass, "mt-2")}
            value={fields.remind ?? String(draft.remindDays)}
            onChange={(event) => setField("remind", event.target.value)}
            aria-label="Reminder"
          >
            {REMIND_OPTIONS.map((option) => (
              <option key={option.days} value={option.days}>
                Notify {option.label}
              </option>
            ))}
          </select>
        ) : (
          <p className="mt-1 text-sm">
            Notify {remindText(fields.remind ?? String(draft.remindDays))}
          </p>
        )}
      </section>

      <section className="mt-3 rounded-lg bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          Notice and decision
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm">
            Notice deadline
            {editing ? (
              <DatePicker
                label="Notice deadline"
                value={draft.noticeDeadline}
                onChange={(noticeDeadline) => setDraft((prev) => ({ ...prev, noticeDeadline }))}
              />
            ) : (
              <p>{draft.noticeDeadline ? formatExpiry(draft.noticeDeadline) : "Not set"}</p>
            )}
          </label>
          <label className="grid gap-1.5 text-sm">
            Expiration date
            <p className="flex h-11 items-center">{draft.expiryDate ? formatExpiry(draft.expiryDate) : "Not set"}</p>
          </label>
          <label className="grid gap-1.5 text-sm">
            Owner
            {editing ? (
              <>
                <input
                  className={fieldClass}
                  list="document-owners"
                  value={draft.owner}
                  placeholder={me}
                  onChange={(event) => setDraft((prev) => ({ ...prev, owner: event.target.value }))}
                />
                <datalist id="document-owners">
                  {owners.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </>
            ) : (
              <p>{draft.owner || me}</p>
            )}
          </label>
          <div className="grid gap-1.5 text-sm">
            Status
            {editing ? (
              <div className="flex flex-wrap gap-2">
                {DECISIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDraft((prev) => ({ ...prev, decision: item.id as Decision }))}
                    className={cn(
                      "h-9 rounded-md px-3 text-sm",
                      draft.decision === item.id ? "bg-foreground text-background" : "bg-muted text-foreground",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : (
              <p>{DECISIONS.find((item) => item.id === draft.decision)?.label}</p>
            )}
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Alerts fire 90, 60, and 30 days before the notice deadline, not the expiration date.
        </p>
      </section>

      <section className="mt-3 rounded-lg bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="grid gap-4">
          {footer.map((field) => (
            <Field
              key={field.key}
              field={field}
              value={fields[field.key] ?? ""}
              editing={editing}
              onChange={setField}
            />
          ))}
        </div>
      </section>

      {editing && (
        <section className="mt-3 rounded-lg bg-card p-4 shadow-[var(--shadow-card)]">
          <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Folder
          </p>
          <select
            className={cn(fieldClass, "mt-2 max-w-md")}
            value={draft.folderId}
            onChange={(event) => setDraft((prev) => ({ ...prev, folderId: event.target.value }))}
            aria-label="Folder"
          >
            <option value="">No folder</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </section>
      )}

      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

      <div className="mt-4 flex justify-end gap-2">
        {editing ? (
          <>
            <Button variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
            <Button onClick={save}>Save record</Button>
          </>
        ) : (
          <Button onClick={() => setEditing(true)}>Edit</Button>
        )}
      </div>
    </div>
  );
}

export function TemplatePreview({
  template,
  onBack,
  onUse,
}: {
  template: DocTemplate;
  onBack: () => void;
  onUse: () => void;
}) {
  const values = previewFields(template);
  const grid = template.fields.filter((field) => field.section === "grid");
  const footer = template.fields.filter((field) => field.section === "footer");

  return (
    <div className="w-full px-4 py-5 pb-16 md:px-6">
      <button
        type="button"
        onClick={onBack}
        className="back-link"
      >
        <ArrowLeft className="size-4" />
        Back to templates
      </button>

      <header className="rounded-lg bg-foreground px-5 py-4 text-background">
        <p className="text-[11px] tracking-wide text-background/60 uppercase">Preview</p>
        <h1 className="text-lg font-medium tracking-tight">{template.name}</h1>
        <p className="mt-1 text-sm text-background/70">{template.summary}</p>
      </header>

      <section className="mt-3 rounded-lg bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="grid gap-4 sm:grid-cols-2">
          {grid.map((field) => (
            <Field
              key={field.key}
              field={field}
              value={values[field.key] ?? ""}
              editing={false}
              onChange={() => undefined}
            />
          ))}
        </div>
      </section>

      <section className="mt-3 rounded-lg border-l-4 border-foreground bg-muted px-4 py-3">
        <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          Reminder
        </p>
        <p className="mt-1 text-sm">Notify {remindText(values.remind ?? String(template.remindDays))}</p>
      </section>

      <section className="mt-3 rounded-lg bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="grid gap-4">
          {footer.map((field) => (
            <Field
              key={field.key}
              field={field}
              value={values[field.key] ?? ""}
              editing={false}
              onChange={() => undefined}
            />
          ))}
        </div>
      </section>

      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onUse}>Use this template</Button>
      </div>
    </div>
  );
}

function Field({
  field,
  value,
  editing,
  onChange,
}: {
  field: FieldDef;
  value: string;
  editing: boolean;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <label className={cn("grid gap-1.5", field.wide && "sm:col-span-2")}>
      <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        {field.label}
      </span>
      {editing ? (
        field.kind === "long" ? (
          <textarea
            value={value}
            onChange={(event) => onChange(field.key, event.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground outline-none focus-visible:border-foreground md:text-sm"
          />
        ) : field.kind === "date" ? (
          <DatePicker label={field.label} value={value} onChange={(next) => onChange(field.key, next)} />
        ) : (
          <Input
            type="text"
            value={value}
            placeholder={field.placeholder}
            onChange={(event) => onChange(field.key, event.target.value)}
          />
        )
      ) : (
        <p className="min-h-11 rounded-md border border-border bg-background px-3 py-2.5 text-sm">
          {displayValue(field, value)}
        </p>
      )}
    </label>
  );
}

function displayValue(field: FieldDef, value: string): string {
  if (!value) return "—";
  if (field.kind === "date") {
    const [year, month, day] = value.split("-");
    if (year && month && day) return `${day} / ${month} / ${year}`;
  }
  return value;
}

function remindText(value: string): string {
  const match = REMIND_OPTIONS.find((option) => String(option.days) === value);
  return match ? match.label : `${value} days before`;
}
