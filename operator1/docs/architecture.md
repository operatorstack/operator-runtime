# Architecture

`operator1` sits at the operator layer.

It does not implement a browser runtime. It does not pretend a full LLM runtime exists.

Its job is to coordinate execution:

- receive a goal
- select a capability
- pass context and runtime into an engine
- apply verification
- return a result and a trace

Mental model:

```text
Operator
  ↓
Engine
  ↓
Runtime
  ↓
Environment
  ↓
Verification
  ↓
Result + Trace
```

Key boundaries:

- capability is the task domain
- engine performs execution
- runtime holds resources and state
- verification decides acceptance
