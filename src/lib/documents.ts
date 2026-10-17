import { addDays, differenceInCalendarDays, format, parseISO, startOfDay } from "date-fns";

export const CATEGORIES = [
  { id: "vehicle", label: "Vehicle" },
  { id: "lease", label: "Lease" },
  { id: "insurance", label: "Insurance" },
  { id: "license", label: "Licence" },
  { id: "contract", label: "Contract" },
  { id: "other", label: "Other" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const REMIND_OPTIONS = [
  { days: 1, label: "1 day before" },
  { days: 7, label: "7 days before" },
  { days: 14, label: "14 days before" },
  { days: 30, label: "30 days before" },
  { days: 60, label: "60 days before" },
  { days: 90, label: "90 days before" },
] as const;

export type Status = "expired" | "critical" | "soon" | "watch" | "current";

export const DECISIONS = [
  { id: "active", label: "Active" },
  { id: "renewing", label: "Renewing" },
  { id: "renegotiating", label: "Renegotiating" },
  { id: "canceling", label: "Canceling" },
  { id: "expired", label: "Expired" },
] as const;

export type Decision = (typeof DECISIONS)[number]["id"];

export const ALERT_WINDOWS = [90, 60, 30] as const;
export type AlertWindow = (typeof ALERT_WINDOWS)[number];

export type DocumentRecord = {
  id: string;
  title: string;
  category: CategoryId;
  issuer: string;
  reference: string;
  expiryDate: string;
  noticeDeadline: string;
  decision: Decision;
  owner: string;
  remindDays: number;
  notes: string;
  actionLink: string;
  fileName: string;
  folderId: string;
  templateId: string;
  fields: Record<string, string>;
  createdAt: string;
};

export type DocumentDraft = Omit<DocumentRecord, "id" | "createdAt">;

export const STATUS_META: Record<
  Status,
  { label: string; className: string; pip: string; frame: string; row: string; days: string }
> = {
  expired: {
    label: "Expired",
    className: "bg-destructive text-destructive-foreground",
    pip: "bg-destructive",
    frame: "border-2 border-destructive bg-danger-soft",
    row: "border-l-4 border-l-destructive bg-danger-soft",
    days: "text-destructive",
  },
  critical: {
    label: "This week",
    className: "bg-destructive text-destructive-foreground",
    pip: "bg-destructive",
    frame: "border-2 border-destructive bg-danger-soft",
    row: "border-l-4 border-l-destructive bg-danger-soft",
    days: "text-destructive",
  },
  soon: {
    label: "This month",
    className: "bg-warn-soft text-warn",
    pip: "bg-warn",
    frame: "border-2 border-warn bg-warn-soft",
    row: "border-l-4 border-l-warn bg-warn-soft",
    days: "text-warn",
  },
  watch: {
    label: "Upcoming",
    className: "bg-watch-soft text-watch",
    pip: "bg-watch",
    frame: "",
    row: "",
    days: "",
  },
  current: {
    label: "Current",
    className: "bg-ok-soft text-ok",
    pip: "bg-ok",
    frame: "",
    row: "",
    days: "",
  },
};

export const FREE_REMINDER_LIMIT = 3;

export function lockedDocumentIds(docs: DocumentRecord[]): Set<string> {
  const ordered = [...docs].sort(
    (a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id),
  );
  return new Set(ordered.slice(FREE_REMINDER_LIMIT).map((doc) => doc.id));
}

export function categoryLabel(id: CategoryId): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? "Other";
}

export function calendarDay(date: Date, timeZone?: string): string {
  if (timeZone) {
    try {
      return new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);
    } catch {
      /* fall through to the browser zone */
    }
  }
  return format(startOfDay(date), "yyyy-MM-dd");
}

export function daysUntil(expiryDate: string, now = new Date(), timeZone?: string): number {
  return differenceInCalendarDays(
    startOfDay(parseISO(expiryDate)),
    startOfDay(parseISO(calendarDay(now, timeZone))),
  );
}

export function statusFromDays(days: number): Status {
  if (days < 0) return "expired";
  if (days <= 7) return "critical";
  if (days <= 30) return "soon";
  if (days <= 90) return "watch";
  return "current";
}

export function formatExpiry(expiryDate: string): string {
  return format(parseISO(expiryDate), "d MMM yyyy");
}

export function formatDays(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  if (days < 0) return `${Math.abs(days)} days ago`;
  return `${days} days`;
}

export function inReminderWindow(
  doc: DocumentRecord,
  now = new Date(),
  timeZone?: string,
): boolean {
  const days = daysUntil(doc.expiryDate, now, timeZone);
  return days >= 0 && days <= doc.remindDays;
}

export function isoFromToday(offsetDays: number, now = new Date()): string {
  return format(addDays(startOfDay(now), offsetDays), "yyyy-MM-dd");
}

export function defaultNotice(expiryDate: string): string {
  const parsed = parseISO(expiryDate);
  if (Number.isNaN(parsed.getTime())) return isoFromToday(30);
  return format(addDays(parsed, -30), "yyyy-MM-dd");
}

export function isDecision(value: string | undefined): value is Decision {
  return DECISIONS.some((item) => item.id === value);
}

export function withAccountability(doc: DocumentRecord): DocumentRecord {
  const expiryDate = doc.expiryDate;
  const notice = doc.noticeDeadline || defaultNotice(expiryDate);
  const noticeDeadline = notice > expiryDate ? expiryDate : notice;
  return {
    ...doc,
    noticeDeadline,
    decision: isDecision(doc.decision)
      ? doc.decision
      : daysUntil(expiryDate) < 0
        ? "expired"
        : "active",
    owner: doc.owner ?? "",
  };
}

export function noticeAlertWindow(daysLeft: number): AlertWindow | null {
  if (daysLeft <= 0 || daysLeft > 90) return null;
  if (daysLeft <= 30) return 30;
  if (daysLeft <= 60) return 60;
  return 90;
}

export function isMine(owner: string, me: string): boolean {
  const name = owner.trim().toLowerCase();
  if (!name) return true;
  return name === me.trim().toLowerCase();
}

export function emptyDraft(): DocumentDraft {
  const expiryDate = isoFromToday(365);
  return {
    title: "",
    category: "vehicle",
    issuer: "",
    reference: "",
    expiryDate,
    noticeDeadline: defaultNotice(expiryDate),
    decision: "active",
    owner: "",
    remindDays: 30,
    notes: "",
    actionLink: "",
    fileName: "",
    folderId: "",
    templateId: "",
    fields: {},
  };
}

export type Folder = {
  id: string;
  name: string;
};

export type FieldKind = "text" | "date" | "long";
export type FieldSection = "grid" | "alert" | "footer";

export type FieldDef = {
  key: string;
  label: string;
  kind: FieldKind;
  placeholder: string;
  section: FieldSection;
  wide?: boolean;
};

export type DocTemplate = {
  id: string;
  name: string;
  summary: string;
  category: CategoryId;
  remindDays: number;
  notes: string;
  titleKey: string;
  expiryKey: string;
  issuerKey: string;
  referenceKey: string;
  linkKey: string;
  notesKey: string;
  fields: FieldDef[];
};

const personalFields: FieldDef[] = [
  { key: "item", label: "Item / document name", kind: "text", placeholder: "Passport, gym membership", section: "grid" },
  { key: "provider", label: "Provider / issuer", kind: "text", placeholder: "Government, Netflix, landlord", section: "grid" },
  { key: "account", label: "Account or ID number", kind: "text", placeholder: "Optional account info", section: "grid" },
  { key: "expiry", label: "Expiration date", kind: "date", placeholder: "DD / MM / YYYY", section: "grid" },
  { key: "link", label: "Website or document link", kind: "text", placeholder: "Login page or saved file", section: "footer" },
  { key: "notes", label: "What to do / notes", kind: "long", placeholder: "Cancel before the next charge, or what to bring to renew.", section: "footer" },
];

const employmentFields: FieldDef[] = [
  { key: "employee", label: "Employee / contractor name", kind: "text", placeholder: "Full legal name", section: "grid" },
  { key: "employer", label: "Employer / company", kind: "text", placeholder: "Company name", section: "grid" },
  { key: "role", label: "Job title / role", kind: "text", placeholder: "Senior developer", section: "grid" },
  { key: "contractType", label: "Contract type", kind: "text", placeholder: "Fixed-term, freelance", section: "grid" },
  { key: "start", label: "Contract start date", kind: "date", placeholder: "DD / MM / YYYY", section: "grid" },
  { key: "end", label: "Contract end date", kind: "date", placeholder: "DD / MM / YYYY", section: "grid" },
  { key: "link", label: "Original document link", kind: "text", placeholder: "HR portal, Drive, or website", section: "footer" },
  { key: "notice", label: "Notice period and conditions", kind: "long", placeholder: "Notice period, or what happens if it is extended.", section: "footer" },
];

const autoFields: FieldDef[] = [
  { key: "holder", label: "Policyholder name", kind: "text", placeholder: "Primary insured name", section: "grid" },
  { key: "provider", label: "Insurance provider", kind: "text", placeholder: "Allianz, Euroherc", section: "grid" },
  { key: "policy", label: "Policy number", kind: "text", placeholder: "Full policy ID", section: "grid", wide: true },
  { key: "vehicle", label: "Vehicle make and model", kind: "text", placeholder: "2024 Toyota RAV4", section: "grid" },
  { key: "plate", label: "Licence plate / VIN", kind: "text", placeholder: "Registration number or VIN", section: "grid" },
  { key: "start", label: "Coverage start date", kind: "date", placeholder: "DD / MM / YYYY", section: "grid" },
  { key: "expiry", label: "Policy expiry date", kind: "date", placeholder: "DD / MM / YYYY", section: "grid" },
  { key: "link", label: "Original document link", kind: "text", placeholder: "Portal, Drive, or website", section: "footer" },
  { key: "notes", label: "Additional notes", kind: "long", placeholder: "Broker, claims line, or what the cover includes.", section: "footer" },
];

const agreementFields: FieldDef[] = [
  { key: "title", label: "Document title", kind: "text", placeholder: "Commercial lease agreement", section: "grid" },
  { key: "reference", label: "Reference / ID number", kind: "text", placeholder: "LSE-2026-991", section: "grid" },
  { key: "primary", label: "Primary party", kind: "text", placeholder: "Your name or company", section: "grid" },
  { key: "secondary", label: "Secondary party", kind: "text", placeholder: "Counterparty name", section: "grid" },
  { key: "signed", label: "Date signed", kind: "date", placeholder: "DD / MM / YYYY", section: "grid" },
  { key: "expiry", label: "Expiration date", kind: "date", placeholder: "DD / MM / YYYY", section: "grid" },
  { key: "link", label: "Original document link", kind: "text", placeholder: "Drive, Dropbox, or website", section: "footer" },
  { key: "notes", label: "Key terms and notes", kind: "long", placeholder: "Obligations, cancellation, or the notice you must send.", section: "footer" },
];

export const BUILTIN_TEMPLATES: DocTemplate[] = [
  {
    id: "personal",
    name: "Personal reminder",
    summary: "Passports, memberships, subscriptions, and IDs.",
    category: "other",
    remindDays: 14,
    notes: "",
    titleKey: "item",
    expiryKey: "expiry",
    issuerKey: "provider",
    referenceKey: "account",
    linkKey: "link",
    notesKey: "notes",
    fields: personalFields,
  },
  {
    id: "employment",
    name: "Employment contract",
    summary: "Fixed-term, freelance, and probation agreements.",
    category: "contract",
    remindDays: 60,
    notes: "",
    titleKey: "employee",
    expiryKey: "end",
    issuerKey: "employer",
    referenceKey: "role",
    linkKey: "link",
    notesKey: "notice",
    fields: employmentFields,
  },
  {
    id: "auto-insurance",
    name: "Auto insurance",
    summary: "Vehicle cover, the plate, and the renewal date.",
    category: "insurance",
    remindDays: 30,
    notes: "",
    titleKey: "vehicle",
    expiryKey: "expiry",
    issuerKey: "provider",
    referenceKey: "policy",
    linkKey: "link",
    notesKey: "notes",
    fields: autoFields,
  },
  {
    id: "agreement",
    name: "General agreement",
    summary: "Leases, service agreements, and other contracts.",
    category: "lease",
    remindDays: 30,
    notes: "",
    titleKey: "title",
    expiryKey: "expiry",
    issuerKey: "secondary",
    referenceKey: "reference",
    linkKey: "link",
    notesKey: "notes",
    fields: agreementFields,
  },
];

export function templateById(id: string): DocTemplate | undefined {
  return BUILTIN_TEMPLATES.find((template) => template.id === id);
}

export function blankFields(template: DocTemplate): Record<string, string> {
  const fields: Record<string, string> = { remind: String(template.remindDays) };
  for (const field of template.fields) fields[field.key] = "";
  if (template.expiryKey) fields[template.expiryKey] = isoFromToday(365);
  return fields;
}

export function previewFields(template: DocTemplate): Record<string, string> {
  const fields = blankFields(template);
  const sample = PREVIEW_SAMPLES[template.id];
  if (!sample) {
    for (const field of template.fields) {
      fields[field.key] =
        field.kind === "date"
          ? isoFromToday(field.key === template.expiryKey ? 180 : -20)
          : field.placeholder;
    }
    return fields;
  }
  return { ...fields, ...sample() };
}

const PREVIEW_SAMPLES: Record<string, () => Record<string, string>> = {
  personal: () => ({
    item: "Passport",
    provider: "Ministry of Civil Affairs",
    account: "BA-482910",
    expiry: isoFromToday(140),
    link: "https://example.com/passport",
    notes: "Renew three months before the next trip. Bring the old booklet and a photo.",
  }),
  employment: () => ({
    employee: "Amira Hodžić",
    employer: "Studio North",
    role: "Designer",
    contractType: "Fixed-term",
    start: isoFromToday(-200),
    end: isoFromToday(90),
    link: "https://example.com/hr/contract",
    notice: "Thirty days written notice. The role can be extended once, in writing.",
  }),
  "auto-insurance": () => ({
    holder: "Lejla Begić",
    provider: "Euroherc",
    policy: "POL-2026-4418",
    vehicle: "2021 Volkswagen Golf",
    plate: "A12-K-345",
    start: isoFromToday(-40),
    expiry: isoFromToday(320),
    link: "https://example.com/policy",
    notes: "Full casco. The claims number is on the card in the glove box.",
  }),
  agreement: () => ({
    title: "Office lease",
    reference: "LSE-2026-014",
    primary: "Studio North",
    secondary: "Sarajevo Property",
    signed: isoFromToday(-60),
    expiry: isoFromToday(300),
    link: "https://example.com/lease",
    notes: "Three months notice to end. Rent is due on the first of the month.",
  }),
};

export function draftFromTemplate(template: DocTemplate): DocumentDraft {
  const fields = blankFields(template);
  return applyFields(
    {
      ...emptyDraft(),
      title: "",
      category: template.category,
      remindDays: template.remindDays,
      templateId: template.id,
      fields,
    },
    template,
  );
}

export function applyFields(draft: DocumentDraft, template: DocTemplate): DocumentDraft {
  const fields = draft.fields ?? {};
  const remind = Number(fields.remind);
  return {
    ...draft,
    templateId: template.id,
    title: (fields[template.titleKey] ?? draft.title).trim(),
    expiryDate: fields[template.expiryKey] || draft.expiryDate,
    issuer: (fields[template.issuerKey] ?? draft.issuer).trim(),
    reference: (fields[template.referenceKey] ?? draft.reference).trim(),
    notes: (fields[template.notesKey] ?? draft.notes).trim(),
    actionLink: (fields[template.linkKey] ?? draft.actionLink).trim(),
    remindDays: Number.isFinite(remind) && remind > 0 ? remind : draft.remindDays,
    fields,
  };
}

export function fieldsFromDocument(doc: DocumentRecord): Record<string, string> {
  if (doc.fields && Object.keys(doc.fields).length) return { ...doc.fields };
  const template = templateById(doc.templateId) ?? BUILTIN_TEMPLATES[0];
  return {
    ...blankFields(template),
    [template.titleKey]: doc.title,
    [template.expiryKey]: doc.expiryDate,
    [template.issuerKey]: doc.issuer,
    [template.referenceKey]: doc.reference,
    [template.linkKey]: doc.actionLink ?? "",
    [template.notesKey]: doc.notes,
    remind: String(doc.remindDays || template.remindDays),
  };
}

export function draftFromDocument(doc: DocumentRecord): DocumentDraft {
  return {
    title: doc.title,
    category: doc.category,
    issuer: doc.issuer,
    reference: doc.reference,
    expiryDate: doc.expiryDate,
    noticeDeadline: doc.noticeDeadline,
    decision: doc.decision,
    owner: doc.owner,
    remindDays: doc.remindDays,
    notes: doc.notes,
    actionLink: doc.actionLink ?? "",
    fileName: doc.fileName ?? "",
    folderId: doc.folderId ?? "",
    templateId: doc.templateId ?? "",
    fields: doc.fields ?? {},
  };
}

export function createDemoDocuments(now = new Date()): DocumentRecord[] {
  return DEMO_SPECS.map((spec) => demoRecord(spec, now));
}

export function backfillDemoFields(doc: DocumentRecord, now = new Date()): DocumentRecord {
  const spec = DEMO_SPECS.find((item) => item.id === doc.id);
  if (!spec) return doc;
  const sample = demoRecord(spec, now);
  const fields = { ...sample.fields };
  for (const [key, value] of Object.entries(doc.fields ?? {})) {
    if (value) fields[key] = value;
  }
  return withAccountability({
    ...doc,
    notes: doc.notes || sample.notes,
    actionLink: doc.actionLink || sample.actionLink,
    fields,
  });
}

type DemoSpec = {
  id: string;
  templateId: string;
  category: CategoryId;
  offset: number;
  noticeOffset?: number;
  age: number;
  remindDays: number;
  decision: Decision;
  owner: string;
  fields: Record<string, string>;
  startKey?: string;
  startOffset?: number;
};

const DEMO_SPECS: DemoSpec[] = [
  {
    id: "demo-1",
    templateId: "auto-insurance",
    category: "vehicle",
    offset: 6,
    noticeOffset: 2,
    age: 6,
    remindDays: 7,
    decision: "renewing",
    owner: "",
    startKey: "start",
    startOffset: -340,
    fields: {
      holder: "Haris Delić",
      provider: "MUP KS",
      policy: "REG-2026-448",
      vehicle: "Sprinter registration",
      plate: "A12-K-448",
      link: "https://www.mup.ks.gov.ba",
      notes: "Book the technical inspection before the plate lapses. Bring the old booklet.",
    },
  },
  {
    id: "demo-2",
    templateId: "auto-insurance",
    category: "insurance",
    offset: 4,
    noticeOffset: 1,
    age: 5,
    remindDays: 14,
    decision: "active",
    owner: "Alma Kovač",
    startKey: "start",
    startOffset: -200,
    fields: {
      holder: "Studio North d.o.o.",
      provider: "Sarajevo Osiguranje",
      policy: "POL-22091",
      vehicle: "Commercial liability",
      plate: "Fleet schedule B",
      link: "https://example.com/liability",
      notes: "Renewal quote is already in the inbox. Broker is Alma at extension 14.",
    },
  },
  {
    id: "demo-3",
    templateId: "agreement",
    category: "lease",
    offset: 19,
    noticeOffset: 12,
    age: 4,
    remindDays: 30,
    decision: "renegotiating",
    owner: "",
    startKey: "signed",
    startOffset: -400,
    fields: {
      title: "Warehouse lease",
      reference: "UNIT-4",
      primary: "Studio North d.o.o.",
      secondary: "Stup industrial park",
      link: "https://example.com/lease/unit-4",
      notes: "Notice period is 30 days if we do not renew. Rent is due on the first.",
    },
  },
  {
    id: "demo-4",
    templateId: "personal",
    category: "license",
    offset: -12,
    noticeOffset: -20,
    age: 3,
    remindDays: 30,
    decision: "expired",
    owner: "Lejla Begić",
    fields: {
      item: "Operating licence",
      provider: "Općina Novo Sarajevo",
      account: "DL-118",
      link: "https://example.com/licence",
      notes: "Counter hours are mornings only. Take the fee receipt and a photo ID.",
    },
  },
  {
    id: "demo-5",
    templateId: "auto-insurance",
    category: "insurance",
    offset: 48,
    noticeOffset: 28,
    age: 2,
    remindDays: 30,
    decision: "canceling",
    owner: "",
    startKey: "start",
    startOffset: -90,
    fields: {
      holder: "Lejla Begić",
      provider: "Euroherc",
      policy: "FL-90",
      vehicle: "Fleet policy",
      plate: "E12-A-221",
      link: "https://example.com/fleet",
      notes: "Covers the three panel vans. Claims line is on the card in each glove box.",
    },
  },
  {
    id: "demo-6",
    templateId: "agreement",
    category: "contract",
    offset: 96,
    noticeOffset: 55,
    age: 1,
    remindDays: 60,
    decision: "active",
    owner: "Atlas Field Service",
    startKey: "signed",
    startOffset: -120,
    fields: {
      title: "Service contract",
      reference: "SC-14",
      primary: "Studio North d.o.o.",
      secondary: "Atlas Field Service",
      link: "https://example.com/service/sc-14",
      notes: "Quarterly site visits. Either side can end it with 60 days written notice.",
    },
  },
];

function demoRecord(spec: DemoSpec, now: Date): DocumentRecord {
  const template = templateById(spec.templateId) ?? BUILTIN_TEMPLATES[0];
  const expiryDate = isoFromToday(spec.offset, now);
  const noticeDeadline = isoFromToday(spec.noticeOffset ?? spec.offset - 30, now);
  const fields = {
    ...blankFields(template),
    ...spec.fields,
    [template.expiryKey]: expiryDate,
    remind: String(spec.remindDays),
  };
  if (spec.startKey) fields[spec.startKey] = isoFromToday(spec.startOffset ?? -30, now);
  return {
    id: spec.id,
    title: fields[template.titleKey] || spec.fields.title || "Document",
    category: spec.category,
    issuer: fields[template.issuerKey] || "",
    reference: fields[template.referenceKey] || "",
    expiryDate,
    noticeDeadline: noticeDeadline > expiryDate ? expiryDate : noticeDeadline,
    decision: spec.decision,
    owner: spec.owner,
    remindDays: spec.remindDays,
    notes: fields[template.notesKey] || "",
    actionLink: fields[template.linkKey] || "",
    fileName: "",
    folderId: "",
    templateId: template.id,
    fields,
    createdAt: new Date(now.getTime() - spec.age * 86_400_000).toISOString(),
  };
}

export function sortByUrgency(docs: DocumentRecord[], now = new Date(), timeZone?: string): DocumentRecord[] {
  return [...docs].sort(
    (a, b) => daysUntil(a.expiryDate, now, timeZone) - daysUntil(b.expiryDate, now, timeZone),
  );
}

export type SortId = "name" | "soonest" | "latest";

export function sortDocuments(
  docs: DocumentRecord[],
  sort: SortId,
  now = new Date(),
  timeZone?: string,
): DocumentRecord[] {
  const copy = [...docs];
  if (sort === "name") {
    return copy.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }));
  }
  copy.sort((a, b) => daysUntil(a.expiryDate, now, timeZone) - daysUntil(b.expiryDate, now, timeZone));
  return sort === "latest" ? copy.reverse() : copy;
}

export const FREE_FILE_BYTES = 10 * 1024 * 1024;
export const PLUS_FILE_BYTES = 50 * 1024 * 1024;

export function fileLimitBytes(plan: "free" | "plus" | "monthly" | "yearly" | "lifetime"): number {
  return plan === "free" ? FREE_FILE_BYTES : PLUS_FILE_BYTES;
}

export const TIMEZONE_OPTIONS = [
  "Europe/Sarajevo",
  "Europe/Belgrade",
  "Europe/Zagreb",
  "Europe/Vienna",
  "Europe/Berlin",
  "Europe/London",
  "Europe/Paris",
  "Europe/Istanbul",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Asia/Dubai",
  "UTC",
];

export function monthKey(expiryDate: string): string {
  return format(parseISO(expiryDate), "yyyy-MM");
}

export function monthLabel(expiryDate: string): string {
  return format(parseISO(expiryDate), "MMMM yyyy");
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
