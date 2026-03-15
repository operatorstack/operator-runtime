import type { Page } from "playwright";

import type { PageEvidence, PageLinkEvidence } from "../engines/types.js";

const MAX_VISIBLE_TEXT_LENGTH = 12000;
const MAX_LINKS = 20;

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function truncateText(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return value.slice(0, maxLength);
}

export async function pageToText(page: Page): Promise<PageEvidence> {
  const pageTitle = await page.title();
  const currentURL = page.url();
  const visibleText = await page.evaluate(() => {
    if (document.body === null) {
      return "";
    }

    return typeof document.body.innerText === "string"
      ? document.body.innerText
      : "";
  });
  const links = await page.$$eval("a", (anchors) => {
    return anchors
      .map((anchor) => {
        const text = typeof anchor.textContent === "string"
          ? anchor.textContent
          : "";

        return {
          text: text.trim(),
          href: anchor.href,
        };
      })
      .filter((link) => {
        return link.text.length > 0 && link.href.length > 0;
      })
      .slice(0, 20);
  });

  return {
    pageTitle: normalizeWhitespace(pageTitle),
    currentURL,
    visibleText: truncateText(
      normalizeWhitespace(visibleText),
      MAX_VISIBLE_TEXT_LENGTH,
    ),
    links: links.slice(0, MAX_LINKS).map((link): PageLinkEvidence => {
      return {
        text: normalizeWhitespace(link.text),
        href: link.href,
      };
    }),
  };
}
