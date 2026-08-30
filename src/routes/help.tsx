import { createFileRoute } from "@tanstack/react-router";
import { ModulePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help / Support — Neural PredictOS" },
      { name: "description", content: "Help / Support module of Neural PredictOS, the AI material demand and procurement intelligence layer for apparel factories." },
      { property: "og:title", content: "Help / Support — Neural PredictOS" },
      { property: "og:description", content: "Help / Support module of Neural PredictOS planning intelligence." },
    ],
  }),
  component: () => <ModulePlaceholder name="Help / Support" group="Workspace" />,
});
