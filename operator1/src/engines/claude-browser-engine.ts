import Anthropic from "@anthropic-ai/sdk";

import type { OperatorEngine } from "../operator/types.js";
import { pageToText } from "../utils/page-to-text.js";
import type {
  BrowserRuntime,
  ClaudeHackerNewsContext,
  ClaudeHackerNewsRegistry,
  ClaudeHackerNewsResult,
  PageEvidence,
} from "./types.js";

const DEFAULT_MODEL = "claude-3-5-haiku-latest";

function getAnthropicModel(input?: { model?: string }): string {
  if (typeof input?.model === "string" && input.model.length > 0) {
    return input.model;
  }

  if (
    typeof process.env.ANTHROPIC_MODEL === "string" &&
    process.env.ANTHROPIC_MODEL.length > 0
  ) {
    return process.env.ANTHROPIC_MODEL;
  }

  return DEFAULT_MODEL;
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
    typeof value.page.goto === "function" &&
    typeof value.page.url === "function"
  );
}

function hasClaudeHackerNewsContext(
  value: unknown,
): value is ClaudeHackerNewsContext {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (!("url" in value)) {
    return false;
  }

  return typeof value.url === "string" && value.url.length > 0;
}

function getAnthropicApiKey(): string {
  if (
    typeof process.env.ANTHROPIC_API_KEY === "string" &&
    process.env.ANTHROPIC_API_KEY.length > 0
  ) {
    return process.env.ANTHROPIC_API_KEY;
  }

  throw new Error("Missing ANTHROPIC_API_KEY environment variable");
}

function buildClaudePrompt(input: {
  goal: string;
  context: ClaudeHackerNewsContext;
  evidence: PageEvidence;
}): string {
  return [
    "Task:",
    input.goal,
    "",
    "Context:",
    `targetURL: ${input.context.url}`,
    "",
    "Instructions:",
    "- Use only the page evidence below.",
    "- Identify the first or top visible Hacker News story.",
    "- Return strict JSON only.",
    "- Use the current page URL as sourceURL.",
    "- Do not add prose or markdown fences.",
    "",
    "Expected JSON shape:",
    '{"title":"...","url":"...","sourceURL":"..."}',
    "",
    "Page evidence:",
    JSON.stringify(input.evidence, null, 2),
  ].join("\n");
}

function extractTextContent(response: Anthropic.Messages.Message): string {
  const textBlocks = response.content.filter((contentBlock) => {
    return contentBlock.type === "text";
  });

  return textBlocks.map((contentBlock) => {
    return contentBlock.text;
  }).join("\n");
}

function stripMarkdownFences(value: string): string {
  const trimmed = value.trim();

  if (!trimmed.startsWith("```")) {
    return trimmed;
  }

  const lines = trimmed.split("\n");

  if (lines.length <= 2) {
    return trimmed;
  }

  const lastLine = lines[lines.length - 1];

  if (typeof lastLine !== "string" || lastLine.trim() !== "```") {
    return trimmed;
  }

  return lines.slice(1, -1).join("\n").trim();
}

function extractJSONObject(value: string): string {
  const candidate = stripMarkdownFences(value);
  const firstBrace = candidate.indexOf("{");
  const lastBrace = candidate.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    throw new Error(`Claude did not return JSON: ${candidate}`);
  }

  return candidate.slice(firstBrace, lastBrace + 1);
}

function parseClaudeResult(value: string): ClaudeHackerNewsResult {
  const json = extractJSONObject(value);
  const parsed: unknown = JSON.parse(json);

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Claude JSON response was not an object");
  }

  if (!("title" in parsed) || typeof parsed.title !== "string") {
    throw new Error("Claude JSON response missing title");
  }

  if (!("url" in parsed) || typeof parsed.url !== "string") {
    throw new Error("Claude JSON response missing url");
  }

  if (!("sourceURL" in parsed) || typeof parsed.sourceURL !== "string") {
    throw new Error("Claude JSON response missing sourceURL");
  }

  return {
    title: parsed.title,
    url: parsed.url,
    sourceURL: parsed.sourceURL,
  };
}

export function createClaudeBrowserEngine(input?: {
  model?: string;
}): OperatorEngine<ClaudeHackerNewsRegistry> {
  const client = new Anthropic({
    apiKey: getAnthropicApiKey(),
  });
  const model = getAnthropicModel(input);

  return {
    async run(engineInput): Promise<ClaudeHackerNewsResult> {
      if (!hasBrowserPage(engineInput.runtime)) {
        throw new Error("Missing runtime.page");
      }

      if (!hasClaudeHackerNewsContext(engineInput.context)) {
        throw new Error("Missing context.url");
      }

      // Runtime holds browser resources and state for execution.
      await engineInput.runtime.page.goto(engineInput.context.url, {
        waitUntil: "domcontentloaded",
      });

      const evidence = await pageToText(engineInput.runtime.page);
      const prompt = buildClaudePrompt({
        goal: engineInput.goal,
        context: engineInput.context,
        evidence,
      });
      const response = await client.messages.create({
        model,
        max_tokens: 400,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });
      const text = extractTextContent(response);

      // The Claude engine performs probabilistic extraction from grounded page evidence.
      return parseClaudeResult(text);
    },
  };
}
