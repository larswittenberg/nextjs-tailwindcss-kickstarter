# Repository Guidelines

## Project Structure & Module Organization
This Next.js 15 app uses `src/app/[lang]/` for route segments per locale; create new pages as nested folders with `page.tsx` and optional `layout.tsx`. Shared UI lives in `src/components/`, while localized copy is handled via `src/dictionaries/` and helper loaders in `src/get-dictionary.ts`. Global styles come from Tailwind via `src/styles/` and SCSS utilities under `src/scss/`. Static assets belong in `public/`, and MDX helpers reside in the root `mdx-components.tsx`.

## Build, Test, and Development Commands
Run `yarn dev` for the local dev server on port 3000, or `yarn dev-https` when you need an HTTPS tunnel. Use `yarn build` to create an optimized production bundle and `yarn start` to serve it. `yarn lint` runs the ESLint configuration and should be clean before committing, while `yarn format` applies Prettier with the Tailwind plugin. `yarn export` produces a static export after wiping `.next/`.
Use `yarn shadcn` (for example `yarn shadcn add button`) to scaffold UI primitives; the generator writes into `src/components/ui/`, so review and localize output before committing.

## Coding Style & Naming Conventions
The project targets TypeScript with React Server Components, so keep component files as `.tsx` and export functions with PascalCase names. Leverage Tailwind utility classes; the Prettier plugin will sort them automatically—avoid manual reordering. Stick to Prettier defaults (two-space indent, single quotes via ESLint config) and let `src/styles/helpers/` SCSS mixins drive any custom CSS. Keep dictionaries lowercase (for example, `en.json`, `de.json`) and mirror locale keys in `i18n-config.ts`.

## Testing Guidelines
There is no bundled unit test runner yet, so smoke-test features via `yarn dev` and ensure `yarn build` passes. When adding automated coverage, prefer colocating component specs as `ComponentName.spec.tsx` in `src/components/` or creating a `src/tests/` folder. Document any new testing command in `package.json` and update this guide.

## Commit & Pull Request Guidelines
Recent history follows Conventional Commits (`feat:`, `chore:`, `fix:`); keep messages imperative and scoped to one change. Rebase before opening a pull request, describe the feature or fix in plain language, and link related issues. Include notable screenshots or GIFs for UI tweaks and note which commands you ran (`yarn lint`, `yarn build`). Pull requests touching localization should mention updated dictionaries and any new locales added in `i18n-config.ts`.

## Localization & Configuration Tips
Default locale settings live in `src/i18n-config.ts`, and `middleware.ts` handles redirects—update both when introducing a new language. Use `src/dictionaries/<locale>.json` to add copy, and confirm the MDX pipeline supports new content by verifying `mdx-components.tsx`.
