---
title: Execution Model
---

# Execution Model

The execution model is intentionally narrow:

1. the operator receives a run request
2. the capability selects the task domain
3. the engine executes with the runtime
4. verification accepts or rejects the result
5. the trace records what happened

## Why this exists

This keeps the abstraction honest. The operator API talks about the run contract, not about browser clicks, prompts, or hidden planning loops.

## How it works

At a high level, the runtime behaves like this:

```text
operator.execute(...)
-> engine runs
-> candidate result is produced
-> capability default verification runs
-> per-run verify runs
-> result is accepted or retried
-> trace is returned
```

The current implementation uses a retry loop with a configurable maximum attempt count.

## Example

Current public usage looks like this:

```ts
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

- The engine does the work.
- The runtime makes the work possible.
- The capability tells the engine what kind of task is happening.
- Verification decides whether the candidate result is acceptable.
