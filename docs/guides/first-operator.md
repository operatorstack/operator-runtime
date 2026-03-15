---
title: Your First Operator
---

# Your First Operator

This guide shows the exact mental model for the SDK:

- runtime holds resources
- engine performs execution
- capability provides task-domain contract
- verify defines acceptance boundary

## Why this exists

If you understand these four statements, the rest of the system becomes straightforward.

## How it works

```text
OPERATOR
  │
  │ task + context + verify
  ▼
Capability-selected execution
  │
  ▼
Engine
  │
  │ uses runtime
  ▼
Runtime (Browser / APIs / Test Runtime)
  │
  ▼
Environment
  │
  ▼
Verification
  │
  ▼
Result + Trace
```

Build the run in this order:

1. define a capability
2. define an engine
3. create an operator
4. execute with goal, context, runtime, and verify

## Example

```ts
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
    return result.title.length > 5;
  },
});
```

## Notes

- Put task meaning in the capability.
- Put concrete input in context.
- Put resources in runtime.
- Put acceptance logic in verification.
