---
title: Introduction
---

# operator-runtime

`operator-runtime` is a TypeScript SDK for building automation systems around an operator model.

`operator-runtime` is still in active development.

The core idea is simple:

- define the task as a `goal`
- pick a `capability` that names the task domain
- pass structured `context`
- run with a real `runtime`
- let an `engine` execute
- accept or reject the result with deterministic `verify` logic
- inspect the `trace`

:::info Current
The current repo implements the operator runtime, capability registry, deterministic verification flow, trace recording, a browser-backed example, and a browser-backed integration test.
:::

:::info Planned
The docs discuss future runtime directions, including an LLM-backed runtime, but those parts are clearly marked as planned or WIP.
:::

## Why this exists

Most automation systems get muddy when task meaning, execution resources, and acceptance rules are mixed together.

This SDK separates them:

- the operator owns the run contract
- the capability names the task domain
- the engine performs execution
- the runtime supplies resources
- verification defines deterministic acceptance

## Mental model

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

## Start here

- Read [Architecture Overview](./architecture/overview.md) for the full execution model.
- Read [Capabilities](./concepts/capabilities.md), [Context](./concepts/context.md), and [Runtime](./concepts/runtime.md) to understand the core boundaries.
- Follow [Your First Operator](./guides/first-operator.md) to see the pieces together.
