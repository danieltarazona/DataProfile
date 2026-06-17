# DataProfile — OpenTofu Infrastructure

Multi-language résumé / profile builder: a Cloudflare Worker + admin SPA backed
by D1.

## Resources

| Resource | Type | Name |
| --- | --- | --- |
| _Worker `dataprofile`_ | _deployed by wrangler_ | _not an OpenTofu resource_ |
| `cloudflare_d1_database.profile` | D1 | `dataprofiled1` (convention) |
| `cloudflare_zero_trust_access_application.admin` | Access app | admin panel (custom domain only) |
| `cloudflare_zero_trust_access_policy.admin` | Access policy | allow listed admin emails |
| `cloudflare_workers_custom_domain.profile` | Custom domain | enables edge Access |

## Bindings (mirror `wrangler.toml`)

- `DB` → D1
- `DATAKITNPMREGISTRY` → service binding to the registry (runtime path)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` → encrypted `secret_text`
- `CF_ACCESS_AUD` → added when edge Access is enabled
- `ASSETS` → managed by `wrangler deploy`

## ⚠️ D1 name drift (decide before apply)

The convention is `dataprofiled1`, but the live database is **`datareactprofiled1`**
(id `1aafe2b0-0b8e-477d-b2b7-21866e8246ae`). Pick one:

- **Option A — keep data in place (recommended):** set
  `d1_database_name = "datareactprofiled1"` in `terraform.tfvars`, then
  ```zsh
  tofu import cloudflare_d1_database.profile "$TF_VAR_cloudflare_account_id/1aafe2b0-0b8e-477d-b2b7-21866e8246ae"
  ```
  No data movement; the name simply stays legacy.
- **Option B — rename to convention:** `tofu apply` creates a fresh
  `dataprofiled1`, then migrate:
  ```zsh
  cd .. && npx wrangler d1 export datareactprofiled1 --remote --output=/tmp/p.sql
  npx wrangler d1 execute dataprofiled1 --remote --file=/tmp/p.sql
  ```
  Repoint `wrangler.toml` to the new id and retire the legacy DB.

## Registry integration

Runtime via the `DATAKITNPMREGISTRY` service binding. Build-time `prebuild`
runs `registry:prefetch` (`@datakit/react-core`) and needs the registry service
token (`DataKitNPMRegistry/opentofu → registry_service_tokens["dataprofile"]`).

## Deploy

```zsh
cd DataProfile/opentofu && tofu init && tofu apply
cd .. && pnpm run deploy
```
