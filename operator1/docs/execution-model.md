# Execution model

The execution flow is:

```text
operator
  -> engine
  -> runtime
  -> environment
  -> verification
  -> result
```

In `operator1`, the operator:

1. receives a `goal`
2. looks up the selected `capability`
3. passes `context` and `runtime` into `engine.run(...)`
4. evaluates capability-level verification
5. evaluates run-level verification
6. returns `result` and `trace`

The initial scaffold keeps this minimal:

- one execution attempt
- no retry loop
- explicit acceptance or rejection in the trace
