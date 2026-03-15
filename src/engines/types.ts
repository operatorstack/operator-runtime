import type { MessageParam } from "@anthropic-ai/sdk/resources/messages/messages";
import type { Page } from "playwright";

import type { CapabilityDefinition } from "../capabilities/types.js";

export type BrowserRuntime = {
  page: Page;
};

export type ClaudeHackerNewsContext = {
  url: string;
};

export type ClaudeHackerNewsResult = {
  title: string;
  url: string;
  sourceURL: string;
};

export type ClaudeHackerNewsCapabilityName =
  "browser.extract_hacker_news_top_story_with_claude";

export type ClaudeHackerNewsRegistry = Record<
  ClaudeHackerNewsCapabilityName,
  CapabilityDefinition<
    ClaudeHackerNewsResult,
    ClaudeHackerNewsContext,
    BrowserRuntime
  >
>;

export type PageLinkEvidence = {
  text: string;
  href: string;
};

export type PageEvidence = {
  pageTitle: string;
  currentURL: string;
  visibleText: string;
  links: PageLinkEvidence[];
};

export type ClaudeMessageInput = {
  model: string;
  messages: MessageParam[];
};
