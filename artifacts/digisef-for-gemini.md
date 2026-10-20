# DigiSef — recreate this exact web app

You are rebuilding DigiSef, a document-expiry reminder app by SideQuest. Match this source. Do not redesign it, do not rename it, do not add a logo mark. The wordmark is the text **DigiSef** only. No favicon icon.

## What to build
A single-page React app (Vite + React + TypeScript + Tailwind v4 + Zustand persist is fine). Local-only data. No backend required.

Routes:
- `/` landing page
- `/login` login / register / forgot password
- `/app` dashboard (auth gate)
- `/docs`, `/docs/privacy`, `/docs/security`, `/docs/terms`, `/docs/trademark`, `/docs/privacy-choices`

Demo login: email `admin`, password `admin`.

## Look
Notion-like. Inter, bold wordmark, warm black `#37352f`, page white, blue actions `#0075de`, real red `#ff0000` for logout, delete, expired, and missing folder name. Selected sidebar tab is blue `#0075de` on `#e6f3fe`. Add-document and add-folder tiles are blue dashed. Back links are bordered buttons. Footer (© 2026 SideQuest plus legal links) stays at the bottom of the viewport on short pages and after the content on long pages.

## Product behavior to keep
- Landing: header DigiSef (goes home), Login top right (goes to login unless already signed in). Interactive demo. Get started.
- Login: one DigiSef wordmark. Login on top, register adds fields without moving the wordmark. Forgot password asks for email then a new password.
- Dashboard: left rail on desktop (Board, Folders, Account, Settings). Bottom tabs on phone. Search stays fixed at the top. Log out is bold red on the right. No label left of search.
- Board: cards and compact list. Sort by name, soonest expiry, latest expiry. Soon-to-expire documents have a strong red border. Add document: PDF is the primary option, templates are the second step. Click a document to open the record, with Edit.
- Folders: same board look. Add folder asks for a name and lets you search and pick existing documents. Empty name shows a red box and “Enter a folder name.” Delete is bold red.
- Templates: preview before use. Built-ins include car registration, contract, lease, insurance, employment, personal reminder, general agreement.
- Account: name, last name, phone, email, timezone, change password, enable 2FA (app, email, or phone).
- Settings: dark mode, plan (free max file 10 MB; Plus monthly, yearly, lifetime via a Lemon Squeezy-style checkout), stacked as a narrow tower, not huge blocks. Support: sidequestbh@gmail.com. Powered by SideQuest is in the footer area, not floating over the page.
- Legal footer links open the real policy pages and match the legal copy in `src/lib/legal.ts`.

## Source
Implement from the files below. They are the current app. Preserve copy, colors, layout, and interactions.



===== FILE: src/styles.css =====

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
@import "tailwindcss";
@import "tw-animate-css";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Inter", ui-sans-serif, system-ui, sans-serif;

  --color-background: #ffffff;
  --color-foreground: #37352f;
  --color-card: #ffffff;
  --color-card-2: #f7f6f5;
  --color-muted: #f1f0ee;
  --color-muted-foreground: #5c5b57;
  --color-subtle: #6f6e6a;
  --color-border: #d0cec8;
  --color-primary: #37352f;
  --color-primary-foreground: #ffffff;
  --color-destructive: #ff0000;
  --color-destructive-foreground: #ffffff;
  --color-ring: #37352f;
  --color-charcoal: #191919;
  --color-danger-soft: #ffd0d0;
  --color-warn: #ff5a00;
  --color-warn-soft: #ffd2b8;
  --color-ok: #00b140;
  --color-ok-soft: #c6f5d4;
  --color-watch: #0066ff;
  --color-watch-soft: #d4e4ff;

  --shadow-card: 0 1px 2px rgba(55, 53, 47, 0.06), 0 0 0 1px rgba(55, 53, 47, 0.14);
  --shadow-card-hover: 0 8px 24px rgba(55, 53, 47, 0.08), 0 0 0 1px rgba(55, 53, 47, 0.08);

  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;

  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-smooth-out: cubic-bezier(0.22, 1, 0.36, 1);
}

@layer base {
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }

  html,
  body,
  #app {
    min-height: 100%;
  }

  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: var(--font-sans);
    line-height: 1.5;
  }

  h1,
  h2,
  h3 {
    text-wrap: balance;
    font-family: var(--font-sans);
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.25;
  }

  p {
    text-wrap: pretty;
  }

  button,
  input,
  textarea,
  select,
  option {
    font-family: inherit;
  }

  [data-sonner-toaster] {
    font-family: var(--font-sans);
  }

  button:not(:disabled),
  [role="button"]:not(:disabled) {
    cursor: pointer;
  }

  input,
  select,
  textarea {
    font: inherit;
  }
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  height: 2.25rem;
  margin-bottom: 1rem;
  padding: 0 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-card);
  color: var(--color-foreground);
  font-size: 0.875rem;
  font-weight: 600;
}

.back-link:hover {
  border-color: #0075de;
  background: #e6f3fe;
  color: #0075de;
}

.add-tile {
  border: 1.5px dashed #0075de;
  background: #f3f9fe;
  color: #37352f;
}

.add-tile:hover {
  background: #e6f3fe;
}

.dark .add-tile {
  border-color: #4d94ff;
  background: #0d2248;
  color: #d4d4d1;
}

.dark .add-tile:hover {
  background: #12306a;
}

.dark .back-link:hover {
  background: #0d2248;
  color: #4d94ff;
}

.notion-light {
  --color-background: #ffffff;
  --color-foreground: #37352f;
  --color-card: #ffffff;
  --color-muted: #f1f0ee;
  --color-muted-foreground: #5c5b57;
  --color-subtle: #6f6e6a;
  --color-border: #d0cec8;
  --color-primary: #37352f;
  --color-primary-foreground: #ffffff;
  color: #37352f;
  color-scheme: light;
}

.dark {
  --color-background: #191919;
  --color-foreground: #d4d4d1;
  --color-card: #202020;
  --color-card-2: #2a2a2a;
  --color-muted: #2f2f2f;
  --color-muted-foreground: #9b9b97;
  --color-subtle: #7a7a76;
  --color-border: #4a4a46;
  --color-primary: #e8e8e6;
  --color-primary-foreground: #191919;
  --color-ring: #e8e8e6;
  --color-charcoal: #111111;
  --color-danger-soft: #4a0c0c;
  --color-warn: #ff7a1a;
  --color-warn-soft: #4a2208;
  --color-ok: #00e05a;
  --color-ok-soft: #063318;
  --color-watch: #4d94ff;
  --color-watch-soft: #0d2248;
  color-scheme: dark;
}

@keyframes notion-rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.notion-rise {
  animation: notion-rise 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.notion-rise-2 { animation-delay: 90ms; }
.notion-rise-3 { animation-delay: 180ms; }
.notion-rise-4 { animation-delay: 280ms; }

@keyframes notion-row {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.notion-row {
  animation: notion-row 420ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes notion-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(0, 117, 222, 0);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(0, 117, 222, 0.18);
  }
}

.notion-pulse {
  animation: notion-pulse 1.4s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .notion-rise,
  .notion-row,
  .notion-pulse,
  .stagger-in {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(8px);
    filter: blur(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

.stagger-in {
  animation: rise-in 400ms var(--ease-smooth-out) both;
}

.stagger-in:nth-child(1) { animation-delay: 0ms; }
.stagger-in:nth-child(2) { animation-delay: 40ms; }
.stagger-in:nth-child(3) { animation-delay: 80ms; }
.stagger-in:nth-child(4) { animation-delay: 120ms; }
.stagger-in:nth-child(5) { animation-delay: 160ms; }
.stagger-in:nth-child(6) { animation-delay: 200ms; }
.stagger-in:nth-child(7) { animation-delay: 240ms; }
.stagger-in:nth-child(8) { animation-delay: 280ms; }
.stagger-in:nth-child(9) { animation-delay: 320ms; }
.stagger-in:nth-child(10) { animation-delay: 360ms; }
.stagger-in:nth-child(n+11) { animation-delay: 400ms; }

```


===== FILE: src/routes/index.tsx =====

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/landing";

export const Route = createFileRoute("/")({ component: Landing });

```


===== FILE: src/routes/login.tsx =====

```tsx
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AuthScreen } from "@/components/auth-screen";
import { useDocket, useDocketHydrated } from "@/lib/store";

function LoginPage() {
  const ready = useDocketHydrated();
  const signedIn = useDocket((state) => state.signedIn);
  if (!ready) return <div className="min-h-dvh bg-background" />;
  if (signedIn) return <Navigate to="/app" />;
  return <AuthScreen />;
}

export const Route = createFileRoute("/login")({ component: LoginPage });

```


===== FILE: src/routes/app.tsx =====

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/dashboard";

export const Route = createFileRoute("/app")({ component: Dashboard });


```


===== FILE: src/routes/docs/index.tsx =====

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { DocsScreen } from "@/components/docs-screen";

export const Route = createFileRoute("/docs/")({
  component: function DocsIndex() {
    return <DocsScreen slug={null} />;
  },
});

```


===== FILE: src/routes/docs/$slug.tsx =====

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { DocsScreen } from "@/components/docs-screen";

export const Route = createFileRoute("/docs/$slug")({
  component: function DocPage() {
    const { slug } = Route.useParams();
    return <DocsScreen slug={slug} />;
  },
});

```


===== FILE: src/components/landing.tsx =====

```tsx
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/site-footer";

const scenes = [
  {
    key: "add",
    label: "Add",
    title: "Add the document",
    body: "Upload a PDF, or start from a template such as a registration, contract, or lease.",
  },
  {
    key: "date",
    label: "Date",
    title: "Set the date",
    body: "Enter the expiry and the reminder. DigiSef uses your timezone, so 8:00 AM is local.",
  },
  {
    key: "soon",
    label: "Soon",
    title: "Watch the board",
    body: "What is due soon is marked. Sort by name, or by the soonest and latest expiry.",
  },
] as const;

const baseRows = [
  ["Car registration", "12 May"],
  ["Office lease", "2 Sep"],
  ["Insurance policy", "18 Nov"],
];

export function Landing() {
  const [scene, setScene] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setScene((index) => (index + 1) % scenes.length), 2600);
    return () => window.clearInterval(id);
  }, [paused]);

  const active = scenes[scene];

  return (
    <div className="notion-light flex min-h-dvh flex-col bg-white text-black">
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between bg-white/85 px-4 backdrop-blur-md sm:px-6">
        <Link to="/" className="text-[17px] font-bold tracking-[-0.05em] text-black">
          DigiSef
        </Link>
        <nav className="flex items-center gap-1">
          <a
            href="#how"
            className="hidden h-8 items-center rounded-md px-2.5 text-sm font-medium text-black/60 transition-colors hover:bg-[#f6f5f4] hover:text-black sm:inline-flex"
          >
            How it works
          </a>
          <Link
            to="/login"
            className="inline-flex h-8 items-center rounded-md bg-[#0075de] px-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#005bab]"
          >
            Login
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-5 pt-16 pb-6 text-center sm:pt-24">
          <h1 className="notion-rise text-[2.7rem] leading-[0.98] font-bold tracking-[-0.045em] sm:text-7xl">
            Know what expires before it does.
          </h1>
          <p className="notion-rise notion-rise-2 mx-auto mt-5 max-w-lg text-base font-medium text-black/60 sm:text-lg">
            DigiSef is one page for registrations, insurance, leases, and contracts.
          </p>
        </section>

        <section
          id="how"
          className="notion-rise notion-rise-3 mx-auto max-w-3xl px-4 pb-8 sm:px-5"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="mb-3 flex justify-center gap-1">
            {scenes.map((item, index) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setScene(index)}
                className={`h-8 rounded-md px-3 text-sm font-semibold transition-colors duration-200 ${
                  index === scene ? "bg-[#e6f3fe] text-[#0075de]" : "text-black/60 hover:bg-[#f6f5f4]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="overflow-hidden rounded-xl border border-black/8 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_24px_60px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-2 border-b border-black/8 px-4 py-2.5 text-xs font-medium text-black/60">
              <span className="font-bold tracking-[-0.04em] text-black">DigiSef</span>
              <span>/</span>
              <span className="text-black">Documents</span>
            </div>
            <div className="px-3 py-6 sm:px-7 sm:py-8">
              <p className="px-2 text-4xl font-bold tracking-[-0.04em]">Documents</p>
              <p className="mt-2 min-h-12 px-2 text-sm font-medium text-black/60 transition-opacity duration-300">
                {active.body}
              </p>
              <div className="mt-6 grid grid-cols-[minmax(0,1fr)_4.2rem_3.2rem] border-b border-black/8 px-2 pb-2 text-xs font-semibold text-black/60 sm:grid-cols-[1fr_5.5rem_4.5rem]">
                <span>Name</span>
                <span>Expires</span>
                <span>Status</span>
              </div>
              <div
                className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ gridTemplateRows: scene === 0 ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <div
                    className={`mt-1 grid grid-cols-[minmax(0,1fr)_4.2rem_3.2rem] items-center rounded-md bg-[#e6f3fe] px-2 py-2.5 text-sm font-semibold text-[#0075de] transition-opacity duration-300 sm:grid-cols-[1fr_5.5rem_4.5rem] ${
                      scene === 0 ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <span className="truncate">New contract</span>
                    <span>Add date</span>
                    <span>New</span>
                  </div>
                </div>
              </div>
              {baseRows.map(([name, date], index) => {
                const dating = scene === 1 && index === 0;
                const soon = scene === 2 && index === 0;
                return (
                  <div
                    key={name}
                    className={`mt-1 grid grid-cols-[minmax(0,1fr)_4.2rem_3.2rem] items-center rounded-md px-2 py-2.5 text-sm font-semibold transition-colors duration-300 sm:grid-cols-[1fr_5.5rem_4.5rem] ${
                      soon ? "bg-[#ffd0d0] text-[#ff0000]" : "text-black"
                    }`}
                  >
                    <span className="truncate">{name}</span>
                    <span className={dating ? "notion-pulse rounded-md px-1 text-[#0075de]" : "font-medium text-black/60"}>
                      {date}
                    </span>
                    <span className={soon ? "notion-row" : "text-black/0"}>{soon ? "Soon" : "Open"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-t border-black/8">
          <div className="mx-auto grid max-w-5xl gap-3 px-5 py-16 sm:grid-cols-3 sm:py-20">
            {scenes.map((step, index) => (
              <button
                key={step.key}
                type="button"
                onClick={() => {
                  setScene(index);
                  document.getElementById("how")?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className={`rounded-xl p-4 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                  index === scene ? "bg-[#f6f5f4]" : "hover:bg-[#f6f5f4]"
                }`}
              >
                <p className="text-xs font-bold text-black/60">0{index + 1}</p>
                <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em]">{step.title}</h2>
                <p className="mt-2 text-sm font-medium leading-6 text-black/60">{step.body}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="border-t border-black/8 bg-[#f6f5f4]">
          <div className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
            <h2 className="text-4xl font-bold tracking-[-0.04em]">What it does</h2>
            <ul className="mt-8 divide-y divide-black/10">
              {[
                ["Board and list", "A page of cards, or a compact list of the name, type, and date."],
                ["Folders", "Group documents, and search when you file one."],
                ["Templates", "Start from a ready record, preview it, or write your own."],
                ["Plans", "Free covers three documents and files up to 10 MB. Plus covers every document and files up to 50 MB."],
              ].map(([title, body]) => (
                <li
                  key={title}
                  className="grid gap-1 rounded-lg px-2 py-4 transition-colors duration-200 hover:bg-white sm:grid-cols-[11rem_1fr] sm:gap-8"
                >
                  <p className="text-sm font-bold">{title}</p>
                  <p className="text-sm font-medium text-black/60">{body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="security" className="border-t border-black/8">
          <div className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
            <h2 className="text-4xl font-bold tracking-[-0.04em]">Security</h2>
            <p className="mt-3 max-w-lg text-sm font-medium text-black/60">
              For records you would rather not leave in a chat or a shared sheet.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["Hashed password", "Stored as a hash, not as plain text."],
                ["Second factor", "A code by email, phone, or an authenticator app."],
                ["Card checkout", "Payment details stay on Lemon Squeezy."],
              ].map(([title, body]) => (
                <li
                  key={title}
                  className="rounded-xl border border-black/8 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-[#0075de]/30 hover:shadow-[0_12px_30px_rgba(0,117,222,0.08)]"
                >
                  <p className="text-sm font-bold">{title}</p>
                  <p className="mt-1 text-sm font-medium text-black/60">{body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

```


===== FILE: src/components/auth-screen.tsx =====

```tsx
import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDocket, issuedTwoFactorCode } from "@/lib/store";
import { cn } from "@/lib/utils";
import { currentCode } from "@/lib/two-factor";

export function AuthScreen() {
  const register = useDocket((state) => state.register);
  const login = useDocket((state) => state.login);
  const resetPassword = useDocket((state) => state.resetPassword);
  const confirmCode = useDocket((state) => state.confirmCode);
  const accountEmail = useDocket((state) => state.account.email);
  const hasPassword = useDocket((state) => Boolean(state.password));
  const [mode, setMode] = useState<"login" | "register">("login");
  const [forgot, setForgot] = useState(false);
  const [resetReady, setResetReady] = useState(false);
  const [needsCode, setNeedsCode] = useState(false);
  const [code, setCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    if (needsCode) {
      const result = await confirmCode(code);
      setBusy(false);
      if (result === "wrong") toast.error("That code is wrong.");
      return;
    }
    if (forgot && mode === "login") {
      if (!resetReady) {
        setBusy(false);
        const known = accountEmail.trim().toLowerCase();
        if (!hasPassword || !known || email.trim().toLowerCase() !== known) {
          toast.error("No account uses that email.");
          return;
        }
        setResetReady(true);
        setPassword("");
        return;
      }
      const result = await resetPassword(email, password);
      setBusy(false);
      if (result === "short") toast.error("Password needs at least 8 characters.");
      else if (result === "none") toast.error("No account uses that email.");
      else {
        toast.success("Password updated. Log in.");
        setPassword("");
        setForgot(false);
        setResetReady(false);
      }
      return;
    }
    if (mode === "login") {
      const result = await login(email, password);
      setBusy(false);
      if (result === "none") toast.error("No account yet. Register first.");
      else if (result === "wrong") toast.error("Email or password is wrong.");
      else if (result === "otp") {
        const factor = useDocket.getState().twoFactor;
        const sent = issuedTwoFactorCode();
        if (factor?.method === "phone") {
          toast.message(`Code sent to your phone${sent ? `: ${sent}` : ""}`);
        } else if (factor?.method === "email") {
          toast.message(`Code sent to your email${sent ? `: ${sent}` : ""}`);
        } else {
          const appCode = factor ? await currentCode(factor.secret) : "";
          toast.message(appCode ? `Authenticator code: ${appCode}` : "Enter the code from your authenticator app");
        }
        setNeedsCode(true);
        setCode("");
      }
      return;
    }
    const result = await register({ firstName, lastName, email, password });
    setBusy(false);
    if (result === "email") toast.error("Enter a real email.");
    else if (result === "short") toast.error("Password needs at least 8 characters.");
    else if (result === "exists") toast.error("An account already exists. Log in.");
  }

  return (
    <div className="notion-light bg-white text-[#37352f]">
      <div className="flex min-h-dvh flex-col">
        <main className="flex flex-1 flex-col items-center px-4 pt-16 pb-10 sm:pt-[18vh]">
          <Link to="/" aria-label="DigiSef" className="text-4xl font-bold tracking-[-0.06em] text-black">
            DigiSef
          </Link>
          <div className="mt-8 grid w-full max-w-sm grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setForgot(false);
                setResetReady(false);
              }}
              className={cn(
                "h-9 rounded-md text-sm",
                mode === "login" ? "bg-[#0075de] text-white" : "bg-[#f6f5f4] text-black",
              )}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setForgot(false);
                setResetReady(false);
              }}
              className={cn(
                "h-9 rounded-md text-sm",
                mode === "register" ? "bg-[#0075de] text-white" : "bg-[#f6f5f4] text-black",
              )}
            >
              Register
            </button>
          </div>
          <form onSubmit={(event) => void submit(event)} className="mt-4 grid w-full max-w-sm gap-2.5">
            {needsCode ? (
              <Input
                inputMode="numeric"
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter code"
                aria-label="Authentication code"
                autoComplete="one-time-code"
                className="border-[#e6e5e3] bg-white"
                required
              />
            ) : (
              <>
            {mode === "register" ? (
              <>
                <Input
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="First name"
                  aria-label="First name"
                  autoComplete="given-name"
                  className="border-[#e6e5e3] bg-white"
                />
                <Input
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="Last name"
                  aria-label="Last name"
                  autoComplete="family-name"
                  className="border-[#e6e5e3] bg-white"
                />
              </>
            ) : null}
            <Input
              type={mode === "login" && !forgot ? "text" : "email"}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={forgot ? "Enter email" : mode === "login" ? "Email or user" : "Email"}
              aria-label={forgot ? "Enter email" : mode === "login" ? "Email or user" : "Email"}
              autoComplete="username"
              className="border-[#e6e5e3] bg-white"
              required
            />
            {forgot && mode === "login" && !resetReady ? null : (
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={forgot ? "New password" : "Password"}
                aria-label={forgot ? "New password" : "Password"}
                autoComplete={mode === "login" && !forgot ? "current-password" : "new-password"}
                className="border-[#e6e5e3] bg-white"
                required
              />
            )}
            {mode === "login" ? (
              <button
                type="button"
                onClick={() => {
                  setForgot((open) => !open);
                  setResetReady(false);
                }}
                className="justify-self-start text-sm text-[#37352f]/60"
              >
                {forgot ? "Back to login" : "Forgot password"}
              </button>
            ) : null}
              </>
            )}
            <Button type="submit" disabled={busy} className="mt-1 h-9 w-full rounded-md bg-[#0075de] text-white hover:bg-[#005bab]">
              {needsCode
                ? "Confirm code"
                : forgot && mode === "login"
                  ? resetReady
                    ? "Change password"
                    : "Continue"
                  : mode === "login"
                    ? "Continue"
                    : "Create account"}
            </Button>
          </form>
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}

```


===== FILE: src/components/dashboard.tsx =====

```tsx
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

```


===== FILE: src/components/document-record.tsx =====

```tsx
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

```


===== FILE: src/components/document-card.tsx =====

```tsx
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

```


===== FILE: src/components/document-form.tsx =====

```tsx
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

```


===== FILE: src/components/checkout-screen.tsx =====

```tsx
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CHECKOUT_PLANS, type PaidPlan } from "@/lib/billing";
import { cn } from "@/lib/utils";

type LemonEvent = { event?: string };

declare global {
  interface Window {
    createLemonSqueezy?: () => void;
    LemonSqueezy?: {
      Url: { Open: (url: string) => void };
      Setup: (options: { eventHandler: (data: LemonEvent) => void }) => void;
    };
  }
}

function checkoutHref(raw: string, embed: boolean) {
  const url = new URL(raw);
  if (embed) url.searchParams.set("embed", "1");
  return url.toString();
}

export function CheckoutScreen({
  onBack,
  onPaid,
}: {
  onBack: () => void;
  onPaid: (plan: PaidPlan) => void;
}) {
  const [picked, setPicked] = useState<PaidPlan>("lifetime");
  const paid = useRef(onPaid);
  paid.current = onPaid;
  const pickedRef = useRef(picked);
  pickedRef.current = picked;

  function openLemon(embed: boolean) {
    const plan = CHECKOUT_PLANS.find((item) => item.id === pickedRef.current);
    if (!plan?.url.startsWith("https://")) {
      toast.error("The Lemon Squeezy checkout link is not connected yet");
      return;
    }
    const href = checkoutHref(plan.url, embed);
    if (embed && window.LemonSqueezy?.Url?.Open) {
      window.LemonSqueezy.Url.Open(href);
      return;
    }
    window.location.assign(checkoutHref(plan.url, false));
  }

  useEffect(() => {
    const setup = () => {
      window.createLemonSqueezy?.();
      window.LemonSqueezy?.Setup({
        eventHandler(data) {
          if (data.event === "Checkout.Success") paid.current(pickedRef.current);
        },
      });
    };
    const existing = document.querySelector<HTMLScriptElement>("script[data-lemon]");
    if (existing) {
      setup();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://app.lemonsqueezy.com/js/lemon.js";
    script.defer = true;
    script.dataset.lemon = "1";
    script.onload = setup;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <main className="mx-auto flex w-full max-w-lg flex-col px-4 py-8">
        <button type="button" onClick={onBack} className="back-link">
          Back
        </button>
          <p className="text-sm text-muted-foreground">DigiSef Plus</p>
          <h1 className="mt-2 text-2xl font-medium tracking-tight">Choose a plan</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Lemon Squeezy takes your name, address, email, and card.
          </p>
          <div className="mt-6 grid gap-3">
            {CHECKOUT_PLANS.map((plan) => {
              const lifetime = plan.id === "lifetime";
              const selected = picked === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setPicked(plan.id)}
                  className={cn(
                    "rounded-lg px-4 text-left",
                    lifetime ? "min-h-36 py-5" : "py-4",
                    selected
                      ? "bg-foreground text-background"
                      : "bg-card text-foreground shadow-[var(--shadow-card)]",
                  )}
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className={cn("font-medium", lifetime && "text-xl")}>{plan.name}</span>
                    <span className={cn("font-medium", lifetime ? "text-3xl" : "text-lg")}>
                      {plan.price}
                      <span className={cn("font-normal", selected ? "text-background/70" : "text-muted-foreground")}>
                        {plan.interval === "once" ? "" : ` / ${plan.interval}`}
                      </span>
                    </span>
                  </span>
                  <span className={cn("mt-2 block text-sm", selected ? "text-background/70" : "text-muted-foreground")}>
                    {plan.note}
                  </span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="mt-6 h-11 rounded-lg bg-foreground text-sm font-medium text-background"
            onClick={() => openLemon(true)}
          >
            Pay with Lemon Squeezy
          </button>
          <button type="button" className="mt-3 text-sm text-muted-foreground" onClick={() => openLemon(false)}>
            Open the checkout page instead
          </button>
        </main>
    </div>
  );
}

```


===== FILE: src/components/docs-screen.tsx =====

```tsx
import { Link } from "@tanstack/react-router";
import { LEGAL_DOCS, legalDoc } from "@/lib/legal";
import { SiteFooter } from "@/components/site-footer";

export function DocsScreen({ slug }: { slug: string | null }) {
  const doc = slug ? legalDoc(slug) : null;

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center bg-background px-3">
        <Link to="/" className="text-[15px] font-bold tracking-[-0.04em] text-foreground">
          DigiSef
        </Link>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
          {slug && !doc ? (
            <article>
              <h1 className="text-2xl font-medium tracking-tight">Page not found</h1>
              <p className="mt-3 text-sm text-muted-foreground">That page is not part of DigiSef.</p>
            </article>
          ) : doc ? (
            <article>
              <h1 className="text-2xl font-medium tracking-tight">{doc.title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">Updated {doc.updated}</p>
              <p className="mt-4 text-sm">{doc.summary}</p>
              {doc.sections.map((section) => (
                <section key={section.heading} className="mt-8">
                  <h2 className="text-lg font-medium">{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="mt-2 text-sm text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
              <p className="mt-8 text-sm">
                <a className="text-foreground underline" href="mailto:sidequestbh@gmail.com">
                  sidequestbh@gmail.com
                </a>
              </p>
            </article>
          ) : (
            <article>
              <h1 className="text-2xl font-medium tracking-tight">DigiSef</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Privacy, terms, and the other policies for this app.
              </p>
              <ul className="mt-6 grid gap-3">
                {LEGAL_DOCS.map((item) => (
                  <li key={item.slug}>
                    <Link
                      to="/docs/$slug"
                      params={{ slug: item.slug }}
                      className="block rounded-lg bg-card p-4 shadow-[var(--shadow-card)]"
                    >
                      <span className="font-medium">{item.title}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">{item.summary}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          )}
        </main>
      <SiteFooter />
    </div>
  );
}

```


===== FILE: src/components/site-footer.tsx =====

```tsx
import { Link } from "@tanstack/react-router";

const LINKS = [
  { slug: "privacy", label: "Privacy policy" },
  { slug: "security", label: "Report security issues" },
  { slug: "terms", label: "Terms of service" },
  { slug: "trademark", label: "Trademark" },
  { slug: "privacy-choices", label: "Your privacy choices" },
] as const;

export function SiteFooter() {
  return (
    <footer className="shrink-0 border-t border-border bg-background px-4 py-8 text-xs text-muted-foreground">
      <p className="text-center">© 2026 SideQuest</p>
      <nav aria-label="Legal" className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        {LINKS.map((item, index) => (
          <span key={item.slug} className="inline-flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true">|</span> : null}
            <Link
              to="/docs/$slug"
              params={{ slug: item.slug }}
              className="text-foreground underline-offset-2 hover:underline"
            >
              {item.label}
            </Link>
          </span>
        ))}
      </nav>
    </footer>
  );
}
```


===== FILE: src/components/ui/button.tsx =====

```tsx
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium outline-none transition-[opacity,transform,background-color,color,box-shadow] duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:ring-2 focus-visible:ring-ring/30 active:not-disabled:scale-[0.96]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-90",
        secondary: "bg-muted text-foreground hover:bg-border",
        outline: "border border-border bg-card text-foreground hover:bg-muted",
        ghost: "text-foreground hover:bg-muted",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
      },
      size: {
        default: "h-9 rounded-md px-3",
        sm: "h-8 rounded-md px-2.5",
        lg: "h-10 rounded-md px-4",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}

export { Button, buttonVariants };

```


===== FILE: src/components/ui/input.tsx =====

```tsx
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground shadow-none outline-none transition-[box-shadow,border-color] duration-150 ease-out placeholder:text-subtle focus-visible:border-foreground/40 focus-visible:ring-2 focus-visible:ring-ring/10 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };

```


===== FILE: src/components/ui/dialog.tsx =====

```tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;
const DialogPortal = DialogPrimitive.Portal;

function DialogOverlay({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-foreground/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-[min(100%-1.5rem,32rem)] max-h-[min(90vh,44rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-card p-5 text-foreground shadow-[var(--shadow-card)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute top-3 right-3 inline-flex size-11 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30">
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mb-4 space-y-1 pr-10", className)} {...props} />;
}

function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("font-display text-xl font-medium text-foreground", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

```


===== FILE: src/components/ui/alert-dialog.tsx =====

```tsx
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;

function AlertDialogOverlay({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-foreground/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogContent({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        className={cn(
          "fixed top-1/2 left-1/2 z-50 w-[min(100%-1.5rem,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-card p-5 text-foreground shadow-[var(--shadow-card)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className,
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

function AlertDialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      className={cn("font-display text-xl font-medium", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return (
    <AlertDialogPrimitive.Action
      className={cn(buttonVariants({ variant: "destructive" }), className)}
      {...props}
    />
  );
}

function AlertDialogCancel({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};

```


===== FILE: src/components/ui/badge.tsx =====

```tsx
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium tracking-wide",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };

```


===== FILE: src/components/ui/date-picker.tsx =====

```tsx
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  addDays,
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
};

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

function parseDay(value: string): Date | null {
  if (!value) return null;
  const parsed = parseISO(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function DatePicker({ value, onChange, label = "Date" }: DatePickerProps) {
  const selected = parseDay(value);
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(() => startOfMonth(selected ?? new Date()));
  const [box, setBox] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setCursor(startOfMonth(parseDay(value) ?? new Date()));
    function place() {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = 348;
      const height = 400;
      let top = rect.bottom + 8;
      if (top + height > window.innerHeight - 12) top = Math.max(12, rect.top - height - 8);
      let left = rect.left;
      if (left + width > window.innerWidth - 12) left = window.innerWidth - width - 12;
      if (left < 12) left = 12;
      setBox({ top, left });
    }
    place();
    function onPointer(event: MouseEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, value]);

  const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
  const days = Array.from({ length: 42 }, (_, index) => addDays(start, index));
  const today = new Date();

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-12 w-full items-center rounded-md border border-border bg-background px-3 text-left text-base text-foreground"
      >
        {selected ? format(selected, "d MMM yyyy") : <span className="text-subtle">Pick a date</span>}
      </button>
      {open
        ? createPortal(
            <div
              ref={panelRef}
              role="dialog"
              aria-label={label}
              style={{ top: box.top, left: box.left }}
              className="fixed z-[80] w-[348px] rounded-xl border border-border bg-card p-4 text-foreground shadow-[0_16px_40px_rgba(15,15,15,0.14)]"
            >
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  aria-label="Previous month"
                  className="flex size-10 items-center justify-center rounded-md hover:bg-muted"
                  onClick={() => setCursor((month) => addMonths(month, -1))}
                >
                  <ChevronLeft className="size-5" />
                </button>
                <p className="text-base font-semibold tracking-tight">{format(cursor, "MMMM yyyy")}</p>
                <button
                  type="button"
                  aria-label="Next month"
                  className="flex size-10 items-center justify-center rounded-md hover:bg-muted"
                  onClick={() => setCursor((month) => addMonths(month, 1))}
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
              <div className="mb-1 grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
                {WEEKDAYS.map((day, index) => (
                  <span key={`${day}-${index}`} className="flex h-8 items-center justify-center">
                    {day}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 justify-items-center">
                {days.map((day) => {
                  const on = selected ? isSameDay(day, selected) : false;
                  const inMonth = isSameMonth(day, cursor);
                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => {
                        onChange(format(day, "yyyy-MM-dd"));
                        setOpen(false);
                      }}
                      className={cn(
                        "flex size-11 items-center justify-center rounded-full text-[15px] font-medium",
                        !inMonth && "text-muted-foreground/40",
                        !on && isSameDay(day, today) && "bg-muted",
                        on ? "bg-[#0075de] text-white" : "hover:bg-muted",
                      )}
                    >
                      {format(day, "d")}
                    </button>
                  );
                })}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

```


===== FILE: src/lib/documents.ts =====

```tsx
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

```


===== FILE: src/lib/store.ts =====

```tsx
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

```


===== FILE: src/lib/legal.ts =====

```tsx
export type DocSection = { heading: string; paragraphs: string[] };

export type LegalDoc = {
  slug: string;
  title: string;
  summary: string;
  updated: string;
  sections: DocSection[];
};

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "privacy",
    title: "Privacy policy",
    summary: "What DigiSef collects, how it is used, and how it is stored.",
    updated: "13 October 2026",
    sections: [
      {
        heading: "Welcome",
        paragraphs: [
          "Contact: sidequestbh@gmail.com",
          "Welcome to DigiSef. Operated by the SideQuest studio, we are committed to protecting the privacy and security of our B2B users, including small business owners, operations managers, and fleet managers.",
        ],
      },
      {
        heading: "Information we collect",
        paragraphs: [
          "To deliver our automated compliance tracking services, we collect and process the following data:",
          "Account data: we collect your email address, local timezone (IANA format), and passwords, which are securely hashed using Argon2id.",
          "Federated authentication: if you opt for third-party logins, we collect identity data from Google OAuth or Auth0.",
          "Document metadata: we store the data you input, including document names, categories, expiry dates, plain text notes, and actionable renewal links.",
          "File uploads: you may optionally upload PDF or JPG files up to 10MB in size.",
          "Payment metadata: we process Stripe customer IDs and subscription statuses to manage premium accounts.",
          "Product telemetry: we collect analytics events (for example document_created and paywall_impression), associated user IDs, and contextual payloads to improve application performance.",
        ],
      },
      {
        heading: "How we use your data",
        paragraphs: [
          "We use your timezone and document metadata exclusively to dispatch automated email alerts with embedded renewal links at exactly 08:00 AM in your local time. Payment metadata is used solely to manage billing and enforce our freemium access limits.",
        ],
      },
      {
        heading: "Data storage and security",
        paragraphs: [
          "Encryption at rest: uploaded files are stored in AWS S3 or self-hosted SeaweedFS utilizing standard AES-256 server-side encryption (SSE-S3).",
          "Database security: authentication tokens are secured using SHA-256 hashing. Database backups are locally encrypted via GPG and synced securely to offsite Cloudflare R2 object storage.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of service",
    summary: "What DigiSef does, how the free and paid plans work, and the limits of the service.",
    updated: "13 October 2026",
    sections: [
      {
        heading: "Contact",
        paragraphs: ["Contact: sidequestbh@gmail.com"],
      },
      {
        heading: "1. Service description",
        paragraphs: [
          "DigiSef is a lightweight automated expiration tracker designed to help businesses monitor compliance deadlines for assets such as vehicle registrations, commercial insurance, and office leases. The service dispatches email reminders at 30, 7, and 1-day intervals prior to expiration.",
        ],
      },
      {
        heading: "2. Freemium model and billing",
        paragraphs: [
          "Free tier: users may track up to 3 documents completely free of charge.",
          "Paywall restrictions: attempting to track a fourth document will place the new record in a locked state. Automated reminders for locked documents remain paused until the user activates a paid Stripe subscription.",
        ],
      },
      {
        heading: "3. User limitations and responsibilities",
        paragraphs: [
          "Manual data entry: expiration dates must be manually inputted. DigiSef does not currently support OCR or AI-based extraction from uploaded files.",
          "Access constraints: accounts are restricted to single-user logins. Multi-user role-based access control (RBAC) is not currently supported.",
        ],
      },
      {
        heading: "4. Limitation of liability",
        paragraphs: [
          "SideQuest is not legally or financially responsible for missed compliance deadlines, operational halts, late fees, or fines resulting from user input errors, ignored alerts, or misconfigured reminders.",
        ],
      },
    ],
  },
  {
    slug: "security",
    title: "Report security issues",
    summary: "How to report a vulnerability in DigiSef.",
    updated: "13 October 2026",
    sections: [
      {
        heading: "Contact",
        paragraphs: [
          "Contact: sidequestbh@gmail.com",
          "SideQuest treats the security of B2B infrastructure and client data as our absolute highest priority.",
          "If you discover a vulnerability in the DigiSef application, API, or cloud storage architecture, please report it immediately. Critical production vulnerabilities (P0), such as unauthorized data access or broken authentication, are treated as emergencies. Our engineering team will immediately halt all active feature development to deploy a hotfix.",
        ],
      },
    ],
  },
  {
    slug: "trademark",
    title: "Trademark",
    summary: "Who owns the DigiSef and SideQuest names.",
    updated: "13 October 2026",
    sections: [
      {
        heading: "Ownership",
        paragraphs: [
          "Contact: sidequestbh@gmail.com",
          "“DigiSef” and “SideQuest” are brand assets owned and operated by the SideQuest founding team: Haris Nuspahić, Belmin Kadić, and Arman Kajtaz.",
          "All intellectual property associated with the DigiSef platform, including the monorepo codebase, database schemas, UI component systems, logos, and trade secrets, is exclusively assigned to the joint SideQuest entity. Users and third parties may not utilize the DigiSef name, logo, or proprietary assets without explicit written authorization.",
        ],
      },
    ],
  },
  {
    slug: "privacy-choices",
    title: "Your privacy choices",
    summary: "How you control what DigiSef stores.",
    updated: "13 October 2026",
    sections: [
      {
        heading: "Your choices",
        paragraphs: [
          "Contact: sidequestbh@gmail.com",
          "DigiSef is designed to minimize data friction and grant you total control over your business compliance records.",
          "Explicitly optional storage: uploading files to our servers is entirely optional. If you prefer, you can track your deadlines using text-based metadata alone to completely bypass cloud storage.",
          "Authentication freedom: you may authenticate using a secure password or utilize federated identity providers (Google OAuth, Auth0) to limit the credentials you share.",
          "Right to erasure: should you choose to delete your DigiSef account, our database enforces a strict cascading delete rule (ON DELETE CASCADE) that permanently purges all of your associated documents, files, metadata, and analytics from our systems.",
        ],
      },
    ],
  },
];

export function legalDoc(slug: string): LegalDoc | undefined {
  return LEGAL_DOCS.find((doc) => doc.slug === slug);
}

```


===== FILE: src/lib/two-factor.ts =====

```tsx
export type TwoFactorMethod = "email" | "phone" | "app";

export type TwoFactor = {
  method: TwoFactorMethod;
  secret: string;
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function createSecret(): string {
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => ALPHABET[byte % 32]).join("");
}

function decodeSecret(secret: string): Uint8Array {
  const clean = secret.replace(/=+$/g, "").toUpperCase();
  const out: number[] = [];
  let buffer = 0;
  let bits = 0;
  for (const char of clean) {
    const value = ALPHABET.indexOf(char);
    if (value < 0) continue;
    buffer = (buffer << 5) | value;
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      out.push((buffer >> bits) & 0xff);
    }
  }
  return new Uint8Array(out);
}

async function hotp(secret: string, counter: number): Promise<string> {
  const bytes = new ArrayBuffer(8);
  new DataView(bytes).setUint32(4, counter);
  const raw = decodeSecret(secret);
  const keyBytes = new Uint8Array(raw.byteLength);
  keyBytes.set(raw);
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, bytes));
  const offset = mac[mac.length - 1] & 0xf;
  const bin =
    ((mac[offset] & 0x7f) << 24) |
    (mac[offset + 1] << 16) |
    (mac[offset + 2] << 8) |
    mac[offset + 3];
  return String(bin % 1_000_000).padStart(6, "0");
}

export async function currentCode(secret: string, at = Date.now()): Promise<string> {
  return hotp(secret, Math.floor(at / 30_000));
}

export async function codeMatches(secret: string, code: string): Promise<boolean> {
  const entered = code.replace(/\D/g, "");
  const now = Date.now();
  const checks = await Promise.all([-1, 0, 1].map((step) => currentCode(secret, now + step * 30_000)));
  return checks.includes(entered);
}

export function oneTimeCode(): string {
  return String(Math.floor(100_000 + Math.random() * 900_000));
}

```
