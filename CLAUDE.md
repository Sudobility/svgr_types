# SVGR Types

> **Git policy — never auto-commit or auto-push.** Leave your work in the working tree.
> Run `git commit`, `git push`, `gh pr create`, or `scripts/push_all.sh` **only when the user
> explicitly asks in that turn**. Approval for an earlier change does not carry forward, and
> finishing a task is not permission to commit it.

Shared type definitions for the SVGR API contract.

**npm**: `@sudobility/svgr_types` (public)

## Tech Stack

- **Language**: TypeScript (strict mode)
- **Runtime**: Bun
- **Package Manager**: Bun (do not use npm/yarn/pnpm for installing dependencies)
- **Build**: TypeScript compiler (dual ESM/CJS with .cjs rename)
- **Test**: Vitest

## Project Structure

```
src/
├── index.ts           # All types, interfaces, and helper functions
└── index.test.ts      # Tests
```

## Commands

```bash
bun run build        # Dual CJS + ESM build
bun run clean        # Remove dist/
bun run dev          # Watch mode
bun test             # Run tests
bun run lint         # Run ESLint
bun run typecheck    # TypeScript check
bun run verify       # All checks + build (use before commit)
```

## Key Exports

### Types & Interfaces

- `ConvertRequest` -- input payload for SVG conversion
- `ConvertResult` -- conversion output (SVG string, metadata)
- `ConvertResponse` -- full API response wrapping ConvertResult

### Helper Functions

- `successResponse(result)` -- wrap a ConvertResult into a success ConvertResponse
- `errorResponse(message)` -- create an error ConvertResponse

### Re-exports from @sudobility/types

- `ApiResponse<T>` -- generic API response envelope
- `BaseResponse` -- base response interface

## Peer Dependencies

- `@sudobility/types` ^1.9.51

## Architecture

```
@sudobility/types
    ^
    |
svgr_types (this package) -- foundation layer
    ^
    |
svgr_client, svgr_lib, svgr_api, svgr_app, svgr_app_rn
```

This is the foundation layer -- consumed by all other SVGR projects.

## Related Projects

- **svgr_api** (`/Users/johnhuang/projects/svgr_api`) -- Backend API server; imports types from this package
- **svgr_client** (`/Users/johnhuang/projects/svgr_client`) -- API client SDK; imports types from this package
- **svgr_lib** (`/Users/johnhuang/projects/svgr_lib`) -- Shared business logic; imports types from this package
- **svgr_app** (`/Users/johnhuang/projects/svgr_app`) -- Web app; indirect consumer via svgr_client and svgr_lib
- **svgr_app_rn** (`/Users/johnhuang/projects/svgr_app_rn`) -- React Native app; indirect consumer via svgr_client and svgr_lib
- **@sudobility/types** -- Upstream dependency providing `ApiResponse<T>` and `BaseResponse`

This package is the foundation for all `svgr_*` projects.

## Coding Patterns

- Pure types and response helper functions only -- no runtime dependencies beyond `@sudobility/types`
- Dual CJS/ESM output: build produces both `.js` (ESM) and `.cjs` (CommonJS) files
- `ConvertRequest` fields: `original` (base64 image data), `filename`, `quality` (1-10), `transparentBg` (boolean)
- `ConvertResult` fields: `svg` (SVG string), `width`, `height`
- Use `successResponse()` and `errorResponse()` helpers to wrap results in the standard `ConvertResponse` envelope
- Keep exports minimal and focused -- every export becomes part of the public API contract

## Gotchas

- **Changes here affect all consumers** -- svgr_api, svgr_client, svgr_lib, svgr_app, and svgr_app_rn all depend on this package. Any breaking change requires coordinated updates across all projects.
- **Build both ESM and CJS outputs** -- consumers include both Node/Bun (ESM) and bundled apps that may need CJS. Always run `bun run build` and verify both outputs.
- **Quality range is 1-10** with a default of 5. Do not use 0-100 or 0-1 scales.
- **`exactOptionalPropertyTypes`** may be enabled in some consumers -- be careful with optional fields (use `field?: T | undefined` pattern if needed).
- Run `bun run verify` before committing to catch issues across lint, typecheck, tests, and build.

## Testing Notes

- Tests are in `src/index.test.ts`
- Test the helper functions (`successResponse`, `errorResponse`) and type guards
- When adding new types, add corresponding tests for any associated helper functions

## Git Workflow

- Do not use feature branches for code changes. Always stay on the current branch.
