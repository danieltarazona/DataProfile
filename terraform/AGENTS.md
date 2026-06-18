# DataProfile — Terraform / OpenTofu Infrastructure

This is the **Terraform/OpenTofu** version of DataProfile's durable Cloudflare
infrastructure. The equivalent **Pulumi (TypeScript)** version is in `../pulumi/`
— both manage the **same** resources. Use one *or* the other, not both at once.

The Worker/Pages compute and its bindings stay owned by `../wrangler.toml`
(`wrangler deploy`). This directory owns the durable infra around it (D1 / R2 /
KV / Pages config / Zero Trust Access), as declared in the `*.tf` files.

## Credentials (KeePassXC — never committed)

```zsh
read -s -p 'KeePass Password: ' KPPASS < /dev/tty && echo
export TF_VAR_cloudflare_api_token=$(echo $KPPASS | keepassxc-cli show -s -a api_token  "$KEEPASSXC_PASSWORDS" 'Cloudflare_API')
export TF_VAR_cloudflare_account_id=$(echo $KPPASS | keepassxc-cli show -s -a account_id "$KEEPASSXC_PASSWORDS" 'Cloudflare_API')
unset KPPASS
```

## Workflow

```zsh
tofu init
# Adopt pre-existing live resources BEFORE apply (resource ids: see the .tf
# comments and ../pulumi/import.json.example). Example:
#   tofu import cloudflare_d1_database.<name> "$TF_VAR_cloudflare_account_id/<db_id>"
#   tofu import cloudflare_r2_bucket.<name>   "$TF_VAR_cloudflare_account_id/<bucket>/default"
tofu plan
tofu apply
```

## Files

- `outputs.tf`
- `providers.tf`
- `storage.tf`
- `variables.tf`
- `versions.tf`
- `zero_trust.tf`

> Parity: `../pulumi/` does exactly the same with Pulumi + helper scripts
> (`pnpm run cf:up` / `cf:verify` / `cf:audit`). This folder is the Terraform path.
