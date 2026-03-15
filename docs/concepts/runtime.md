---
title: Runtime
---

# Runtime

Runtime is execution resources and state.

Runtime does not define task meaning. Runtime makes execution possible.

## Why this exists

The engine needs concrete resources to operate:

- a Playwright `page`
- API clients
- database handles
- deterministic test helpers

That is what runtime is for.

## How it works

Runtime is passed into `operator.execute()` and then into the engine.

You can think of runtime as dependency injection for execution.

## Example

```ts
runtime: {
  page,
}
```

## Notes

:::warning Common confusion
Runtime holds resources. Engine performs execution.
:::

:::info Current
The current checked-in browser example uses a Playwright `page` as runtime.
:::
