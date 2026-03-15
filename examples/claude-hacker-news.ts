import { existsSync } from "node:fs";

import { chromium } from "playwright";

import {
  createCapabilityRegistry,
  createOperator,
  defineCapability,
} from "../src/index.js";
import { createClaudeBrowserEngine } from "../src/engines/claude-browser-engine.js";
import type {
  BrowserRuntime,
  ClaudeHackerNewsContext,
  ClaudeHackerNewsResult,
} from "../src/engines/types.js";

function resolveBrowserExecutablePath(): string | undefined {
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

  return undefined;
}

const capabilities = createCapabilityRegistry({
  "browser.extract_hacker_news_top_story_with_claude": defineCapability<
    ClaudeHackerNewsResult,
    ClaudeHackerNewsContext,
    BrowserRuntime
  >({
    name: "browser.extract_hacker_news_top_story_with_claude",
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
const model =
  typeof process.env.ANTHROPIC_MODEL === "string" &&
  process.env.ANTHROPIC_MODEL.length > 0
    ? process.env.ANTHROPIC_MODEL
    : undefined;

const operator = createOperator({
  engine: createClaudeBrowserEngine(
    model !== undefined ? { model } : undefined,
  ),
  capabilities,
});
const executablePath = resolveBrowserExecutablePath();
const browser = await chromium.launch({
  headless: true,
  ...(executablePath !== undefined ? { executablePath } : {}),
});
const page = await browser.newPage();

try {
  const execution = await operator.execute({
    goal: "Open Hacker News and extract the current top story",
    capability: "browser.extract_hacker_news_top_story_with_claude",
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

      // Verify remains deterministic acceptance logic at the operator layer.
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

  console.log("result", execution.result);
  console.log("trace", execution.trace.status);
} finally {
  await browser.close();
}
