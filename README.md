![Dots.eco logo](https://raw.githubusercontent.com/dots-eco/n8n-dots-eco/main/nodes/DotsEco/Dots_eco_logo.svg)

# Dots.eco n8n Nodes

This package is the first-party n8n integration for the documented public Dots.eco API.

## Installation

Use the package as an n8n community node:

- In self-hosted n8n, open **Settings > Community Nodes** and install `@dotseco/n8n-nodes-dots-eco`
- For local development, install dependencies with `pnpm install`

## Scope

The node currently covers the documented public endpoints for:

- Applications
- Allocations
- Certificates
- Eco Club offerings
- Flow cards
- Impact summaries
- Notification subscriptions
- Supported languages and currencies

## Credentials

The `Dots.eco API` credential includes:

- `baseUrl`
- `readAuthToken`
- `writeAuthToken`

The node routes tokens automatically by operation:

- read token for read endpoints
- write token for write endpoints

The package does not expose a sandbox or production toggle. Environment stays implicit in the base URL, app token, and auth tokens you provide.
The credential "test connection" check only verifies reachability of the base URL through a documented public endpoint. Read and write token validity is exercised by the first authenticated node operation you run.

Authentication notes:

- `Base URL`: production API base URL, usually `https://impact.dots.eco/api/v1`
- `Read Auth Token`: used for read operations such as listing allocations or reading certificate data
- `Write Auth Token`: used for create operations such as creating applications, certificates, flow cards, and notification subscriptions

## Editor Conveniences

The node keeps the existing request shape while adding a few editor-side conveniences:

- supported languages and currencies load directly from Dots.eco selectors
- certificate allocation IDs can still be entered manually, or looked up by company
- Eco Club allocation limits can still be entered as CSV, or selected from a lookup

Manual entry remains available for compatibility, expressions, and existing workflows.

## Usage

### Example: list allocations for a company

1. Create `Dots.eco API` credentials with your base URL and read token.
2. Add the `Dots.eco` node.
3. Select `Allocation` as the resource and `List` as the operation.
4. Enter the numeric `Company ID`.
5. Optionally set `Language` to localize allocation labels returned by Dots.eco.

### Example: create a certificate

1. Create `Dots.eco API` credentials with your base URL and write token.
2. Add the `Dots.eco` node.
3. Select `Certificate` as the resource and `Create` as the operation.
4. Fill in `App Token`, `External Unique ID`, `Impact Quantity`, `Allocation ID`, and `Remote User ID`.
5. Optionally use allocation lookup mode to load allocations by company instead of entering the allocation ID manually.

### Example workflow

This package is designed for normal n8n workflows. A minimal flow to create a certificate after receiving order data looks like this:

`Manual Trigger` -> `Set` or `Webhook` -> `Dots.eco` (`Certificate` / `Create`) -> next business step

## Development

Install dependencies and build the package:

```bash
pnpm install
pnpm build
```

Run package checks:

```bash
pnpm lint
pnpm test
```

## Validation

This package intentionally keeps only lightweight unit coverage in `tests/unit`.

## Release and Submission

- The package has no runtime dependencies, which is required for n8n verification
- The repository includes a GitHub Actions publish workflow that uses npm provenance, which n8n requires for Creator Portal submissions from May 1, 2026 onward
- Before submitting a new version, publish that version to npm from GitHub Actions so the npm metadata, repository link, and provenance statement all match the repository state

## References

- Dots.eco API docs: <https://docs.impact.dots.eco>

## License

MIT
