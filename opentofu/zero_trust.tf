################################################################################
# Zero Trust — protect the admin panel + API at the edge (custom domain only).
################################################################################

resource "cloudflare_zero_trust_access_policy" "admin" {
  count = var.zero_trust_domain == "" ? 0 : 1

  account_id = var.cloudflare_account_id
  name       = "dataprofile-admins"
  decision   = "allow"

  include = [
    for e in var.access_allowed_emails : { email = { email = e } }
  ]
}

resource "cloudflare_zero_trust_access_application" "admin" {
  count = var.zero_trust_domain == "" ? 0 : 1

  account_id           = var.cloudflare_account_id
  name                 = "DataProfile Admin"
  domain               = var.zero_trust_domain
  type                 = "self_hosted"
  session_duration     = "24h"
  app_launcher_visible = false

  policies = [{
    id         = cloudflare_zero_trust_access_policy.admin[0].id
    precedence = 1
  }]
}

resource "cloudflare_workers_custom_domain" "profile" {
  count = var.zero_trust_domain == "" ? 0 : 1

  account_id = var.cloudflare_account_id
  hostname   = var.zero_trust_domain
  service    = var.worker_name
  zone_id    = var.zone_id
}
