# @sudobility/svgr_types

Shared TypeScript type definitions and response helpers for the SVGR image-to-SVG
conversion platform. This is a **types-only, zero-runtime-dependency** package: it
ships interfaces, string-literal union types, a couple of constant arrays, and two
tiny response-builder functions. It is the foundation layer consumed by every other
`svgr_*` project (API, client, lib, apps).

- **npm name**: `@sudobility/svgr_types` (published to **GitHub Packages**, not the public npm registry)
- **Module format**: ESM only (`"type": "module"`)
- **License**: BUSL-1.1

## Installation

This package is hosted on GitHub Packages under the `@sudobility` scope, so a
consuming project needs an `.npmrc` that points the scope at GitHub Packages and
provides a read token:

```
# .npmrc
@sudobility:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GH_PACKAGES_READ_TOKEN}
```

Then:

```bash
bun add @sudobility/svgr_types
```

`@sudobility/types` is a **peer dependency** (`^1.9.78`) and must be installed by the
consumer.

## Usage

```typescript
import {
  ConvertRequest,
  ConvertResult,
  ConvertResponse,
  successResponse,
  errorResponse,
} from "@sudobility/svgr_types";

// Build a request
const request: ConvertRequest = {
  original: "data:image/png;base64,...", // base64 raster image
  quality: 7,
  imageType: "logo",
};

// The server stores the SVG and returns a cache id, not the SVG itself
const result: ConvertResult = { cacheId: "abc123", width: 500, height: 500 };
const response: ConvertResponse = successResponse(result);

const failure = errorResponse("Invalid image format");
```

## What's exported

### Request / result core

| Export | Kind | Notes |
|--------|------|-------|
| `ConvertRequest` | interface | `original` (base64, required); optional `filename`, `quality` (1-10, default 5), `transparentBg`, `ocr`, `mergePaths`, `smooth` (0-3), `imageType`, `layers` |
| `ConvertResult` | interface | `cacheId`, `width`, `height`, optional `svgSizeBytes`. SVG content is fetched separately via `GET /api/v1/svg/:cacheId` |
| `ConvertResponse` | type alias | `BaseResponse<ConvertResult>` |
| `ImageType` | string union | Preprocessing profile (`auto`, `photo`, `logo`, `line_art`, …) — 35 values |
| `IMAGE_TYPES` | const array | Runtime-usable list of all `ImageType` values |

### Image upload / jobs / history

| Export | Kind | Notes |
|--------|------|-------|
| `ImageUploadResult`, `ImageUploadResponse` | interface / alias | `POST /api/v1/images/upload` |
| `JobStatus` | string union | `pending` \| `processing` \| `done` \| `error` \| `cancelled` |
| `CreateJobRequest`, `JobResult` | interface | Job creation payload and job record |
| `CreateJobResponse`, `JobStatusResponse`, `JobListResponse`, `CancelJobResponse` | type aliases | Job endpoint responses |
| `ImageWithJobs`, `ImageListResponse` | interface / alias | `GET /api/v1/images` (image + its jobs) |

### Consumables / billing

`BalanceResponse`, `PurchaseResponse`, `UseResponse`, `PurchaseHistoryResponse`,
`UsageHistoryResponse`, `WebhookResult`, `WebhookResponse`, `AckResult`,
`AckResponse` — response envelopes for the `/consumables/*` endpoints and the
RevenueCat webhook.

### Community / health

`COMMUNITY_PLATFORMS`, `CommunityPlatform`, `Community`, `CommunitiesResponse`,
`HealthResult`, `HealthResponse`.

### Response helpers

- `successResponse<T>(data)` — wrap any data in `{ success: true, data, timestamp }`
- `errorResponse(error)` — build `{ success: false, error, timestamp }`

### Re-exports from `@sudobility/types`

`ApiResponse<T>`, `BaseResponse`, `ConsumableBalanceResponse`,
`ConsumableUseResponse`, `ConsumablePurchaseRecord`, `ConsumableUsageRecord`.

## Development

Bun is the package manager and runner (do not use npm/yarn/pnpm to install).

```bash
bun install            # install deps (requires GitHub Packages auth, see above)
bun run build          # compile ESM + .d.ts into dist/ (tsc -p tsconfig.esm.json)
bun run clean          # remove dist/
bun run dev            # tsc --watch
bun run typecheck      # tsc --noEmit
bun run lint           # eslint src --ext .ts
bun run lint:fix       # eslint --fix
bun run format         # prettier --write
bun run test:unit      # vitest run (one-shot)
bun run test:watch     # vitest watch
bun run test:coverage  # vitest --coverage
bun run verify         # typecheck + lint + test:unit + build (run before publishing)
```

Note: there is no `test` script, so use `bun run test:unit` (plain `bun test` would
invoke Bun's own test runner, not Vitest). Tests live in `src/index.test.ts` and
include both runtime assertions and type-level checks via Vitest's `expectTypeOf`.

## Architecture

```
@sudobility/types                          (upstream, peer dependency)
        |
@sudobility/svgr_types  (this package — foundation layer)
        |
svgr_client · svgr_lib · svgr_api · svgr_app · svgr_app_rn
```

Every SVGR project depends on this package, directly or transitively, so any change
to an exported type is a change to the cross-project API contract. Breaking changes
require coordinated updates across all consumers.

## Related Packages

- `svgr_api` — backend API server
- `svgr_client` — API client SDK
- `svgr_lib` — shared business logic
- `svgr_app` — web app
- `svgr_app_rn` — React Native app

## License

BUSL-1.1
