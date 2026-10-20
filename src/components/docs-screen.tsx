import { Link } from "@tanstack/react-router";
import { LEGAL_DOCS, legalDoc } from "@/lib/legal";
import { SiteFooter } from "@/components/site-footer";

export function DocsScreen({ slug }: { slug: string | null }) {
  const doc = slug ? legalDoc(slug) : null;

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between bg-background/85 px-4 backdrop-blur-md sm:px-6">
        <Link to="/" className="text-[17px] font-bold tracking-[-0.05em] text-foreground">
          DigiSef
        </Link>
        <Link
          to="/login"
          className="inline-flex h-8 items-center rounded-md bg-[#0075de] px-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#005bab]"
        >
          Login
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
