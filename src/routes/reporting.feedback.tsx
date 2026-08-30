import { createFileRoute } from "@tanstack/react-router";
import { ModulePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/reporting/feedback")({
  head: () => ({
    meta: [
      { title: "Manual Override & Feedback — Neural PredictOS" },
      { name: "description", content: "Manual Override & Feedback module of Neural PredictOS, the AI material demand and procurement intelligence layer for apparel factories." },
      { property: "og:title", content: "Manual Override & Feedback — Neural PredictOS" },
      { property: "og:description", content: "Manual Override & Feedback module of Neural PredictOS planning intelligence." },
    ],
  }),
  component: () => <ModulePlaceholder name="Manual Override & Feedback" group="Reporting" />,
});
