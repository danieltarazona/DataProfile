# DataKit - Project Rules (Gemini/Antigravity)

## Environment
- OS: Windows (Client) / WSL Ubuntu (Worker)
- Workspace Path: `/Users/data/Projects/DataJS/DataProfile` (Mac) / `/home/data/Projects/DataKitReact/DataReactProfile` (WSL)
- Command Tooling: `pnpm`
- Database: Cloudflare D1 (Local & Remote)

## Operational Rules
1. **WSL Standard**: Always execute commands using `/Ubuntu/...` or relative paths in WSL if the agent has a shell bash.
2. **Permission Denied (Vitest)**: If `pnpm test` fails with "vitest: Permission denied", run:
   `chmod +x node_modules/.bin/vitest`
3. **D1 Setup**: Always ensure `pnpm run db:ensure` is run before `dev` to avoid "missing table" errors.
4. **Workflows**: Favor using the workflows in `.agent/workflows/` for common tasks:
   - `/dev`
   - `/test`
   - `/db-ensure`

## Code Standards
- **Localization**: Use `api.getLocalizedField(entry, field, lang)` for all UI strings in Home/Preview.
- **Roles**: All items default to 'all' role. Use `isVisibleForRole(item, activeRoleId)` helper from `../utils/cvMapping`.
- **UI Styling**: Tailwind CSS with custom `card-editor` and `input-field-compact` classes.
