import { Lock, MoreHorizontal, RefreshCw } from "lucide-react";
import {
  categoryLabel,
  daysUntil,
  DECISIONS,
  formatDays,
  formatExpiry,
  inReminderWindow,
  noticeAlertWindow,
  STATUS_META,
  statusFromDays,
  type DocumentRecord,
} from "@/lib/documents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type DocumentCardProps = {
  document: DocumentRecord;
  now: Date;
  timeZone?: string;
  onEdit: (doc: DocumentRecord) => void;
  onOpen?: (doc: DocumentRecord) => void;
  onRenew: (doc: DocumentRecord) => void;
  onRemove: (doc: DocumentRecord) => void;
  onMove?: (doc: DocumentRecord) => void;
  locked?: boolean;
  onUpgrade?: () => void;
};

export function DocumentCard({
  document,
  now,
  timeZone,
  onEdit,
  onOpen,
  onRenew,
  onRemove,
  onMove,
  locked = false,
  onUpgrade,
}: DocumentCardProps) {
  const expiryDays = daysUntil(document.expiryDate, now, timeZone);
  const noticeDays = daysUntil(document.noticeDeadline || document.expiryDate, now, timeZone);
  const status = statusFromDays(Math.min(expiryDays, noticeDays));
  const meta = STATUS_META[status];
  const reminding = inReminderWindow(document, now, timeZone);
  const window = noticeAlertWindow(noticeDays);
  const decision = DECISIONS.find((item) => item.id === document.decision)?.label ?? "Active";

  return (
    <article
      className={cn(
        "stagger-in cursor-pointer rounded-lg bg-card p-4 shadow-[var(--shadow-card)] transition-[box-shadow] duration-150 ease-out hover:shadow-[var(--shadow-card-hover)]",
        meta.frame,
      )}
      onClick={() => onOpen?.(document)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("size-2 shrink-0 rounded-full", meta.pip)} />
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {categoryLabel(document.category)}
            </p>
            <Badge className={meta.className}>{meta.label}</Badge>
            <Badge className="bg-muted text-foreground">{decision}</Badge>
            {reminding && !locked ? (
              <Badge className="bg-muted text-muted-foreground">Reminder due</Badge>
            ) : null}
            {locked ? (
              <Badge className="bg-foreground text-background">Reminders paused</Badge>
            ) : null}
          </div>
          <h3 className="mt-2 font-sans text-lg font-medium tracking-tight text-foreground">
            {document.title}
          </h3>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {[document.issuer, document.reference].filter(Boolean).join(" · ") ||
              "No issuer listed"}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Actions for ${document.title}`}
              onClick={(event) => event.stopPropagation()}
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onEdit(document)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onRenew(document)}>
              Mark renewed
            </DropdownMenuItem>
            {onMove ? (
              <DropdownMenuItem onSelect={() => onMove(document)}>Move to folder</DropdownMenuItem>
            ) : null}
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => onRemove(document)}>
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p
            className={cn(
              "font-sans text-2xl leading-none font-medium tabular-nums tracking-tight",
              meta.days,
            )}
          >
            {formatDays(expiryDays)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {status === "expired" ? "Expired" : "Expires"} {formatExpiry(document.expiryDate)}
          </p>
          <p className={cn("mt-1 text-sm", window ? "font-medium text-destructive" : "text-muted-foreground")}>
            Notice {formatExpiry(document.noticeDeadline || document.expiryDate)}
            {window ? ` · ${window}-day alert` : ""}
            {document.owner ? ` · ${document.owner}` : ""}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={(event) => {
            event.stopPropagation();
            onRenew(document);
          }}
        >
          <RefreshCw />
          Renew
        </Button>
      </div>

      {locked ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onUpgrade?.();
          }}
          className="mt-4 flex w-full items-center gap-2 rounded-md bg-muted px-3 py-3 text-left text-sm text-foreground"
        >
          <Lock className="size-4 shrink-0" />
          Upgrade to activate reminders on this document.
        </button>
      ) : null}

      {document.fileName ? (
        <p className="mt-3 text-sm text-muted-foreground">PDF · {document.fileName}</p>
      ) : null}

      {document.actionLink ? (
        <p className="mt-3 truncate text-sm text-muted-foreground">Renewal link ready</p>
      ) : null}

      {document.notes ? (
        <p className="mt-4 border-t border-border pt-3 text-sm text-muted-foreground">
          {document.notes}
        </p>
      ) : null}
    </article>
  );
}
