#!/usr/bin/env zsh
###############################################################################
# cf-audit.zsh — Vuelca la configuración VIVA de Cloudflare a HCL con
# cf-terraforming, para auditarla / diffearla. Genérico por proyecto.
#
# cf-terraforming es de ámbito CUENTA/ZONA (no "por proyecto"): los recursos de
# cuenta (workers, pages, r2, kv, Access) se vuelcan completos; los de zona
# (DNS, rulesets/redirecciones, settings) salen por zona. El volcado se guarda
# en cloudflare/audit/<fecha>/ y se resalta lo que menciona a este proyecto.
#
# Requiere: cf-terraforming (brew install cf-terraforming) + CLOUDFLARE_API_TOKEN
# y CLOUDFLARE_ACCOUNT_ID (o KeePassXC). La zona se lee de Pulumi.prod.yaml.
#
# Uso:  zsh ./cf-audit.zsh
###############################################################################

set -e
setopt pipe_fail 2>/dev/null || true
cd "${0:A:h}"
API="https://api.cloudflare.com/client/v4"

log()  { print -P "%F{cyan}▸%f $*"; }
ok()   { print -P "%F{green}✔%f $*"; }
warn() { print -P "%F{yellow}⚠%f $*"; }
die()  { print -P "%F{red}✗ $*%f" >&2; exit 1; }

# cf-terraforming (brew lo deja en /opt/homebrew/bin)
command -v cf-terraforming >/dev/null 2>&1 || export PATH="/opt/homebrew/bin:$PATH"
command -v cf-terraforming >/dev/null 2>&1 || die "cf-terraforming no instalado:  brew install cf-terraforming"

# credenciales
if [[ -z "${CLOUDFLARE_API_TOKEN:-}" || -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]]; then
  [[ -n "${KEEPASSXC_PASSWORDS:-}" ]] || die "Exporta CLOUDFLARE_API_TOKEN y CLOUDFLARE_ACCOUNT_ID (o define KEEPASSXC_PASSWORDS)."
  read -s "kp?KeePass Password: " < /dev/tty; echo
  export CLOUDFLARE_API_TOKEN=$(echo "$kp" | keepassxc-cli show -s -a api_token  "$KEEPASSXC_PASSWORDS" 'Cloudflare_API')
  export CLOUDFLARE_ACCOUNT_ID=$(echo "$kp" | keepassxc-cli show -s -a account_id "$KEEPASSXC_PASSWORDS" 'Cloudflare_API')
  unset kp
fi
[[ -n "${CLOUDFLARE_API_TOKEN:-}" && -n "${CLOUDFLARE_ACCOUNT_ID:-}" ]] || die "Faltan credenciales."

# zona y nombre de proyecto desde Pulumi.prod.yaml (sin necesitar passphrase)
yaml_val() { grep -E ":$1:" Pulumi.prod.yaml 2>/dev/null | head -1 | sed -E "s/.*:$1:[[:space:]]*//" | tr -d '"'\' ; }
ZONE="$(yaml_val zoneId)"
PROJ="$(basename ${0:A:h:h})"

TS="$(date +%Y%m%d-%H%M%S)"
OUT="audit/$TS"
mkdir -p "$OUT"
print -P "%F{magenta}== cf-audit :: $PROJ → $OUT ==%f"

# recursos de ámbito CUENTA
ACCOUNT_TYPES=(
  cloudflare_workers_script
  cloudflare_workers_custom_domain
  cloudflare_r2_bucket
  cloudflare_workers_kv_namespace
  cloudflare_pages_project
  cloudflare_zero_trust_access_application
  cloudflare_zero_trust_access_policy
)
# recursos de ámbito ZONA (sólo si hay zoneId)
ZONE_TYPES=(
  cloudflare_dns_record
  cloudflare_ruleset
  cloudflare_zone_setting
)

dump() {  # dump <scope-flag> <scope-id> <type>
  local file="$OUT/$3.tf"
  if cf-terraforming generate "$1" "$2" --resource-type "$3" > "$file" 2>"$OUT/$3.err"; then
    local n; n=$(grep -cE '^resource ' "$file" 2>/dev/null || true)
    if [[ "$n" -gt 0 ]]; then ok "$3: $n recurso(s) → $file"; else log "$3: 0 recursos"; rm -f "$file"; fi
    rm -f "$OUT/$3.err"
  else
    warn "$3: no soportado / sin permisos (ver $OUT/$3.err)"
  fi
}

log "Volcando recursos de cuenta ($CLOUDFLARE_ACCOUNT_ID)…"
for t in $ACCOUNT_TYPES; do dump -a "$CLOUDFLARE_ACCOUNT_ID" "$t"; done

if [[ -n "$ZONE" ]]; then
  log "Volcando recursos de zona ($ZONE)…"
  for t in $ZONE_TYPES; do dump -z "$ZONE" "$t"; done
else
  warn "Sin zoneId en Pulumi.prod.yaml → omito DNS/rulesets/settings (configura zoneId para auditarlos)."
fi

# resaltar lo que menciona a este proyecto
echo
log "Coincidencias con '$PROJ' en el volcado:"
grep -rinE "$PROJ" "$OUT" 2>/dev/null | head -30 || true
echo
ok "Auditoría en $OUT/  — revísala o diffea contra un volcado previo:  diff -ru audit/<anterior> $OUT"
exit 0
