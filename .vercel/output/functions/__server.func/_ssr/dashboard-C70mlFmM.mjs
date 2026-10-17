import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { A as Slot, N as require_jsx_runtime, a as Overlay2, c as Title2, d as DialogContent$1, f as DialogDescription$1, h as DialogTitle$1, i as Description2, l as Dialog$1, m as DialogPortal$1, n as Cancel, o as Portal2, p as DialogOverlay$1, r as Content2, s as Root2, t as Action, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as Search, c as Lock, d as Folder, f as FileUp, h as ArrowLeft, i as Settings, l as List, m as ArrowUpDown, o as RefreshCw, p as Ellipsis, r as SquareStack, s as Plus, t as X, u as LayoutTemplate } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as addDays, i as startOfDay, n as format, r as differenceInCalendarDays, t as parseISO } from "../_libs/date-fns.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as Separator2, i as Root2$1, n as Item2, o as Trigger, r as Portal2$1, t as Content2$1 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-C70mlFmM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	{
		id: "vehicle",
		label: "Vehicle"
	},
	{
		id: "lease",
		label: "Lease"
	},
	{
		id: "insurance",
		label: "Insurance"
	},
	{
		id: "license",
		label: "Licence"
	},
	{
		id: "contract",
		label: "Contract"
	},
	{
		id: "other",
		label: "Other"
	}
];
var REMIND_OPTIONS = [
	{
		days: 1,
		label: "1 day before"
	},
	{
		days: 7,
		label: "7 days before"
	},
	{
		days: 14,
		label: "14 days before"
	},
	{
		days: 30,
		label: "30 days before"
	},
	{
		days: 60,
		label: "60 days before"
	},
	{
		days: 90,
		label: "90 days before"
	}
];
var STATUS_META = {
	expired: {
		label: "Expired",
		className: "bg-danger-soft text-destructive",
		pip: "bg-destructive"
	},
	critical: {
		label: "This week",
		className: "bg-warn-soft text-warn",
		pip: "bg-warn"
	},
	soon: {
		label: "This month",
		className: "bg-warn-soft text-warn",
		pip: "bg-warn"
	},
	watch: {
		label: "Upcoming",
		className: "bg-watch-soft text-watch",
		pip: "bg-watch"
	},
	current: {
		label: "Current",
		className: "bg-ok-soft text-ok",
		pip: "bg-ok"
	}
};
function lockedDocumentIds(docs) {
	const ordered = [...docs].sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
	return new Set(ordered.slice(3).map((doc) => doc.id));
}
function categoryLabel(id) {
	return CATEGORIES.find((c) => c.id === id)?.label ?? "Other";
}
function calendarDay(date, timeZone) {
	if (timeZone) try {
		return new Intl.DateTimeFormat("en-CA", {
			timeZone,
			year: "numeric",
			month: "2-digit",
			day: "2-digit"
		}).format(date);
	} catch {}
	return format(startOfDay(date), "yyyy-MM-dd");
}
function daysUntil(expiryDate, now = /* @__PURE__ */ new Date(), timeZone) {
	return differenceInCalendarDays(startOfDay(parseISO(expiryDate)), startOfDay(parseISO(calendarDay(now, timeZone))));
}
function statusFromDays(days) {
	if (days < 0) return "expired";
	if (days <= 7) return "critical";
	if (days <= 30) return "soon";
	if (days <= 90) return "watch";
	return "current";
}
function formatExpiry(expiryDate) {
	return format(parseISO(expiryDate), "d MMM yyyy");
}
function formatDays(days) {
	if (days === 0) return "Today";
	if (days === 1) return "Tomorrow";
	if (days === -1) return "Yesterday";
	if (days < 0) return `${Math.abs(days)} days ago`;
	return `${days} days`;
}
function inReminderWindow(doc, now = /* @__PURE__ */ new Date(), timeZone) {
	const days = daysUntil(doc.expiryDate, now, timeZone);
	return days >= 0 && days <= doc.remindDays;
}
function isoFromToday(offsetDays, now = /* @__PURE__ */ new Date()) {
	return format(addDays(startOfDay(now), offsetDays), "yyyy-MM-dd");
}
function emptyDraft() {
	return {
		title: "",
		category: "vehicle",
		issuer: "",
		reference: "",
		expiryDate: isoFromToday(365),
		remindDays: 30,
		notes: "",
		actionLink: "",
		fileName: "",
		folderId: "",
		templateId: "",
		fields: {}
	};
}
var BUILTIN_TEMPLATES = [
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
		fields: [
			{
				key: "item",
				label: "Item / document name",
				kind: "text",
				placeholder: "Passport, gym membership",
				section: "grid"
			},
			{
				key: "provider",
				label: "Provider / issuer",
				kind: "text",
				placeholder: "Government, Netflix, landlord",
				section: "grid"
			},
			{
				key: "account",
				label: "Account or ID number",
				kind: "text",
				placeholder: "Optional account info",
				section: "grid"
			},
			{
				key: "expiry",
				label: "Expiration date",
				kind: "date",
				placeholder: "DD / MM / YYYY",
				section: "grid"
			},
			{
				key: "link",
				label: "Website or document link",
				kind: "text",
				placeholder: "Login page or saved file",
				section: "footer"
			},
			{
				key: "notes",
				label: "What to do / notes",
				kind: "long",
				placeholder: "Cancel before the next charge, or what to bring to renew.",
				section: "footer"
			}
		]
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
		fields: [
			{
				key: "employee",
				label: "Employee / contractor name",
				kind: "text",
				placeholder: "Full legal name",
				section: "grid"
			},
			{
				key: "employer",
				label: "Employer / company",
				kind: "text",
				placeholder: "Company name",
				section: "grid"
			},
			{
				key: "role",
				label: "Job title / role",
				kind: "text",
				placeholder: "Senior developer",
				section: "grid"
			},
			{
				key: "contractType",
				label: "Contract type",
				kind: "text",
				placeholder: "Fixed-term, freelance",
				section: "grid"
			},
			{
				key: "start",
				label: "Contract start date",
				kind: "date",
				placeholder: "DD / MM / YYYY",
				section: "grid"
			},
			{
				key: "end",
				label: "Contract end date",
				kind: "date",
				placeholder: "DD / MM / YYYY",
				section: "grid"
			},
			{
				key: "link",
				label: "Original document link",
				kind: "text",
				placeholder: "HR portal, Drive, or website",
				section: "footer"
			},
			{
				key: "notice",
				label: "Notice period and conditions",
				kind: "long",
				placeholder: "Notice period, or what happens if it is extended.",
				section: "footer"
			}
		]
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
		fields: [
			{
				key: "holder",
				label: "Policyholder name",
				kind: "text",
				placeholder: "Primary insured name",
				section: "grid"
			},
			{
				key: "provider",
				label: "Insurance provider",
				kind: "text",
				placeholder: "Allianz, Euroherc",
				section: "grid"
			},
			{
				key: "policy",
				label: "Policy number",
				kind: "text",
				placeholder: "Full policy ID",
				section: "grid",
				wide: true
			},
			{
				key: "vehicle",
				label: "Vehicle make and model",
				kind: "text",
				placeholder: "2024 Toyota RAV4",
				section: "grid"
			},
			{
				key: "plate",
				label: "Licence plate / VIN",
				kind: "text",
				placeholder: "Registration number or VIN",
				section: "grid"
			},
			{
				key: "start",
				label: "Coverage start date",
				kind: "date",
				placeholder: "DD / MM / YYYY",
				section: "grid"
			},
			{
				key: "expiry",
				label: "Policy expiry date",
				kind: "date",
				placeholder: "DD / MM / YYYY",
				section: "grid"
			},
			{
				key: "link",
				label: "Original document link",
				kind: "text",
				placeholder: "Portal, Drive, or website",
				section: "footer"
			},
			{
				key: "notes",
				label: "Additional notes",
				kind: "long",
				placeholder: "Broker, claims line, or what the cover includes.",
				section: "footer"
			}
		]
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
		fields: [
			{
				key: "title",
				label: "Document title",
				kind: "text",
				placeholder: "Commercial lease agreement",
				section: "grid"
			},
			{
				key: "reference",
				label: "Reference / ID number",
				kind: "text",
				placeholder: "LSE-2026-991",
				section: "grid"
			},
			{
				key: "primary",
				label: "Primary party",
				kind: "text",
				placeholder: "Your name or company",
				section: "grid"
			},
			{
				key: "secondary",
				label: "Secondary party",
				kind: "text",
				placeholder: "Counterparty name",
				section: "grid"
			},
			{
				key: "signed",
				label: "Date signed",
				kind: "date",
				placeholder: "DD / MM / YYYY",
				section: "grid"
			},
			{
				key: "expiry",
				label: "Expiration date",
				kind: "date",
				placeholder: "DD / MM / YYYY",
				section: "grid"
			},
			{
				key: "link",
				label: "Original document link",
				kind: "text",
				placeholder: "Drive, Dropbox, or website",
				section: "footer"
			},
			{
				key: "notes",
				label: "Key terms and notes",
				kind: "long",
				placeholder: "Obligations, cancellation, or the notice you must send.",
				section: "footer"
			}
		]
	}
];
function templateById(id) {
	return BUILTIN_TEMPLATES.find((template) => template.id === id);
}
function blankFields(template) {
	const fields = { remind: String(template.remindDays) };
	for (const field of template.fields) fields[field.key] = "";
	if (template.expiryKey) fields[template.expiryKey] = isoFromToday(365);
	return fields;
}
function draftFromTemplate(template) {
	const fields = blankFields(template);
	return applyFields({
		...emptyDraft(),
		title: "",
		category: template.category,
		remindDays: template.remindDays,
		templateId: template.id,
		fields
	}, template);
}
function applyFields(draft, template) {
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
		fields
	};
}
function fieldsFromDocument(doc) {
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
		remind: String(doc.remindDays || template.remindDays)
	};
}
function draftFromDocument(doc) {
	return {
		title: doc.title,
		category: doc.category,
		issuer: doc.issuer,
		reference: doc.reference,
		expiryDate: doc.expiryDate,
		remindDays: doc.remindDays,
		notes: doc.notes,
		actionLink: doc.actionLink ?? "",
		fileName: doc.fileName ?? "",
		folderId: doc.folderId ?? "",
		templateId: doc.templateId ?? "",
		fields: doc.fields ?? {}
	};
}
function createDemoDocuments(now = /* @__PURE__ */ new Date()) {
	return [
		{
			title: "Sprinter registration",
			category: "vehicle",
			issuer: "MUP KS",
			reference: "A12-K-448",
			offset: 6,
			remindDays: 30,
			notes: "Book the technical inspection before the plate lapses.",
			actionLink: "https://www.mup.ks.gov.ba",
			age: 6
		},
		{
			title: "Commercial liability",
			category: "insurance",
			issuer: "Sarajevo Osiguranje",
			reference: "POL-22091",
			offset: 4,
			remindDays: 30,
			notes: "Renewal quote is already in the inbox.",
			actionLink: "",
			age: 5
		},
		{
			title: "Warehouse lease",
			category: "lease",
			issuer: "Stup industrial park",
			reference: "UNIT 4",
			offset: 19,
			remindDays: 60,
			notes: "Notice period is 30 days if we do not renew.",
			actionLink: "",
			age: 4
		},
		{
			title: "Operating licence",
			category: "license",
			issuer: "Općina Novo Sarajevo",
			reference: "DL-118",
			offset: -12,
			remindDays: 30,
			notes: "Counter hours are mornings only.",
			actionLink: "",
			age: 3
		},
		{
			title: "Fleet policy",
			category: "insurance",
			issuer: "Euroherc",
			reference: "FL-90",
			offset: 48,
			remindDays: 30,
			notes: "Covers the three panel vans.",
			actionLink: "",
			age: 2
		},
		{
			title: "Service contract",
			category: "contract",
			issuer: "Atlas Field Service",
			reference: "SC-14",
			offset: 96,
			remindDays: 30,
			notes: "",
			actionLink: "",
			age: 1
		}
	].map((row, index) => {
		const templateId = [
			"auto-insurance",
			"auto-insurance",
			"agreement",
			"personal",
			"auto-insurance",
			"agreement"
		][index];
		const template = templateById(templateId) ?? BUILTIN_TEMPLATES[0];
		const expiryDate = isoFromToday(row.offset, now);
		const fields = {
			...blankFields(template),
			[template.titleKey]: row.title,
			[template.expiryKey]: expiryDate,
			[template.issuerKey]: row.issuer,
			[template.referenceKey]: row.reference,
			[template.linkKey]: row.actionLink,
			[template.notesKey]: row.notes,
			remind: String(row.remindDays)
		};
		return {
			id: `demo-${index + 1}`,
			title: row.title,
			category: row.category,
			issuer: row.issuer,
			reference: row.reference,
			expiryDate,
			remindDays: row.remindDays,
			notes: row.notes,
			actionLink: row.actionLink,
			fileName: "",
			folderId: "",
			templateId: template.id,
			fields,
			createdAt: (/* @__PURE__ */ new Date(now.getTime() - row.age * 864e5)).toISOString()
		};
	});
}
function sortDocuments(docs, sort, now = /* @__PURE__ */ new Date(), timeZone) {
	const copy = [...docs];
	if (sort === "name") return copy.sort((a, b) => a.title.localeCompare(b.title, void 0, { sensitivity: "base" }));
	copy.sort((a, b) => daysUntil(a.expiryDate, now, timeZone) - daysUntil(b.expiryDate, now, timeZone));
	return sort === "latest" ? copy.reverse() : copy;
}
var FREE_FILE_BYTES = 10485760;
var PLUS_FILE_BYTES = 52428800;
function fileLimitBytes(plan) {
	return plan === "plus" ? PLUS_FILE_BYTES : FREE_FILE_BYTES;
}
var TIMEZONE_OPTIONS = [
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
	"UTC"
];
function downloadJson(filename, data) {
	const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function detectedZone() {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
	} catch {
		return "UTC";
	}
}
function newId() {
	if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
	return `doc-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
var useDocket = create()(persist((set, get) => ({
	documents: createDemoDocuments(),
	customTemplates: [],
	folders: [],
	hasSeeded: true,
	theme: "light",
	timezone: detectedZone(),
	plan: "free",
	addDocument: (draft) => {
		set({ documents: [{
			...draft,
			title: draft.title.trim(),
			issuer: draft.issuer.trim(),
			reference: draft.reference.trim(),
			notes: draft.notes.trim(),
			actionLink: (draft.actionLink ?? "").trim(),
			fileName: (draft.fileName ?? "").trim(),
			folderId: draft.folderId ?? "",
			templateId: draft.templateId ?? "",
			fields: draft.fields ?? {},
			id: newId(),
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}, ...get().documents] });
	},
	updateDocument: (id, draft) => {
		set({ documents: get().documents.map((doc) => doc.id === id ? {
			...doc,
			...draft,
			title: draft.title.trim(),
			issuer: draft.issuer.trim(),
			reference: draft.reference.trim(),
			notes: draft.notes.trim(),
			actionLink: draft.actionLink.trim(),
			fileName: (draft.fileName ?? "").trim(),
			folderId: draft.folderId ?? "",
			templateId: draft.templateId ?? "",
			fields: draft.fields ?? {}
		} : doc) });
	},
	renewDocument: (id, expiryDate) => {
		set({ documents: get().documents.map((doc) => doc.id === id ? {
			...doc,
			expiryDate
		} : doc) });
	},
	removeDocument: (id) => {
		set({ documents: get().documents.filter((doc) => doc.id !== id) });
	},
	moveDocument: (id, folderId) => {
		set({ documents: get().documents.map((doc) => doc.id === id ? {
			...doc,
			folderId
		} : doc) });
	},
	importDocuments: (docs) => {
		const existing = new Set(get().documents.map((d) => d.id));
		set({
			documents: [...docs.filter((d) => d.id && d.title && d.expiryDate).filter((d) => !existing.has(d.id)), ...get().documents],
			hasSeeded: true
		});
	},
	importFolders: (folders) => {
		const existing = new Set(get().folders.map((folder) => folder.id));
		const incoming = folders.filter((folder) => folder.id && folder.name && !existing.has(folder.id));
		if (incoming.length) set({ folders: [...incoming, ...get().folders] });
	},
	loadSamples: () => {
		set({
			documents: createDemoDocuments(),
			hasSeeded: true
		});
	},
	addTemplate: (template) => {
		set({ customTemplates: [{
			...template,
			name: template.name.trim(),
			notes: template.notes.trim(),
			summary: template.summary?.trim() || "Your own record.",
			fields: template.fields?.length ? template.fields : BUILTIN_TEMPLATES[0].fields,
			titleKey: template.titleKey || "item",
			expiryKey: template.expiryKey || "expiry",
			issuerKey: template.issuerKey || "provider",
			referenceKey: template.referenceKey || "account",
			linkKey: template.linkKey || "link",
			notesKey: template.notesKey || "notes",
			id: newId()
		}, ...get().customTemplates] });
	},
	removeTemplate: (id) => {
		set({ customTemplates: get().customTemplates.filter((item) => item.id !== id) });
	},
	addFolder: (name) => {
		const folder = {
			id: newId(),
			name: name.trim()
		};
		set({ folders: [folder, ...get().folders] });
		return folder.id;
	},
	renameFolder: (id, name) => {
		const next = name.trim();
		if (!next) return;
		set({ folders: get().folders.map((folder) => folder.id === id ? {
			...folder,
			name: next
		} : folder) });
	},
	removeFolder: (id) => {
		set({
			folders: get().folders.filter((folder) => folder.id !== id),
			documents: get().documents.map((doc) => doc.folderId === id ? {
				...doc,
				folderId: ""
			} : doc)
		});
	},
	setTheme: (theme) => set({ theme }),
	setTimezone: (timezone) => set({ timezone }),
	setPlan: (plan) => set({ plan })
}), {
	name: "digitalni-sef-board-v1",
	version: 4,
	skipHydration: true,
	migrate: (persisted) => {
		const state = persisted;
		return {
			...state,
			folders: state.folders ?? [],
			customTemplates: state.customTemplates ?? [],
			theme: state.theme === "dark" ? "dark" : "light",
			timezone: state.timezone || detectedZone(),
			plan: state.plan === "plus" ? "plus" : "free",
			documents: (state.documents ?? []).map((doc) => ({
				...doc,
				folderId: doc.folderId ?? "",
				fileName: doc.fileName ?? "",
				templateId: doc.templateId ?? "",
				fields: doc.fields ?? {}
			}))
		};
	}
}));
function useDocketHydrated() {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		Promise.resolve(useDocket.persist.rehydrate()).finally(() => {
			if (!cancelled) setReady(true);
		});
		setReady(true);
		return () => {
			cancelled = true;
		};
	}, []);
	return ready;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium outline-none transition-[opacity,transform,background-color,color,box-shadow] duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:ring-2 focus-visible:ring-ring/30 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:opacity-90",
			secondary: "bg-muted text-foreground hover:bg-border",
			outline: "border border-border bg-card text-foreground hover:bg-muted",
			ghost: "text-foreground hover:bg-muted",
			destructive: "bg-destructive text-destructive-foreground hover:opacity-90"
		},
		size: {
			default: "h-11 rounded-full px-5",
			sm: "h-9 rounded-full px-3",
			lg: "h-12 rounded-full px-6",
			icon: "size-11 rounded-full"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-md border border-border bg-card px-3 text-base text-foreground shadow-none outline-none transition-[box-shadow,border-color] duration-150 ease-out placeholder:text-subtle focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-sm font-medium text-foreground", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-24 w-full rounded-md border border-border bg-card px-3 py-2 text-base text-foreground outline-none transition-[box-shadow,border-color] duration-150 ease-out placeholder:text-subtle focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		...props
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		className: cn("fixed inset-0 z-50 bg-foreground/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props
	});
}
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 grid w-[min(100%-1.5rem,32rem)] max-h-[min(90vh,44rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-card p-5 text-foreground shadow-[var(--shadow-card)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 inline-flex size-11 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mb-4 space-y-1 pr-10", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-xl font-medium text-foreground", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
var AlertDialog = Root2;
var AlertDialogPortal = Portal2;
function AlertDialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
		className: cn("fixed inset-0 z-50 bg-foreground/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props
	});
}
function AlertDialogContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[min(100%-1.5rem,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-card p-5 text-foreground shadow-[var(--shadow-card)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
		...props
	})] });
}
function AlertDialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("space-y-2", className),
		...props
	});
}
function AlertDialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
		...props
	});
}
function AlertDialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
		className: cn("font-display text-xl font-medium", className),
		...props
	});
}
function AlertDialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
function AlertDialogAction({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
		className: cn(buttonVariants({ variant: "destructive" }), className),
		...props
	});
}
function AlertDialogCancel({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
		className: cn(buttonVariants({ variant: "outline" }), className),
		...props
	});
}
var DropdownMenu = Root2$1;
var DropdownMenuTrigger = Trigger;
var DropdownMenuPortal = Portal2$1;
function DropdownMenuContent({ className, sideOffset = 6, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$1, {
		sideOffset,
		className: cn("z-50 min-w-44 overflow-hidden rounded-lg bg-card p-1 text-foreground shadow-[var(--shadow-card)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
		...props
	}) });
}
function DropdownMenuItem({ className, inset, variant = "default", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
		className: cn("relative flex min-h-11 cursor-pointer items-center gap-2 rounded-md px-3 text-sm outline-none select-none focus:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50", variant === "destructive" && "text-destructive focus:bg-danger-soft", inset && "pl-8", className),
		...props
	});
}
function DropdownMenuSeparator({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
		className: cn("my-1 h-px bg-border", className),
		...props
	});
}
function Badge({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium tracking-wide", className),
		...props
	});
}
function DocumentCard({ document, now, timeZone, onEdit, onOpen, onRenew, onRemove, onMove, locked = false, onUpgrade }) {
	const days = daysUntil(document.expiryDate, now, timeZone);
	const status = statusFromDays(days);
	const meta = STATUS_META[status];
	const reminding = inReminderWindow(document, now, timeZone);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("stagger-in cursor-pointer rounded-lg bg-card p-4 shadow-[var(--shadow-card)] transition-[box-shadow] duration-150 ease-out hover:shadow-[var(--shadow-card-hover)]"),
		onClick: () => onOpen?.(document),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2 shrink-0 rounded-full", meta.pip) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
									children: categoryLabel(document.category)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: meta.className,
									children: meta.label
								}),
								reminding && !locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-muted text-muted-foreground",
									children: "Reminder due"
								}) : null,
								locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-foreground text-background",
									children: "Reminders paused"
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-2 font-sans text-lg font-medium tracking-tight text-foreground",
							children: document.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 truncate text-sm text-muted-foreground",
							children: [document.issuer, document.reference].filter(Boolean).join(" · ") || "No issuer listed"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						"aria-label": `Actions for ${document.title}`,
						onClick: (event) => event.stopPropagation(),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, {})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
					align: "end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onSelect: () => onEdit(document),
							children: "Edit"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onSelect: () => onRenew(document),
							children: "Mark renewed"
						}),
						onMove ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onSelect: () => onMove(document),
							children: "Move to folder"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							variant: "destructive",
							onSelect: () => onRemove(document),
							children: "Remove"
						})
					]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("font-sans text-2xl leading-none font-medium tabular-nums tracking-tight", status === "expired" && "text-destructive", status === "critical" && "text-warn"),
					children: formatDays(days)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [
						status === "expired" ? "Expired" : "Expires",
						" ",
						formatExpiry(document.expiryDate)
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: (event) => {
						event.stopPropagation();
						onRenew(document);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {}), "Renew"]
				})]
			}),
			locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: (event) => {
					event.stopPropagation();
					onUpgrade?.();
				},
				className: "mt-4 flex w-full items-center gap-2 rounded-md bg-muted px-3 py-3 text-left text-sm text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4 shrink-0" }), "Upgrade to activate reminders on this document."]
			}) : null,
			document.fileName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: ["PDF · ", document.fileName]
			}) : null,
			document.actionLink ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 truncate text-sm text-muted-foreground",
				children: "Renewal link ready"
			}) : null,
			document.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 border-t border-border pt-3 text-sm text-muted-foreground",
				children: document.notes
			}) : null
		]
	});
}
var fieldClass$1 = "flex h-11 w-full rounded-md border border-border bg-background px-3 text-base text-foreground outline-none focus-visible:border-foreground md:text-sm";
function DocumentRecordView({ initial, templates, folders, editing: startEditing, onBack, onSave }) {
	const template = templates.find((item) => item.id === initial.templateId) ?? BUILTIN_TEMPLATES[0];
	const [draft, setDraft] = (0, import_react.useState)(initial);
	const [editing, setEditing] = (0, import_react.useState)(startEditing);
	const [error, setError] = (0, import_react.useState)(null);
	const fields = draft.fields ?? {};
	function setField(key, value) {
		setDraft((prev) => ({
			...prev,
			fields: {
				...prev.fields,
				[key]: value
			}
		}));
	}
	function save() {
		const next = applyFields(draft, template);
		if (!next.title) {
			setError("Fill in the name.");
			return;
		}
		if (!next.expiryDate) {
			setError("Set the date it ends.");
			return;
		}
		setError(null);
		onSave(next);
	}
	const grid = template.fields.filter((field) => field.section === "grid");
	const footer = template.fields.filter((field) => field.section === "footer");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-3xl px-4 py-5 pb-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onBack,
				className: "mb-4 flex items-center gap-2 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Back to the board"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "rounded-lg bg-foreground px-5 py-4 text-background",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-lg font-medium tracking-tight",
					children: template.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-background/70",
					children: template.summary
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-3 rounded-lg bg-card p-4 shadow-[var(--shadow-card)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: grid.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						field,
						value: fields[field.key] ?? "",
						editing,
						onChange: setField
					}, field.key))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-3 rounded-lg border-l-4 border-foreground bg-muted px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium tracking-wide text-muted-foreground uppercase",
					children: "Reminder"
				}), editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: cn(fieldClass$1, "mt-2"),
					value: fields.remind ?? String(draft.remindDays),
					onChange: (event) => setField("remind", event.target.value),
					"aria-label": "Reminder",
					children: REMIND_OPTIONS.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: option.days,
						children: ["Notify ", option.label]
					}, option.days))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm",
					children: ["Notify ", remindText(fields.remind ?? String(draft.remindDays))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-3 rounded-lg bg-card p-4 shadow-[var(--shadow-card)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4",
					children: footer.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						field,
						value: fields[field.key] ?? "",
						editing,
						onChange: setField
					}, field.key))
				})
			}),
			editing && folders.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-3 rounded-lg bg-card p-4 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium tracking-wide text-muted-foreground uppercase",
					children: "Folder"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: cn(fieldClass$1, "mt-2"),
					value: draft.folderId,
					onChange: (event) => setDraft((prev) => ({
						...prev,
						folderId: event.target.value
					})),
					"aria-label": "Folder",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "No folder"
					}), folders.map((folder) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: folder.id,
						children: folder.name
					}, folder.id))]
				})]
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-destructive",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex justify-end gap-2",
				children: editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: onBack,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: save,
					children: "Save record"
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setEditing(true),
					children: "Edit"
				})
			})
		]
	});
}
function Field({ field, value, editing, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: cn("grid gap-1.5", field.wide && "sm:col-span-2"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[11px] font-medium tracking-wide text-muted-foreground uppercase",
			children: field.label
		}), editing ? field.kind === "long" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			value,
			onChange: (event) => onChange(field.key, event.target.value),
			placeholder: field.placeholder,
			rows: 4,
			className: "min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground outline-none focus-visible:border-foreground md:text-sm"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type: field.kind === "date" ? "date" : "text",
			value,
			placeholder: field.placeholder,
			onChange: (event) => onChange(field.key, event.target.value)
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "min-h-11 rounded-md border border-border bg-background px-3 py-2.5 text-sm",
			children: displayValue(field, value)
		})]
	});
}
function displayValue(field, value) {
	if (!value) return "—";
	if (field.kind === "date") {
		const [year, month, day] = value.split("-");
		if (year && month && day) return `${day} / ${month} / ${year}`;
	}
	return value;
}
function remindText(value) {
	const match = REMIND_OPTIONS.find((option) => String(option.days) === value);
	return match ? match.label : `${value} days before`;
}
var fieldClass = "flex h-11 w-full rounded-md border border-border bg-card px-3 text-base text-foreground outline-none focus-visible:border-foreground md:text-sm";
function Dashboard() {
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
	const [now] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	const [panel, setPanel] = (0, import_react.useState)("board");
	const [view, setView] = (0, import_react.useState)("cards");
	const [openFolderId, setOpenFolderId] = (0, import_react.useState)(null);
	const [query, setQuery] = (0, import_react.useState)("");
	const [addOpen, setAddOpen] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [renewing, setRenewing] = (0, import_react.useState)(null);
	const [renewDate, setRenewDate] = (0, import_react.useState)("");
	const [removing, setRemoving] = (0, import_react.useState)(null);
	const [moving, setMoving] = (0, import_react.useState)(null);
	const [removingFolder, setRemovingFolder] = (0, import_react.useState)(null);
	const [upgradeOpen, setUpgradeOpen] = (0, import_react.useState)(false);
	const [makingTemplate, setMakingTemplate] = (0, import_react.useState)(false);
	const [record, setRecord] = (0, import_react.useState)(null);
	const [sort, setSort] = (0, import_react.useState)("soonest");
	const [subscribeOpen, setSubscribeOpen] = (0, import_react.useState)(false);
	const pdfRef = (0, import_react.useRef)(null);
	const importRef = (0, import_react.useRef)(null);
	const templates = (0, import_react.useMemo)(() => [...BUILTIN_TEMPLATES, ...customTemplates ?? []], [customTemplates]);
	const locked = (0, import_react.useMemo)(() => plan === "plus" ? /* @__PURE__ */ new Set() : lockedDocumentIds(documents), [documents, plan]);
	const folderList = folders ?? [];
	const openFolder = folderList.find((folder) => folder.id === openFolderId) ?? null;
	const visible = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return sortDocuments(documents.filter((doc) => {
			if (openFolderId && (doc.folderId ?? "") !== openFolderId) return false;
			if (!q) return true;
			return `${doc.title} ${doc.issuer} ${doc.reference} ${doc.notes} ${doc.fileName}`.toLowerCase().includes(q);
		}), sort, now, timezone);
	}, [
		documents,
		query,
		now,
		openFolderId,
		sort,
		timezone
	]);
	(0, import_react.useEffect)(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
	}, [theme]);
	function withFolder(next) {
		return {
			...next,
			folderId: next.folderId || openFolderId || ""
		};
	}
	function openRecord(draft, id, editing) {
		const next = {
			...draft,
			fields: { ...draft.fields }
		};
		if (!next.templateId) next.templateId = "personal";
		if (!Object.keys(next.fields).length) next.fields = fieldsFromDocument({
			...next,
			id: id ?? "draft",
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		setAddOpen(false);
		setDraft(null);
		setEditing(null);
		setRecord({
			draft: next,
			id,
			editing
		});
		setPanel("board");
	}
	function startFromTemplate(template) {
		openRecord(withFolder(draftFromTemplate(template)), null, true);
	}
	function onPdf(file) {
		if (!(file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"))) {
			toast.error("Choose a PDF");
			return;
		}
		const limit = fileLimitBytes(plan);
		if (file.size > limit) {
			const mb = Math.round(limit / 1048576);
			toast.error(plan === "plus" ? `That file is over ${mb} MB.` : `Free keeps files at ${mb} MB. Plus allows 50 MB.`);
			return;
		}
		const next = draftFromTemplate(templates.find((item) => item.id === "personal") ?? templates[0]);
		next.fileName = file.name;
		next.fields = {
			...next.fields,
			item: file.name.replace(/\.pdf$/i, ""),
			notes: "Added from a PDF."
		};
		next.folderId = openFolderId ?? "";
		openRecord(next, null, true);
	}
	function openEditor(item) {
		openRecord(withFolder(draftFromDocument(item)), item.id, true);
	}
	function openFile(item) {
		openRecord(draftFromDocument(item), item.id, false);
	}
	function openRenew(item) {
		setRenewing(item);
		setRenewDate(isoFromToday(365, now));
	}
	function onImport(file) {
		const reader = new FileReader();
		reader.onload = () => {
			try {
				const parsed = JSON.parse(String(reader.result));
				const docs = Array.isArray(parsed) ? parsed : parsed.documents;
				if (!Array.isArray(docs) || !docs.length) throw new Error("empty");
				importDocuments(docs);
				if (!Array.isArray(parsed) && Array.isArray(parsed.folders)) importFolders(parsed.folders);
				toast.success(`Imported ${docs.length}`);
			} catch {
				toast.error("Could not read that file");
			}
		};
		reader.readAsText(file);
	}
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-screen bg-background" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "sticky top-0 flex h-screen w-[72px] shrink-0 flex-col items-center gap-1 border-r border-border bg-card py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-2 flex size-9 items-center justify-center rounded-full bg-foreground text-background",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 24 24",
							className: "size-4",
							fill: "none",
							"aria-hidden": "true",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: "5",
								y: "10",
								width: "14",
								height: "10",
								rx: "1.5",
								stroke: "currentColor",
								strokeWidth: "1.8"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M8 10V8a4 4 0 0 1 8 0v2",
								stroke: "currentColor",
								strokeWidth: "1.8"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RailButton, {
						active: panel === "board",
						label: "Board",
						onClick: () => {
							setOpenFolderId(null);
							setPanel("board");
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareStack, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RailButton, {
						active: panel === "folders",
						label: "Folders",
						onClick: () => setPanel("folders"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RailButton, {
						active: panel === "templates",
						label: "Templates",
						onClick: () => setPanel("templates"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutTemplate, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RailButton, {
						active: panel === "settings",
						label: "Settings",
						onClick: () => setPanel("settings"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-10 flex h-14 items-center border-b border-border bg-background/90 px-4 backdrop-blur-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "min-w-0 flex-1 truncate text-base font-medium",
							children: panel === "board" ? openFolder?.name ?? "Documents" : panel === "folders" ? "Folders" : panel === "templates" ? "Templates" : "Settings"
						}), panel === "board" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex w-40 items-center gap-2 sm:w-56",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: query,
								onChange: (e) => setQuery(e.target.value),
								placeholder: "Search",
								"aria-label": "Search documents",
								className: "h-9 border-transparent bg-transparent px-0 shadow-none focus-visible:ring-0"
							})]
						}) : null]
					}),
					panel === "board" && record ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentRecordView, {
						initial: record.draft,
						templates,
						folders: folderList,
						editing: record.editing,
						onBack: () => setRecord(null),
						onSave: (next) => {
							if (record.id) {
								updateDocument(record.id, next);
								toast.success("Record saved");
								setRecord({
									draft: next,
									id: record.id,
									editing: false
								});
							} else {
								addDocument(next);
								toast.success("Record added");
								setRecord(null);
							}
						}
					}, `${record.id ?? "new"}-${record.editing}`) : null,
					panel === "board" && !record ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
						className: "px-4 py-5 pb-16",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4 flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewButton, {
										active: view === "cards",
										label: "Cards",
										onClick: () => setView("cards"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareStack, {})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewButton, {
										active: view === "list",
										label: "List",
										onClick: () => setView("list"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "flex h-9 items-center gap-1.5 rounded-full bg-card px-3 text-sm text-foreground shadow-[var(--shadow-card)]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "size-4" }), sort === "name" ? "Name" : sort === "latest" ? "Latest" : "Soonest"]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
										align: "start",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
												onSelect: () => setSort("name"),
												children: "Name"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
												onSelect: () => setSort("soonest"),
												children: "Soonest expiry"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
												onSelect: () => setSort("latest"),
												children: "Latest expiry"
											})
										]
									})] }),
									openFolder ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setOpenFolderId(null),
										className: "ml-auto text-sm text-muted-foreground",
										children: "All documents"
									}) : null
								]
							}),
							view === "cards" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setAddOpen(true),
									className: "flex min-h-52 flex-col items-start rounded-lg border border-dashed border-foreground/20 bg-card p-4 text-left shadow-[var(--shadow-card)]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex size-9 items-center justify-center rounded-full bg-muted",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-4 font-medium",
											children: "Add a document"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-1 text-sm text-muted-foreground",
											children: "Start from a template, or attach a PDF."
										})
									]
								}), visible.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentCard, {
									document: doc,
									now,
									timeZone: timezone,
									locked: locked.has(doc.id),
									onUpgrade: () => setUpgradeOpen(true),
									onOpen: openFile,
									onEdit: openEditor,
									onRenew: openRenew,
									onRemove: setRemoving,
									onMove: setMoving
								}, doc.id))]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "overflow-hidden rounded-lg bg-card shadow-[var(--shadow-card)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setAddOpen(true),
										className: "flex w-full items-center gap-3 border-b border-border px-3 py-3 text-left text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add a document"]
									}),
									visible.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentRow, {
										document: doc,
										now,
										timeZone: timezone,
										locked: locked.has(doc.id),
										onOpen: openFile,
										onEdit: openEditor,
										onRenew: openRenew,
										onRemove: setRemoving,
										onMove: setMoving
									}, doc.id)),
									visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "px-3 py-6 text-sm text-muted-foreground",
										children: "No documents here."
									}) : null
								]
							}),
							query && visible.length === 0 && view === "cards" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 text-sm text-muted-foreground",
								children: "Nothing matches that search."
							}) : null
						]
					}) : null,
					panel === "folders" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoldersPanel, {
						folders: folderList,
						documents,
						onOpen: (id) => {
							setOpenFolderId(id);
							setPanel("board");
						},
						onCreate: (name) => {
							addFolder(name);
							toast.success("Folder created");
						},
						onRename: renameFolder,
						onRemove: setRemovingFolder
					}) : null,
					panel === "templates" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TemplatesPanel, {
						customTemplates: customTemplates ?? [],
						making: makingTemplate,
						onMake: () => setMakingTemplate(true),
						onCancelMake: () => setMakingTemplate(false),
						onCreate: (template) => {
							addTemplate(template);
							setMakingTemplate(false);
							toast.success("Template saved");
						},
						onUse: startFromTemplate,
						onRemove: removeTemplate
					}) : null,
					panel === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPanel, {
						timezone,
						zones: zoneChoices(timezone),
						theme,
						plan,
						onTheme: setTheme,
						onTimezone: setTimezone,
						onSubscribe: () => setSubscribeOpen(true),
						onFree: () => {
							setPlan("free");
							toast.success("Back on the free plan");
						},
						onExport: () => downloadJson("digitalni-sef.json", {
							documents,
							folders: folderList
						}),
						onImport: () => importRef.current?.click(),
						onSamples: () => {
							loadSamples();
							toast.success("Sample documents restored");
						}
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: pdfRef,
				type: "file",
				accept: "application/pdf,.pdf",
				className: "hidden",
				onChange: (e) => {
					const file = e.target.files?.[0];
					if (file) onPdf(file);
					e.target.value = "";
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: importRef,
				type: "file",
				accept: "application/json",
				className: "hidden",
				onChange: (e) => {
					const file = e.target.files?.[0];
					if (file) onImport(file);
					e.target.value = "";
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: addOpen,
				onOpenChange: setAddOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add a document" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Use a template, or start from a PDF." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 grid gap-2",
					children: [templates.map((template) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => startFromTemplate(template),
						className: "flex h-11 items-center justify-between rounded-md bg-muted px-3 text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: template.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Template"
						})]
					}, template.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => {
							setAddOpen(false);
							pdfRef.current?.click();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, {}), "Upload a PDF"]
					})]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: renewing !== null,
				onOpenChange: (open) => !open && setRenewing(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Renew ", renewing?.title] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Set the next expiry date." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "grid gap-4",
					onSubmit: (event) => {
						event.preventDefault();
						if (!renewing || !renewDate) return;
						const was = daysUntil(renewing.expiryDate, now);
						renewDocument(renewing.id, renewDate);
						toast.success(was < 0 ? "Marked renewed" : `Renewed — was ${was} days out`);
						setRenewing(null);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: renewDate,
						onChange: (e) => setRenewDate(e.target.value)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setRenewing(null),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Save date"
						})]
					})]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: upgradeOpen,
				onOpenChange: setUpgradeOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Reminders pause after three" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "The first three documents keep their reminders. Subscribe in Settings for reminders on every document, and for files up to 50 MB." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setUpgradeOpen(false),
						children: "Keep tracking"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							setUpgradeOpen(false);
							setPanel("settings");
							setSubscribeOpen(true);
						},
						children: "See Plus"
					})]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: subscribeOpen,
				onOpenChange: setSubscribeOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Plus" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Reminders on every document, and files up to 50 MB. Free stays at three reminders and 10 MB. This preview does not charge a card. Plus only applies in this browser." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setSubscribeOpen(false),
						children: "Not now"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							setPlan("plus");
							setSubscribeOpen(false);
							toast.success("Plus is on for this browser");
						},
						children: "Use Plus here"
					})]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: moving !== null,
				onOpenChange: (open) => !open && setMoving(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Move ", moving?.title] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Choose a folder, or leave it unfiled." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "flex h-11 items-center rounded-md bg-muted px-3 text-left text-sm",
							onClick: () => {
								if (!moving) return;
								moveDocument(moving.id, "");
								setMoving(null);
								toast.success("Moved out of folders");
							},
							children: "No folder"
						}),
						folderList.map((folder) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "flex h-11 items-center rounded-md bg-muted px-3 text-left text-sm",
							onClick: () => {
								if (!moving) return;
								moveDocument(moving.id, folder.id);
								setMoving(null);
								toast.success(`Moved to ${folder.name}`);
							},
							children: folder.name
						}, folder.id)),
						folderList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Create a folder from the Folders button first."
						}) : null
					]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: removingFolder !== null,
				onOpenChange: (open) => !open && setRemovingFolder(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, { children: [
					"Delete ",
					removingFolder?.name,
					"?"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Documents in it stay on the board. They just leave the folder." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: () => {
						if (!removingFolder) return;
						removeFolder(removingFolder.id);
						if (openFolderId === removingFolder.id) setOpenFolderId(null);
						setRemovingFolder(null);
						toast.success("Folder deleted");
					},
					children: "Delete folder"
				})] })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: removing !== null,
				onOpenChange: (open) => !open && setRemoving(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, { children: [
					"Remove ",
					removing?.title,
					"?"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "This takes it off the board on this device." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: () => {
						if (!removing) return;
						removeDocument(removing.id);
						setRemoving(null);
						toast.success("Removed");
					},
					children: "Remove"
				})] })] })
			})
		]
	});
}
function ViewButton({ active, label, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("flex h-9 items-center gap-1.5 rounded-full px-3 text-sm", active ? "bg-foreground text-background" : "bg-card text-foreground shadow-[var(--shadow-card)]"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "[&_svg]:size-4",
			children
		}), label]
	});
}
function DocumentRow({ document, now, timeZone, locked, onOpen, onEdit, onRenew, onRemove, onMove }) {
	const days = daysUntil(document.expiryDate, now, timeZone);
	const meta = STATUS_META[statusFromDays(days)];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 border-b border-border px-3 py-3 last:border-b-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2 shrink-0 rounded-full", meta.pip) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onOpen(document),
				className: "min-w-0 flex-1 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm font-medium",
					children: document.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "truncate text-xs text-muted-foreground",
					children: [
						categoryLabel(document.category),
						" · ",
						formatExpiry(document.expiryDate),
						" · ",
						formatDays(days),
						locked ? " · paused" : ""
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onMove(document),
				className: "text-xs text-muted-foreground",
				children: "Move"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onRenew(document),
				className: "text-xs text-muted-foreground",
				children: "Renew"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onRemove(document),
				className: "text-xs text-destructive",
				children: "Remove"
			})
		]
	});
}
function FoldersPanel({ folders, documents, onOpen, onCreate, onRename, onRemove }) {
	const [name, setName] = (0, import_react.useState)("");
	const [renaming, setRenaming] = (0, import_react.useState)(null);
	const [rename, setRename] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 py-5 pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mb-4 flex gap-2",
			onSubmit: (event) => {
				event.preventDefault();
				if (!name.trim()) return;
				onCreate(name.trim());
				setName("");
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: name,
				onChange: (e) => setName(e.target.value),
				placeholder: "New folder",
				"aria-label": "New folder name"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Create"]
			})]
		}), folders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "No folders yet. Create one, then move documents into it."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3",
			children: folders.map((folder) => {
				const count = documents.filter((doc) => doc.folderId === folder.id).length;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-lg bg-card p-4 shadow-[var(--shadow-card)]",
					children: [renaming === folder.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex gap-2",
						onSubmit: (event) => {
							event.preventDefault();
							onRename(folder.id, rename);
							setRenaming(null);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: rename,
							onChange: (e) => setRename(e.target.value),
							"aria-label": "Folder name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "sm",
							children: "Save"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onOpen(folder.id),
						className: "text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: folder.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: [
								count,
								" ",
								count === 1 ? "document" : "documents"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => onOpen(folder.id),
								children: "Open"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => {
									setRenaming(folder.id);
									setRename(folder.name);
								},
								children: "Rename"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => onRemove(folder),
								children: "Delete"
							})
						]
					})]
				}, folder.id);
			})
		})]
	});
}
function RailButton({ active, label, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		"aria-current": active ? "page" : void 0,
		className: cn("flex w-16 flex-col items-center gap-1 rounded-md px-1 py-2 text-[10px] leading-tight", active ? "bg-muted text-foreground" : "text-muted-foreground"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "[&_svg]:size-5",
			children
		}), label]
	});
}
function TemplatesPanel({ customTemplates, making, onMake, onCancelMake, onCreate, onUse, onRemove }) {
	const [name, setName] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("other");
	const [remindDays, setRemindDays] = (0, import_react.useState)(30);
	const [notes, setNotes] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 py-5 pb-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Tap one to start a document."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: onMake,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Make your own"]
				})]
			}),
			making ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mb-4 grid max-w-lg gap-3 rounded-lg bg-card p-4 shadow-[var(--shadow-card)]",
				onSubmit: (event) => {
					event.preventDefault();
					if (!name.trim()) return;
					onCreate({
						name,
						category,
						remindDays,
						notes
					});
					setName("");
					setNotes("");
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "tpl-name",
							children: "Template name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "tpl-name",
							value: name,
							onChange: (e) => setName(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "tpl-cat",
								children: "Category"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								id: "tpl-cat",
								className: fieldClass,
								value: category,
								onChange: (e) => setCategory(e.target.value),
								children: CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: cat.id,
									children: cat.label
								}, cat.id))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "tpl-remind",
								children: "Remind"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								id: "tpl-remind",
								className: fieldClass,
								value: remindDays,
								onChange: (e) => setRemindDays(Number(e.target.value)),
								children: REMIND_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: opt.days,
									children: opt.label
								}, opt.days))
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "tpl-notes",
							children: "Default note"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "tpl-notes",
							value: notes,
							onChange: (e) => setNotes(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: onCancelMake,
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Save template"
						})]
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3",
				children: [BUILTIN_TEMPLATES.map((template) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TemplateCard, {
					template,
					onUse
				}, template.id)), customTemplates.map((template) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TemplateCard, {
					template,
					onUse,
					onRemove
				}, template.id))]
			})
		]
	});
}
function TemplateCard({ template, onUse, onRemove }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "flex min-h-40 flex-col rounded-lg bg-card p-4 shadow-[var(--shadow-card)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-widest text-muted-foreground uppercase",
				children: onRemove ? "Yours" : "Basic"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 font-medium",
				children: template.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 flex-1 text-sm text-muted-foreground",
				children: template.summary || template.notes
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: () => onUse(template),
					children: "Use"
				}), onRemove ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => onRemove(template.id),
					children: "Delete"
				}) : null]
			})
		]
	});
}
function zoneChoices(current) {
	return current && !TIMEZONE_OPTIONS.includes(current) ? [current, ...TIMEZONE_OPTIONS] : TIMEZONE_OPTIONS;
}
function SettingsPanel({ timezone, zones, theme, plan, onTheme, onTimezone, onSubscribe, onFree, onExport, onImport, onSamples }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "grid max-w-lg gap-4 px-4 py-5 pb-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg bg-card p-4 shadow-[var(--shadow-card)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-medium",
						children: "Appearance"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: theme === "dark" ? "Dark board." : "Light board."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						variant: "outline",
						size: "sm",
						onClick: () => onTheme(theme === "dark" ? "light" : "dark"),
						children: theme === "dark" ? "Use light mode" : "Use dark mode"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg bg-card p-4 shadow-[var(--shadow-card)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-medium",
						children: "Plan"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: plan === "plus" ? "Plus on this browser: reminders on every document, files up to 50 MB." : "Free: reminders on the first three documents, files up to 10 MB."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: plan === "plus" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: onFree,
							children: "Back to Free"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: onSubscribe,
							children: "Subscribe"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg bg-card p-4 shadow-[var(--shadow-card)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-medium",
						children: "Timezone"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Reminders are meant for 8:00 AM in this zone. Expiry dates use this calendar day."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: cn(fieldClass, "mt-3"),
						value: timezone,
						onChange: (event) => onTimezone(event.target.value),
						"aria-label": "Timezone",
						children: zones.map((zone) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: zone,
							children: zone
						}, zone))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg bg-card p-4 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-medium",
					children: "Library"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: onExport,
							children: "Export"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: onImport,
							children: "Import"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: onSamples,
							children: "Restore samples"
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { Dashboard as t };
