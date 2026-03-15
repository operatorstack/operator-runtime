---
title: Engine Interface
---

# Engine Interface

This page describes the current engine contract.

## Why this exists

The engine boundary is what lets the same operator model work with different runtimes.

## How it works

Current engine interface:

```ts
export interface OperatorEngine<TCapabilities extends CapabilityMap = CapabilityMap> {
  run(
    input: EngineRunInput<
      CapabilityOutputUnion<TCapabilities>,
      CapabilityContextUnion<TCapabilities>,
      CapabilityRuntimeUnion<TCapabilities>
    >,
  ): Promise<CapabilityOutputUnion<TCapabilities>>;
}
```

Current engine run input:

```ts
type EngineRunInput<
  TOutput,
  TContext = Record<string, unknown>,
  TRuntime = Record<string, unknown>,
> = {
  goal: string;
  capability: CapabilityDefinition<TOutput, TContext, TRuntime>;
  context?: TContext;
  runtime?: TRuntime;
  attempt: number;
  trace: ExecutionTrace<TOutput>;
};
```

## Example

```ts
const browserEngine: OperatorEngine<BrowserCapabilities> = {
  async run(input) {
    await input.runtime.page.goto(input.context.url, {
      waitUntil: "domcontentloaded",
    });

    return {
      title: await input.runtime.page.title(),
      url: input.runtime.page.url(),
      sourceURL: input.runtime.page.url(),
    };
  },
};
```

## Notes

:::warning Common confusion
The engine interface describes execution behavior. Runtime objects provide the resources that behavior uses.
:::
