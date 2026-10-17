import { createFileRoute } from "@tanstack/react-router";
import { DocsScreen } from "@/components/docs-screen";

export const Route = createFileRoute("/docs/$slug")({
  component: function DocPage() {
    const { slug } = Route.useParams();
    return <DocsScreen slug={slug} />;
  },
});
