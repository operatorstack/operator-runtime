---
title: Hacker News Top Story
---

# Hacker News Top Story

This example is the current live-site browser example in the repo.

## Why this exists

It proves the narrow browser-backed operator loop:

- operator receives a goal
- capability selects the task domain
- browser engine executes with a real page
- verification accepts or rejects deterministically
- trace records the outcome

## How it works

The script lives at `src/examples/browser-hacker-news.ts`.

## Example

```ts
import { existsSync } from "node:fs";
import { chromium, type Page } from "playwright";

import {
  createCapabilityRegistry,
  createOperator,
  defineCapability,
  type CapabilityContext,
  type CapabilityOutput,
  type CapabilityRuntime,
  type EngineRunInput,
  type OperatorEngine,
} from "../index.js";

type ExtractHackerNewsTopStoryContext = {
  url: string;
};

type ExtractHackerNewsTopStoryResult = {
  title: string;
  url: string;
  sourceURL: string;
};

type BrowserRuntime = {
  page: Page;
};

function isExtractHackerNewsTopStoryContext(
  value: unknown,
): value is ExtractHackerNewsTopStoryContext {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (!("url" in value)) {
    return false;
  }

  return typeof value.url === "string";
}

function hasBrowserPage(value: unknown): value is BrowserRuntime {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (!("page" in value)) {
    return false;
  }

  if (typeof value.page !== "object" || value.page === null) {
    return false;
  }

  return (
    "goto" in value.page &&
    "url" in value.page &&
    "locator" in value.page &&
    typeof value.page.goto === "function" &&
    typeof value.page.url === "function" &&
    typeof value.page.locator === "function"
  );
}

const capabilities = createCapabilityRegistry({
  "browser.extract_hacker_news_top_story": defineCapability<
    ExtractHackerNewsTopStoryResult,
    ExtractHackerNewsTopStoryContext,
    BrowserRuntime
  >({
    name: "browser.extract_hacker_news_top_story",
    defaultVerify(result) {
      const violations: string[] = [];

      if (typeof result.title !== "string" || result.title.length === 0) {
        violations.push("Missing title");
      }

      if (typeof result.url !== "string" || result.url.length === 0) {
        violations.push("Missing url");
      }

      if (
        typeof result.sourceURL !== "string" ||
        result.sourceURL.length === 0
      ) {
        violations.push("Missing sourceURL");
      }

      return {
        passed: violations.length === 0,
        violations,
      };
    },
  }),
});

type BrowserCapabilities = typeof capabilities;
type ExtractHackerNewsTopStoryRunInput = EngineRunInput<
  CapabilityOutput<BrowserCapabilities, "browser.extract_hacker_news_top_story">,
  CapabilityContext<BrowserCapabilities, "browser.extract_hacker_news_top_story">,
  CapabilityRuntime<BrowserCapabilities, "browser.extract_hacker_news_top_story">
>;

const browserEngine: OperatorEngine<BrowserCapabilities> = {
  async run(
    input: ExtractHackerNewsTopStoryRunInput,
  ): Promise<
    CapabilityOutput<BrowserCapabilities, "browser.extract_hacker_news_top_story">
  > {
    if (!hasBrowserPage(input.runtime)) {
      throw new Error("Missing runtime.page");
    }

    if (!isExtractHackerNewsTopStoryContext(input.context)) {
      throw new Error("Missing context.url");
    }

    await input.runtime.page.goto(input.context.url, {
      waitUntil: "domcontentloaded",
    });

    const topStoryLink = input.runtime.page
      .locator(".athing .titleline > a")
      .first();

    await topStoryLink.waitFor({ state: "visible" });

    const title = await topStoryLink.innerText();
    const href = await topStoryLink.getAttribute("href");

    if (typeof href !== "string" || href.length === 0) {
      throw new Error("Missing top story href");
    }

    return {
      title,
      url: new URL(href, input.runtime.page.url()).toString(),
      sourceURL: input.runtime.page.url(),
    };
  },
};

function resolveBrowserExecutablePath(): string {
  if (
    typeof process.env.OPERATOR_RUNTIME_BROWSER_PATH === "string" &&
    process.env.OPERATOR_RUNTIME_BROWSER_PATH.length > 0
  ) {
    return process.env.OPERATOR_RUNTIME_BROWSER_PATH;
  }

  const macOSChromePath =
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

  if (existsSync(macOSChromePath)) {
    return macOSChromePath;
  }

  throw new Error(
    "Set OPERATOR_RUNTIME_BROWSER_PATH to a local Chromium-based browser executable.",
  );
}

function isHeadedMode(): boolean {
  return (
    process.env.HEADED === "1" || process.env.OPERATOR_RUNTIME_HEADED === "1"
  );
}

const browser = await chromium.launch({
  executablePath: resolveBrowserExecutablePath(),
  headless: !isHeadedMode(),
});
const page = await browser.newPage();

try {
  const operator = createOperator({
    engine: browserEngine,
    capabilities,
  });

  const execution = await operator.execute({
    goal: "Open Hacker News and extract the current top story",
    capability: "browser.extract_hacker_news_top_story",
    context: {
      url: "https://news.ycombinator.com/",
    },
    runtime: {
      page,
    },
    verify(result) {
      const passed =
        result.title.length > 5 &&
        result.url.startsWith("http") &&
        result.sourceURL.includes("news.ycombinator.com");

      if (passed) {
        return {
          passed: true,
        };
      }

      return {
        passed: false,
        reason: `Unexpected Hacker News result: ${JSON.stringify(result)}`,
      };
    },
  });

  console.log(JSON.stringify(execution.result, null, 2));
  console.log(execution.trace.status);
} finally {
  await browser.close();
}
```

## Notes

:::info Current
This is a checked-in runnable example today.
:::
