---
title: Defining Capabilities
---

# Defining Capabilities

Define capabilities around bounded task domains.

## Why this exists

Good capability design prevents abstraction leakage.

Good:

- `automation.extract_invoice`
- `automation.capture_session`
- `browser.extract_hacker_news_top_story`

Bad:

- `browser.click`
- `browser.goto`
- `runtime.page.locator`

## How it works

When defining a capability:

1. name the task domain
2. define the output shape
3. add default verification for structural validity

## Example

```ts
defineCapability<ExtractHackerNewsTopStoryResult>({
  name: "browser.extract_hacker_news_top_story",
  defaultVerify(result) {
    const violations: string[] = [];

    if (typeof result.title !== "string" || result.title.length === 0) {
      violations.push("Missing title");
    }

    return {
      passed: violations.length === 0,
      violations,
    };
  },
});
```

## Notes

:::warning Common confusion
Capabilities are operator-level bounded task domains. They are not runtime or browser methods.
:::
