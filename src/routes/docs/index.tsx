import { createFileRoute } from "@tanstack/react-router";
import { DocsScreen } from "@/components/docs-screen";

export const Route = createFileRoute("/docs/")({
  component: function DocsIndex() {
    return <DocsScreen slug={null} />;
  },
});
