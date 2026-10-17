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