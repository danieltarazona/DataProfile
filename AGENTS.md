# AGENTS.md — Agent & Developer Guide for data-next-gen-profile

Welcome! This guide provides necessary architectural context, development commands, coding standards, and operational guidelines for both AI agents and human developers working on data-next-gen-profile.

---

## Project Overview

* **Purpose**: A Cloudflare Workers (Hono) + React (Vite) app for CV data management, offering multi-role and trilingual support.
* **Core Technologies**: Node.js, TypeScript
* **High-Level relationships**: [Describe how main layers/components relate to each other]

## Architecture

* **Pattern**: Cloudflare Worker + D1 (SQLite) + React frontend with XState.
* **Design Principles**: State machines (XState), trilingual support, D1 SQLite database, PDF generation.

## Repository Layout

Below is the high-level layout of the repository:

* [.agent/](file:///Users/data/Projects/DataKitJS/DataReactProfile/.agent) - [Directory] Project subdirectory containing source code or assets.
* [.dev.vars](file:///Users/data/Projects/DataKitJS/DataReactProfile/.dev.vars) - [File] Project configuration or source file.
* [.dev.vars.example](file:///Users/data/Projects/DataKitJS/DataReactProfile/.dev.vars.example) - [File] Project configuration or source file.
* [.gemini/](file:///Users/data/Projects/DataKitJS/DataReactProfile/.gemini) - [Directory] Project subdirectory containing source code or assets.
* [.gitattributes](file:///Users/data/Projects/DataKitJS/DataReactProfile/.gitattributes) - [File] Project configuration or source file.
* [.gitignore](file:///Users/data/Projects/DataKitJS/DataReactProfile/.gitignore) - [File] Git ignore file lists directories/files to exclude from version control.
* [.node-version](file:///Users/data/Projects/DataKitJS/DataReactProfile/.node-version) - [File] Project configuration or source file.
* [.npmrc](file:///Users/data/Projects/DataKitJS/DataReactProfile/.npmrc) - [File] Project configuration or source file.
* [.wrangler/](file:///Users/data/Projects/DataKitJS/DataReactProfile/.wrangler) - [Directory] Project subdirectory containing source code or assets.
* [README.md](file:///Users/data/Projects/DataKitJS/DataReactProfile/README.md) - [File] General project overview and human-developer documentation.
* [build_test.sh](file:///Users/data/Projects/DataKitJS/DataReactProfile/build_test.sh) - [File] Project configuration or source file.
* [cv_text.txt](file:///Users/data/Projects/DataKitJS/DataReactProfile/cv_text.txt) - [File] Project configuration or source file.
* [eslint.config.mjs](file:///Users/data/Projects/DataKitJS/DataReactProfile/eslint.config.mjs) - [File] Project configuration or source file.
* [extract.sh](file:///Users/data/Projects/DataKitJS/DataReactProfile/extract.sh) - [File] Project configuration or source file.
* [index.html](file:///Users/data/Projects/DataKitJS/DataReactProfile/index.html) - [File] Project configuration or source file.
* [libs/](file:///Users/data/Projects/DataKitJS/DataReactProfile/libs) - [Directory] Project subdirectory containing source code or assets.
* [migration.sql](file:///Users/data/Projects/DataKitJS/DataReactProfile/migration.sql) - [File] Project configuration or source file.
* [package.json](file:///Users/data/Projects/DataKitJS/DataReactProfile/package.json) - [File] Project dependencies and npm/pnpm script definitions.
* [pnpm-lock.yaml](file:///Users/data/Projects/DataKitJS/DataReactProfile/pnpm-lock.yaml) - [File] Locked version requirements for node dependencies.
* [pnpm-workspace.yaml](file:///Users/data/Projects/DataKitJS/DataReactProfile/pnpm-workspace.yaml) - [File] Project configuration or source file.
* [postcss.config.mjs](file:///Users/data/Projects/DataKitJS/DataReactProfile/postcss.config.mjs) - [File] Project configuration or source file.
* [public/](file:///Users/data/Projects/DataKitJS/DataReactProfile/public) - [Directory] Project subdirectory containing source code or assets.
* [rebuild_core.sh](file:///Users/data/Projects/DataKitJS/DataReactProfile/rebuild_core.sh) - [File] Project configuration or source file.
* [run_dev.sh](file:///Users/data/Projects/DataKitJS/DataReactProfile/run_dev.sh) - [File] Project configuration or source file.
* [scripts/](file:///Users/data/Projects/DataKitJS/DataReactProfile/scripts) - [Directory] Project subdirectory containing source code or assets.
* [setup_wsl.sh](file:///Users/data/Projects/DataKitJS/DataReactProfile/setup_wsl.sh) - [File] Project configuration or source file.
* [src/](file:///Users/data/Projects/DataKitJS/DataReactProfile/src) - [Directory] Project subdirectory containing source code or assets.
* [temp_setup.sh](file:///Users/data/Projects/DataKitJS/DataReactProfile/temp_setup.sh) - [File] Project configuration or source file.
* [test_login.sh](file:///Users/data/Projects/DataKitJS/DataReactProfile/test_login.sh) - [File] Project configuration or source file.
* [tmp_query.sql](file:///Users/data/Projects/DataKitJS/DataReactProfile/tmp_query.sql) - [File] Project configuration or source file.
* [tsconfig.json](file:///Users/data/Projects/DataKitJS/DataReactProfile/tsconfig.json) - [File] TypeScript compiler configuration.
* [tsconfig.node.json](file:///Users/data/Projects/DataKitJS/DataReactProfile/tsconfig.node.json) - [File] Project configuration or source file.
* [vite.config.ts](file:///Users/data/Projects/DataKitJS/DataReactProfile/vite.config.ts) - [File] Vite bundler and dev-server configuration.
* [wrangler.toml](file:///Users/data/Projects/DataKitJS/DataReactProfile/wrangler.toml) - [File] Cloudflare Wrangler configuration for deployment.

## Development Commands

Use the following commands during development:

* **Build**: `pnpm run build`
* **Run Locally**: `pnpm run dev`
* **Linting**: `None configured`
* **Formatting**: `None configured`

## Testing Strategy

* **Execution**: `pnpm test`
* **Framework**: Vitest
* **Structure**: Next to implementation files

## Deployment Process

* **Pipelines**:
* Local and manual deploy workflows via npm scripts / wrangler.
* **Deployment Step**: Deployed to Cloudflare Workers/D1 using wrangler deploy.

## Coding Standards

* **Conventions**: [e.g., Use TypeScript strict-mode, prefer functional programming, write inline JSDoc, follow PEP 8]
* **Error-Handling**: [e.g., Do not throw generic Errors; use custom DomainError classes; use try/catch blocks only at boundaries]
* **Documentation**: [e.g., Keep README up-to-date, document all public interfaces, include example code blocks in docstrings]

## Tooling

Here are the configuration files managing tools and styles in the repository:

* [tsconfig.json](file:///Users/data/Projects/DataKitJS/DataReactProfile/tsconfig.json): TypeScript compiler configuration
* [vite.config.ts](file:///Users/data/Projects/DataKitJS/DataReactProfile/vite.config.ts): Vite dev server and bundler configuration

## Agent Operating Instructions

Agents must follow these rules when editing the repository:
1. **Understand Layout**: Prior to making changes, inspect the files in [Repository Layout](#repository-layout).
2. **Review Configs**: Review dependency files (e.g. `package.json`, `Cargo.toml`) to avoid duplication.
3. **Run Checks**: Always run formatting, linting, and tests after making modifications.
4. **Preserve Comments**: Maintain all existing codebase documentation and comment conventions.
5. **Report Outcomes**: Provide exact commands run and execution logs in your final summaries.

## Contribution Workflow

1. **Branching**: Create feature branches off the main branch (e.g., `feature/add-agents-md`).
2. **Commits**: Follow conventional commit formats (e.g., `feat: add agents-md skill`, `fix: resolve compile error`).
3. **Pull Requests**: Ensure all lint checks and test suites pass locally before submitting a PR.

## Troubleshooting

* **Build Issues**: [Explain typical resolution for build failures, e.g. clean build cache, run clean dependency install]
* **Common Errors**: [List typical errors developer/agents might hit and how to fix them]

## Repository-Specific Knowledge

* **Frequently Modified Areas**: [Identify files/folders that change often]
* **Known Limitations**: [List any design bottlenecks or known technical debt]
* **Architectural Decisions**: [Highlight historic decisions or architectural compromises that shape development]