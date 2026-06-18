output "worker_name" {
  description = "Worker script name (deployed by wrangler, not OpenTofu)."
  value       = var.worker_name
}

output "d1_database_id" {
  value = cloudflare_d1_database.profile.id
}

output "access_application_aud" {
  description = "AUD of the admin Access app (empty until zero_trust_domain is set)."
  value       = one(cloudflare_zero_trust_access_application.admin[*].aud)
}
