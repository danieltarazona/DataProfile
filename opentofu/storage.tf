################################################################################
# D1 — résumé/profile content (multi-language).
#
# ⚠️ Name drift: convention wants "dataprofiled1" but the live DB is
# "datareactprofiled1" (id 1aafe2b0-…). Choose one in AGENTS.md before apply:
#   A) keep legacy: set d1_database_name="datareactprofiled1" then
#      tofu import cloudflare_d1_database.profile <account_id>/1aafe2b0-0b8e-477d-b2b7-21866e8246ae
#   B) migrate to convention: apply (creates dataprofiled1), copy data, repoint wrangler.toml.
################################################################################

resource "cloudflare_d1_database" "profile" {
  account_id = var.cloudflare_account_id
  name       = var.d1_database_name

  # Avoid the provider sending read_replication=null on update (D1 API rejects it).
  read_replication = {
    mode = "auto"
  }
}
