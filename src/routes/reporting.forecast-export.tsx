import { createFileRoute } from "@tanstack/react-router";
import { ModulePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/reporting/forecast-export")({
  head: () => ({
    meta: [
      { title: "Forecast Export — Neural PredictOS" },
      { name: "description", content: "Forecast Export module of Neural PredictOS, the AI material demand and procurement intelligence layer for apparel factories." },
      { property: "og:title", content: "Forecast Export — Neural PredictOS" },
      { property: "og:description", content: "Forecast Export module of Neural PredictOS planning intelligence." },
    ],
  }),
  component: () => <ModulePlaceholder name="Forecast Export" group="Reporting" />,
});
