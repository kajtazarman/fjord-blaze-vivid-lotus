import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Marketing() {
  return (
    <div className="min-h-screen text-foreground">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <a href="#top" className="flex items-center gap-2">
            <Mark />
            <span className="font-display text-xl">Digitalni Sef</span>
          </a>
          <nav className="flex items-center gap-2">
            <a
              href="#how"
              className="hidden h-11 items-center px-3 text-sm text-muted-foreground sm:inline-flex"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="hidden h-11 items-center px-3 text-sm text-muted-foreground sm:inline-flex"
            >
              Pricing
            </a>
            <Button asChild>
              <Link to="/app">Open the safe</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="bg-charcoal text-primary-foreground">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
            <div>
              <p className="text-xs font-medium tracking-widest text-primary-foreground/60 uppercase">
                For operators, not spreadsheets
              </p>
              <h1 className="mt-4 font-display text-5xl leading-none font-medium tracking-tight sm:text-6xl">
                Get organized.
                <span className="block italic">Stay compliant.</span>
              </h1>
              <p className="mt-6 max-w-md text-lg text-primary-foreground/75">
                Digitalni Sef is a quiet board for the documents that fine you when they
                lapse — registrations, leases, insurance, licences. A reminder lands at
                8:00 AM, with the renewal link attached.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="secondary" className="bg-card text-foreground">
                  <Link to="/app">Start with three free</Link>
                </Button>
                <a
                  href="#board"
                  className="inline-flex h-11 items-center rounded-full px-5 text-sm text-primary-foreground/80"
                >
                  See the board
                </a>
              </div>
            </div>

            <div className="rounded-lg bg-background p-3 shadow-[var(--shadow-card)] sm:p-4">
              <BoardPreview />
            </div>
          </div>
        </section>

        <section id="board" className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            The board
          </p>
          <h2 className="mt-3 max-w-xl font-display text-4xl font-medium tracking-tight">
            Everything that expires, on one surface.
          </h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            No folders. No tree. Cards sorted by what is due next, with the next step
            written on the card itself.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <article className="overflow-hidden rounded-lg bg-card shadow-[var(--shadow-card)] md:col-span-2">
              <img
                src="/board/van.jpg"
                alt="A white panel van on a wet street"
                className="aspect-video w-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
              />
              <div className="p-4">
                <p className="text-xs tracking-widest text-muted-foreground uppercase">
                  Vehicle · 6 days
                </p>
                <h3 className="mt-2 font-sans text-lg font-medium">Sprinter registration</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Book the inspection before the plate lapses.
                </p>
              </div>
            </article>
            <article className="rounded-lg bg-card p-4 shadow-[var(--shadow-card)]">
              <p className="text-xs tracking-widest text-muted-foreground uppercase">
                This week
              </p>
              <h3 className="mt-2 font-sans text-lg font-medium">Before Friday</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0" />
                  Confirm the insurance quote
                </li>
                <li className="flex gap-2 text-muted-foreground">
                  <span className="mt-0.5 size-4 shrink-0 rounded-sm border border-border" />
                  Book the technical inspection
                </li>
                <li className="flex gap-2 text-muted-foreground">
                  <span className="mt-0.5 size-4 shrink-0 rounded-sm border border-border" />
                  Send the lease notice
                </li>
              </ul>
            </article>
            <article className="rounded-lg bg-card-2 p-5 shadow-[var(--shadow-card)]">
              <p className="font-display text-3xl leading-tight">8:00 AM.</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Emails leave at the start of your workday, in your timezone — not at
                midnight, and not without the link.
              </p>
            </article>
            <article className="overflow-hidden rounded-lg bg-card shadow-[var(--shadow-card)]">
              <img
                src="/board/lease.jpg"
                alt="A key and a folded contract on a wooden desk"
                className="aspect-video w-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
              />
              <div className="p-4">
                <p className="text-xs tracking-widest text-muted-foreground uppercase">
                  Lease · 19 days
                </p>
                <h3 className="mt-1 font-sans text-lg font-medium">Warehouse, unit 4</h3>
              </div>
            </article>
            <article className="rounded-lg bg-card p-4 shadow-[var(--shadow-card)]">
              <img
                src="/board/folder.jpg"
                alt="A charcoal folder and a rubber stamp"
                className="aspect-square w-full rounded-md object-cover outline outline-1 -outline-offset-1 outline-black/10"
              />
              <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">policy.pdf</p>
                  <p className="text-xs text-muted-foreground">Attached to the reminder</p>
                </div>
                <ArrowUpRight className="size-4 text-muted-foreground" />
              </div>
            </article>
          </div>
        </section>

        <section id="how" className="border-t border-border">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-3">
            {[
              ["01", "Add it in two minutes", "Name, category, expiry, and the link you actually use to renew."],
              ["02", "Choose the warning", "30, 7, and 1 day is the default. Leases can start at 90."],
              ["03", "Act from the email", "The reminder carries the next step and the portal, at 8:00 AM local."],
            ].map(([n, title, body]) => (
              <div key={n}>
                <p className="font-display text-sm text-muted-foreground">{n}</p>
                <h2 className="mt-2 font-display text-3xl font-medium">{title}</h2>
                <p className="mt-3 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="font-display text-4xl font-medium">Start from a template</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["Vehicle registration", "Office lease", "Commercial insurance", "Operating licence"].map(
              (name) => (
                <Link
                  key={name}
                  to="/app"
                  className="rounded-lg bg-card p-4 shadow-[var(--shadow-card)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-card-hover)]"
                >
                  <p className="text-sm text-muted-foreground">Quick add</p>
                  <p className="mt-2 font-medium">{name}</p>
                </Link>
              ),
            )}
          </div>
        </section>

        <section id="pricing" className="border-t border-border">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 py-16 md:grid-cols-2">
            <article className="rounded-lg bg-card p-6 shadow-[var(--shadow-card)]">
              <p className="text-xs tracking-widest text-muted-foreground uppercase">Free</p>
              <h2 className="mt-3 font-display text-4xl font-medium">Three live reminders</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Add as many documents as you like. The first three keep their 8:00 AM
                alerts. The rest stay visible, reminders paused.
              </p>
              <Button asChild className="mt-6">
                <Link to="/app">Open the safe</Link>
              </Button>
            </article>
            <article className="rounded-lg bg-charcoal p-6 text-primary-foreground">
              <p className="text-xs tracking-widest text-primary-foreground/60 uppercase">
                Unlimited
              </p>
              <h2 className="mt-3 font-display text-4xl font-medium">Every document awake</h2>
              <p className="mt-3 text-sm text-primary-foreground/75">
                Reminders run on the fourth document and every one after it. Built for
                fleets, landlords, and anyone past a handful of deadlines.
              </p>
              <p className="mt-6 text-sm text-primary-foreground/60">
                Accounting firms and inspection centres can refer clients and keep 20% of
                the subscription.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <p>Digitalni Sef</p>
          <p>Reminders at the start of the workday.</p>
        </div>
      </footer>
    </div>
  );
}

function Mark() {
  return (
    <span className="inline-flex size-9 items-center justify-center rounded-full bg-foreground text-background">
      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
        <rect x="5" y="10" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 10V8a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    </span>
  );
}

function BoardPreview() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="overflow-hidden rounded-md bg-card shadow-[var(--shadow-card)]">
        <img src="/board/van.jpg" alt="" className="h-28 w-full object-cover" />
        <div className="p-3">
          <p className="text-xs text-muted-foreground">Vehicle</p>
          <p className="font-medium">Sprinter · 6 days</p>
        </div>
      </div>
      <div className="rounded-md bg-card-2 p-3 shadow-[var(--shadow-card)]">
        <p className="text-xs text-muted-foreground">Insurance</p>
        <p className="mt-1 font-medium">Liability policy</p>
        <p className="mt-2 text-sm text-muted-foreground">4 days · quote attached</p>
      </div>
      <div className="rounded-md bg-card p-3 shadow-[var(--shadow-card)] sm:col-span-2">
        <p className="text-xs text-muted-foreground">Things to do</p>
        <p className="mt-2 text-sm">Book the inspection</p>
        <p className="mt-1 text-sm text-muted-foreground">Send the lease notice</p>
      </div>
    </div>
  );
}
