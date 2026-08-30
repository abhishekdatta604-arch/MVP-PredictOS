import { createFileRoute } from "@tanstack/react-router";
import { ModulePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/data/integration")({
  head: () => ({
    meta: [
      { title: "Data Integration — Neural PredictOS" },
      { name: "description", content: "Data Integration module of Neural PredictOS, the AI material demand and procurement intelligence layer for apparel factories." },
      { property: "og:title", content: "Data Integration — Neural PredictOS" },
      { property: "og:description", content: "Data Integration module of Neural PredictOS planning intelligence." },
    ],
  }),
  component: () => <ModulePlaceholder name="Data Integration" group="Data" />,
});
