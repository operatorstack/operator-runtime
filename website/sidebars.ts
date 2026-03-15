import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docsSidebar: [
    "intro",
    {
      type: "category",
      label: "Architecture",
      items: [
        "architecture/overview",
        "architecture/execution-model",
        "architecture/layers",
        "architecture/deterministic-boundaries",
      ],
    },
    {
      type: "category",
      label: "Core Concepts",
      items: [
        "concepts/operator",
        "concepts/capabilities",
        "concepts/context",
        "concepts/runtime",
        "concepts/engine",
        "concepts/verification",
        "concepts/traces",
      ],
    },
    {
      type: "category",
      label: "Runtimes",
      items: [
        "runtimes/browser-runtime",
        "runtimes/sequence-runtime",
        "runtimes/future-llm-runtime",
      ],
    },
    {
      type: "category",
      label: "Guides",
      items: [
        "guides/first-operator",
        "guides/browser-example",
        "guides/defining-capabilities",
        "guides/verification-patterns",
      ],
    },
    {
      type: "category",
      label: "Examples",
      items: [
        "examples/hacker-news-top-story",
        "examples/extract-invoice",
      ],
    },
    {
      type: "category",
      label: "Reference",
      items: [
        "reference/operator-api",
        "reference/capability-api",
        "reference/engine-interface",
      ],
    },
  ],
};

export default sidebars;
