import { createFileRoute } from "@tanstack/react-router";
import { ModulePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/planning/what-if")({
  head: () => ({
    meta: [
      { title: "What-If Analysis — Neural PredictOS" },
      { name: "description", content: "What-If Analysis module of Neural PredictOS, the AI material demand and procurement intelligence layer for apparel factories." },
      { property: "og:title", content: "What-If Analysis — Neural PredictOS" },
      { property: "og:description", content: "What-If Analysis module of Neural PredictOS planning intelligence." },
    ],
  }),
  component: () => <ModulePlaceholder name="What-If Analysis" group="Planning" />,
});
