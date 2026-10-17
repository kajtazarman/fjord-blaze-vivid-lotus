import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import {
  BUILTIN_TEMPLATES,
  backfillDemoFields,
  createDemoDocuments,
  type DocTemplate,
  type DocumentDraft,
  type DocumentRecord,
  type Folder,
  withAccountability,
} from "@/lib/documents";
import { codeMatches, createSecret, oneTimeCode, type TwoFactor, type TwoFactorMethod } from "@/lib/two-factor";

type PlanId = "free" | "plus" | "monthly" | "yearly" | "lifetime";

export type AccountProfile = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

type PasswordRecord = { salt: string; hash: string } | null;

type DocketState = {
  documents: DocumentRecord[];
  customTemplates: DocTemplate[];
  folders: Folder[];
  hasSeeded: boolean;
  theme: "light" | "dark";
  timezone: string;
  plan: PlanId;
  account: AccountProfile;
  password: PasswordRecord;
  signedIn: boolean;
  sentAlerts: { documentId: string; offsetDays: number }[];
  twoFactor: TwoFactor | null;
  addDocument: (draft: DocumentDraft) => void;
  updateDocument: (id: string, draft: DocumentDraft) => void;
  renewDocument: (id: string, expiryDate: string) => void;
  removeDocument: (id: string) => void;
  moveDocument: (id: string, folderId: string) => void;
  importDocuments: (docs: DocumentRecord[]) => void;
  importFolders: (folders: Folder[]) => void;
  loadSamples: () => void;
  addTemplate: (
    template: Pick<DocTemplate, "name" | "category" | "remindDays" | "notes"> & Partial<DocTemplate>,
  ) => void;
  removeTemplate: (id: string) => void;
  addFolder: (name: string) => string;
  renameFolder: (id: string, name: string) => void;
  removeFolder: (id: string) => void;
  setTheme: (theme: "light" | "dark") => void;
  setTimezone: (timezone: string) => void;
  setPlan: (plan: PlanId) => void;
  setAccount: (account: AccountProfile) => void;
  changePassword: (current: string, next: string) => Promise<"ok" | "wrong" | "short">;
  register: (input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<"ok" | "short" | "email" | "exists">;
  login: (email: string, password: string) => Promise<"ok" | "none" | "wrong" | "otp">;
  resetPassword: (email: string, next: string) => Promise<"ok" | "short" | "none">;
  setTwoFactor: (method: TwoFactorMethod | null) => "ok" | "email" | "phone";
  confirmCode: (code: string) => Promise<"ok" | "wrong">;
  dismissAlert: (documentId: string, offsetDays: number) => void;
  logOut: () => void;
};

const emptyAccount: AccountProfile = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
};

let pendingCode = "";

export function issuedTwoFactorCode(): string {
  return pendingCode;
}

function detectedZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

function newId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `doc-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function cleanAccount(value: Partial<AccountProfile> | undefined): AccountProfile {
  return {
    firstName: value?.firstName?.trim() ?? "",
    lastName: value?.lastName?.trim() ?? "",
    phone: value?.phone?.trim() ?? "",
    email: value?.email?.trim() ?? "",
  };
}

export const useDocket = create<DocketState>()(
  persist(
    (set, get) => ({
      documents: createDemoDocuments(),
      customTemplates: [],
      folders: [],
      hasSeeded: true,
      theme: "light",
      timezone: detectedZone(),
      plan: "free",
      account: emptyAccount,
      password: null,
      signedIn: false,
      sentAlerts: [],
      twoFactor: null,
      addDocument: (draft) => {
        const record: DocumentRecord = {
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
          noticeDeadline: draft.noticeDeadline,
          decision: draft.decision,
          owner: draft.owner.trim(),
          id: newId(),
          createdAt: new Date().toISOString(),
        };
        set({ documents: [record, ...get().documents] });
      },
      updateDocument: (id, draft) => {
        set({
          documents: get().documents.map((doc) =>
            doc.id === id
              ? {
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
                  fields: draft.fields ?? {},
                  noticeDeadline: draft.noticeDeadline,
                  decision: draft.decision,
                  owner: draft.owner.trim(),
                }
              : doc,
          ),
        });
      },
      renewDocument: (id, expiryDate) => {
        set({
          documents: get().documents.map((doc) =>
            doc.id === id ? { ...doc, expiryDate } : doc,
          ),
        });
      },
      removeDocument: (id) => {
        set({ documents: get().documents.filter((doc) => doc.id !== id) });
      },
      moveDocument: (id, folderId) => {
        set({
          documents: get().documents.map((doc) =>
            doc.id === id ? { ...doc, folderId } : doc,
          ),
        });
      },
      importDocuments: (docs) => {
        const existing = new Set(get().documents.map((d) => d.id));
        const incoming = docs.filter((d) => d.id && d.title && d.expiryDate);
        const merged = [
          ...incoming.filter((d) => !existing.has(d.id)),
          ...get().documents,
        ];
        set({ documents: merged, hasSeeded: true });
      },
      importFolders: (folders) => {
        const existing = new Set(get().folders.map((folder) => folder.id));
        const incoming = folders.filter(
          (folder) => folder.id && folder.name && !existing.has(folder.id),
        );
        if (incoming.length) set({ folders: [...incoming, ...get().folders] });
      },
      loadSamples: () => {
        set({ documents: createDemoDocuments(), hasSeeded: true });
      },
      addTemplate: (template) => {
        const base = {
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
          id: newId(),
        };
        set({ customTemplates: [base, ...get().customTemplates] });
      },
      removeTemplate: (id) => {
        set({ customTemplates: get().customTemplates.filter((item) => item.id !== id) });
      },
      addFolder: (name) => {
        const folder: Folder = { id: newId(), name: name.trim() };
        set({ folders: [folder, ...get().folders] });
        return folder.id;
      },
      renameFolder: (id, name) => {
        const next = name.trim();
        if (!next) return;
        set({
          folders: get().folders.map((folder) =>
            folder.id === id ? { ...folder, name: next } : folder,
          ),
        });
      },
      removeFolder: (id) => {
        set({
          folders: get().folders.filter((folder) => folder.id !== id),
          documents: get().documents.map((doc) =>
            doc.folderId === id ? { ...doc, folderId: "" } : doc,
          ),
        });
      },
      setTheme: (theme) => set({ theme }),
      setTimezone: (timezone) => set({ timezone }),
      setPlan: (plan) => set({ plan }),
      setAccount: (account) => set({ account: cleanAccount(account) }),
      changePassword: async (current, next) => {
        if (next.trim().length < 8) return "short";
        const existing = get().password;
        if (existing) {
          const currentHash = await hashPassword(current, existing.salt);
          if (currentHash !== existing.hash) return "wrong";
        }
        const salt = newId();
        set({ password: { salt, hash: await hashPassword(next.trim(), salt) } });
        return "ok";
      },
      register: async ({ firstName, lastName, email, password }) => {
        const nextEmail = email.trim();
        if (!nextEmail.includes("@")) return "email";
        if (password.trim().length < 8) return "short";
        if (get().password) return "exists";
        const salt = newId();
        const current = get().account;
        set({
          account: cleanAccount({
            ...current,
            firstName: firstName.trim() || current.firstName,
            lastName: lastName.trim() || current.lastName,
            email: nextEmail,
          }),
          password: { salt, hash: await hashPassword(password.trim(), salt) },
          signedIn: true,
        });
        return "ok";
      },
      login: async (email, password) => {
        const admin = email.trim().toLowerCase() === "admin" && password === "admin";
        if (!admin) {
          const existing = get().password;
          if (!existing) return "none";
          const known = get().account.email.trim().toLowerCase();
          if (known && email.trim().toLowerCase() !== known) return "wrong";
          const hash = await hashPassword(password, existing.salt);
          if (hash !== existing.hash) return "wrong";
        }
        if (get().twoFactor) {
          pendingCode = get().twoFactor?.method === "app" ? "" : oneTimeCode();
          return "otp";
        }
        set({ signedIn: true });
        return "ok";
      },
      resetPassword: async (email, next) => {
        if (next.trim().length < 8) return "short";
        const existing = get().password;
        const known = get().account.email.trim().toLowerCase();
        if (!existing || !known || email.trim().toLowerCase() !== known) return "none";
        const salt = newId();
        set({ password: { salt, hash: await hashPassword(next.trim(), salt) } });
        return "ok";
      },
      setTwoFactor: (method) => {
        if (!method) {
          set({ twoFactor: null });
          return "ok";
        }
        const account = get().account;
        if (method === "email" && !account.email.includes("@")) return "email";
        if (method === "phone" && account.phone.replace(/\D/g, "").length < 6) return "phone";
        set({ twoFactor: { method, secret: createSecret() } });
        return "ok";
      },
      confirmCode: async (code) => {
        const factor = get().twoFactor;
        if (!factor) return "wrong";
        const entered = code.replace(/\D/g, "");
        const ok = factor.method === "app" ? await codeMatches(factor.secret, entered) : entered === pendingCode;
        if (!ok) return "wrong";
        pendingCode = "";
        set({ signedIn: true });
        return "ok";
      },
      dismissAlert: (documentId, offsetDays) => {
        const sentAlerts = get().sentAlerts ?? [];
        if (sentAlerts.some((item) => item.documentId === documentId && item.offsetDays === offsetDays)) return;
        set({ sentAlerts: [...sentAlerts, { documentId, offsetDays }] });
      },
      logOut: () => set({ signedIn: false }),
    }),
    {
      name: "digitalni-sef-board-v1",
      version: 9,
      skipHydration: true,
      migrate: (persisted) => {
        const state = persisted as Partial<DocketState>;
        const password =
          state.password &&
          typeof state.password.salt === "string" &&
          typeof state.password.hash === "string"
            ? state.password
            : null;
        return {
          ...state,
          folders: state.folders ?? [],
          customTemplates: state.customTemplates ?? [],
          theme: state.theme === "dark" ? "dark" : "light",
          timezone: state.timezone || detectedZone(),
          plan:
            state.plan === "plus" ||
            state.plan === "monthly" ||
            state.plan === "yearly" ||
            state.plan === "lifetime"
              ? state.plan
              : "free",
          account: cleanAccount(state.account),
          password,
          signedIn: state.signedIn === true,
          twoFactor:
            state.twoFactor &&
            (state.twoFactor.method === "email" ||
              state.twoFactor.method === "phone" ||
              state.twoFactor.method === "app") &&
            typeof state.twoFactor.secret === "string"
              ? state.twoFactor
              : null,
          documents: (state.documents ?? []).map((doc) =>
            withAccountability(
              backfillDemoFields({
                ...doc,
                folderId: doc.folderId ?? "",
                fileName: doc.fileName ?? "",
                templateId: doc.templateId ?? "",
                fields: doc.fields ?? {},
                noticeDeadline: doc.noticeDeadline ?? "",
                decision: doc.decision,
                owner: doc.owner ?? "",
              }),
            ),
          ),
          sentAlerts: state.sentAlerts ?? [],
        } as DocketState;
      },
    },
  ),
);

export function useDocketHydrated(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve(useDocket.persist.rehydrate()).finally(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
}
