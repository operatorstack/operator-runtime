---
title: Layers
---

# Layers

The architecture has clear layers. Each layer answers a different question.

## Why this exists

When these layers blur together, automation systems become hard to reason about and harder to debug.

## How it works

### Operator layer

The operator owns the execution contract:

- goal
- capability
- context
- runtime
- verify

### Capability layer

The capability defines the bounded task domain. It says what the run means.

### Engine layer

The engine performs execution for the selected capability.

### Runtime layer

The runtime carries resources and state that execution can use.

### Verification layer

Verification decides whether the result is accepted.

### Trace layer

Trace records attempts, verification outcomes, and final status.

## Example

For the Hacker News example:

- operator: asks for the top story
- capability: `browser.extract_hacker_news_top_story`
- context: `{ url }`
- runtime: `{ page }`
- engine: Playwright-backed browser executor
- verification: checks title length, URL shape, and source domain
- trace: records the accepted attempt

## Notes

:::warning Common confusion
Runtime and engine are separate layers. Runtime holds resources. Engine performs execution.
:::
