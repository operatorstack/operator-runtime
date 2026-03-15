# Verification

Verification is deterministic acceptance logic.

`operator1` supports two verification layers:

- capability default verification
- run-level verification

Capability default verification is useful for:

- required fields
- schema checks
- basic shape validation

Run-level verification is useful for:

- domain invariants
- task-specific acceptance rules

The operator records both outcomes in the execution trace and marks the result as accepted or rejected.
