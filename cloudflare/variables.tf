variable "cloudflare_api_token" {
  description = "Cloudflare API token. KeePassXC: Cloudflare_API/api_token."
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account id. KeePassXC: Cloudflare_API/account_id."
  type        = string
  sensitive   = true
}

variable "worker_name" {
  description = "Worker script name (matches wrangler.toml)."
  type        = string
  default     = "dataprofile"
}

variable "d1_database_name" {
  description = <<-EOT
    D1 name. Convention is <project>d1 = "dataprofiled1". The live database is
    still named "datareactprofiled1" (id 1aafe2b0-…). See AGENTS.md for the two
    adoption paths (keep legacy name vs. migrate to convention).
  EOT
  type        = string
  default     = "dataprofiled1"
}

variable "legacy_d1_database_id" {
  description = "Existing D1 id from wrangler.toml (live name: datareactprofiled1)."
  type        = string
  default     = "1aafe2b0-0b8e-477d-b2b7-21866e8246ae"
}

variable "registry_worker_name" {
  description = "NPM registry Worker bound as a service."
  type        = string
  default     = "datakitnpmregistry"
}

# Admin secrets (ADMIN_EMAIL / ADMIN_PASSWORD) are Worker secrets owned by
# wrangler, not OpenTofu. Set them with `wrangler secret put ADMIN_EMAIL` /
# `wrangler secret put ADMIN_PASSWORD` (hash via `deno run ../scripts/hash_password.ts`).

variable "zero_trust_domain" {
  description = "Custom domain in your zone for edge Access. Leave \"\" to skip (Access cannot protect *.workers.dev)."
  type        = string
  default     = ""
}

variable "zone_id" {
  description = "Zone id for zero_trust_domain."
  type        = string
  default     = ""
}

variable "access_allowed_emails" {
  description = "Emails allowed through Cloudflare Access to the admin panel."
  type        = list(string)
  default     = []
}
