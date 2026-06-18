# DataProfile — Pulumi Infrastructure

Durable Cloudflare infra for DataProfile, as a **Pulumi (TypeScript)** program
(replaced OpenTofu; `*.tf` kept as legacy reference). The Worker script + its
bindings (D1, registry service binding, admin secrets) stay owned by
`../wrangler.toml`.

## Resources (`index.ts`)

| Pulumi logical name | Type | When |
| --- | --- | --- |
| `database` | `D1Database` (`datareactprofiled1`) | always |
| `admin-policy` | `ZeroTrustAccessPolicy` (`allow`, email includes) | only if `zeroTrustDomain` set |
| `admin-app` | `ZeroTrustAccessApplication` (`self_hosted`) | only if `zeroTrustDomain` set |
| `admin-domain` | `WorkersCustomDomain` | only if `zeroTrustDomain` set |

> **D1 name:** `datareactprofiled1` is the LIVE name (predates the `<project>d1`
> convention). It is intentionally kept so `pulumi import` adopts the existing
> database. Migrating to `dataprofiled1` is a separate data-migration task.

## Setup (adopt the existing D1, then converge)

```zsh
cd DataProfile/cloudflare && pnpm install
pulumi login --local && export PULUMI_CONFIG_PASSPHRASE='…'
pulumi stack init prod
# export CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID from KeePassXC
sed "s/ACCOUNT_ID_HERE/$CLOUDFLARE_ACCOUNT_ID/g" import.json.example > import.json
pulumi import -f import.json --yes && rm import.json   # adopt live D1
pulumi preview   # expect no create/replace for the D1
pulumi up
```

## Enable edge Zero Trust over the admin panel

```zsh
pulumi config set --path 'accessAllowedEmails[0]' you@example.com   # at least one
pulumi config set zeroTrustDomain profile.danieltarazona.com
pulumi config set zoneId <zone_id>
pulumi up   # creates policy + app + custom domain
```

Outputs: `d1DatabaseId`, `accessApplicationAud`, `customDomainHostname`.
Credentials: `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` from KeePassXC, never committed.
