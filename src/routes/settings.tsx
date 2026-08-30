import { createFileRoute } from "@tanstack/react-router";
import { ModulePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Neural PredictOS" },
      { name: "description", content: "Settings module of Neural PredictOS, the AI material demand and procurement intelligence layer for apparel factories." },
      { property: "og:title", content: "Settings — Neural PredictOS" },
      { property: "og:description", content: "Settings module of Neural PredictOS planning intelligence." },
    ],
  }),
  component: () => <ModulePlaceholder name="Settings" group="Workspace" />,
});
