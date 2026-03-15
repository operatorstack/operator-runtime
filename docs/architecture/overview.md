---
title: Overview
---

# Architecture Overview

The operator model is the center of this SDK.

The operator does not define prompts, browser steps, or hidden workflow logic. The operator defines:

- a `goal`
- a `capability`
- optional structured `context`
- optional `runtime`
- optional `verify` logic

## Why this exists

This split keeps the system readable:

- task meaning lives in the capability
- execution input lives in context
- execution resources live in runtime
- execution behavior lives in the engine
- acceptance logic lives in verification

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

## Current

:::info Current
Today, `operator-runtime` supports:

- a typed operator API
- capability registries
- capability default verification
- per-run verification
- execution traces
- a browser-backed Playwright example
- a browser-backed integration test
:::

## Planned

:::info Planned
The docs refer to future engines and runtimes so the architecture stays extensible. A full LLM-backed runtime is not implemented in the repo today.
:::

## Notes

- A capability is not a browser method.
- Context is not prompt text.
- Runtime is not task meaning.
- Engine is not the same thing as runtime.
