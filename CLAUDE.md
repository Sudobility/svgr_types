# SVGR Types

> **Git policy — never auto-commit or auto-push.** Leave your work in the working tree.
> Run `git commit`, `git push`, `gh pr create`, or `scripts/push_all.sh` **only when the user
> explicitly asks in that turn**. Approval for an earlier change does not carry forward, and
> finishing a task is not permission to commit it.

Shared TypeScript type definitions and response helpers for the SVGR image-to-SVG
API contract. Types-only package with zero runtime dependencies (beyond the
`@sudobility/types` peer dep). Published to **GitHub Packages** as
`@sudobility/svgr_types`.

## Tech Stack

- **Language**: TypeScript (strict mode), `target`/`lib` ES2020, `moduleResolution: bundler`
- **Runtime / package manager**: Bun (do not use npm/yarn/pnpm to install deps)
- **Build**: `tsc -p tsconfig.esm.json` → **ESM only** (`.js` + `.d.ts` + maps into `dist/`). Package is `"type": "module"`; `exports` only define `import`/`types`. There is NO CJS output.
- **Test**: Vitest (runtime + type-level tests via `expectTypeOf`)
- **Lint/format**: ESLint (flat config `eslint.config.js`) + Prettier

## Project Structure

```
src/
├── index.ts        # ALL types, interfaces, const arrays, and the two helper functions
└── index.test.ts   # Tests (runtime + type-level)
```

Everything lives in `src/index.ts` — there is no multi-file module layout.

## Commands

```bash
bun run build          # ESM build into dist/
bun run clean          # rimraf dist
bun run dev            # tsc --watch
bun run typecheck      # tsc --noEmit
bun run lint           # eslint src --ext .ts
bun run test:unit      # vitest run (one-shot)  <-- use this, NOT `bun test`
bun run test:watch     # vitest watch
bun run verify         # typecheck + lint + test:unit + build (run before publishing)
```

- There is **no `test` script**. `bun test` invokes Bun's own runner, not Vitest — always `bun run test:unit`.
- `bun install` needs GitHub Packages auth (`.npmrc` sets `@sudobility:registry=https://npm.pkg.github.com`; token env `GH_PACKAGES_READ_TOKEN`). Without it, deps won't install and the binaries (`tsc`, `vitest`, `eslint`) won't exist.

## Key Exports (see src/index.ts for the full set)

- **Convert**: `ConvertRequest`, `ConvertResult`, `ConvertResponse`, `ImageType`, `IMAGE_TYPES`
- **Upload/Jobs/History**: `ImageUploadResult`/`ImageUploadResponse`, `JobStatus`, `CreateJobRequest`, `JobResult`, `CreateJobResponse`/`JobStatusResponse`/`JobListResponse`/`CancelJobResponse`, `ImageWithJobs`, `ImageListResponse`
- **Consumables/billing**: `BalanceResponse`, `PurchaseResponse`, `UseResponse`, `PurchaseHistoryResponse`, `UsageHistoryResponse`, `WebhookResult`/`WebhookResponse`, `AckResult`/`AckResponse`
- **Community/health**: `COMMUNITY_PLATFORMS`, `CommunityPlatform`, `Community`, `CommunitiesResponse`, `HealthResult`, `HealthResponse`
- **Helpers**: `successResponse<T>(data)`, `errorResponse(error)`
- **Re-exports from `@sudobility/types`**: `ApiResponse`, `BaseResponse`, `ConsumableBalanceResponse`, `ConsumableUseResponse`, `ConsumablePurchaseRecord`, `ConsumableUsageRecord`

## Architecture

```
@sudobility/types  (peer dep)
      |
svgr_types (this package) — foundation layer
      |
svgr_client · svgr_lib · svgr_api · svgr_app · svgr_app_rn
```

Consumed (directly or transitively) by all `svgr_*` projects. Every exported type is
part of the cross-project API contract.

## Conventions & Gotchas

- **`ConvertResult` returns `cacheId`, NOT the SVG string.** The server stores the SVG and the client fetches it separately via `GET /api/v1/svg/:cacheId`. Do not add an `svg` field.
- **Response envelope is `BaseResponse<T>`** from `@sudobility/types`: `{ success, data?, error?, timestamp }`. Wrap results with `successResponse`/`errorResponse` rather than building objects by hand.
- **`quality` is 1-10** (default 5); **`smooth` is 0-3** (default 0). Do not use 0-100 or 0-1 scales.
- When adding an `ImageType` literal, also add it to the `IMAGE_TYPES` const array (they must stay in sync). Same pattern for `CommunityPlatform` / `COMMUNITY_PLATFORMS`.
- **Any change here affects all consumers.** Breaking changes require coordinated updates across every `svgr_*` repo.
- `exactOptionalPropertyTypes` may be on in some consumers — be careful with optional fields.
- When adding types with helper functions, add corresponding tests (runtime and/or `expectTypeOf`) in `src/index.test.ts`.
- Peer dependency: `@sudobility/types ^1.9.78`.

## Git Workflow

- Do not use feature branches for code changes. Stay on the current branch.
