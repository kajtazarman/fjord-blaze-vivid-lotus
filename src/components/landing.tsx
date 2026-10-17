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
