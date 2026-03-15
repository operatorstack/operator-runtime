# Capabilities

A capability is a bounded task domain.

It is not a browser method and not a low-level action.

Good examples:

- `automation.extract_invoice`
- `automation.capture_session`
- `automation.retrieve_policy_quote`

Bad examples:

- `browser.click`
- `browser.goto`
- `page.locator`

Capabilities give the operator semantic meaning for the run.

They can also define default verification for result shape and required fields.
