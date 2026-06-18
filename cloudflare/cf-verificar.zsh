#!/usr/bin/env zsh
###############################################################################
# cf-verificar.zsh — Verifica que Cloudflare quedó como tu código dice, por
# proyecto. Genérico: la misma copia sirve en cada proyecto.
#
# Comprueba:
#   1. Token válido contra la API de Cloudflare.
#   2. DRIFT: pulumi preview --refresh --diff  (¿la realidad coincide con el
#      estado/codigo? detecta cambios hechos a mano en el dashboard).
#   3. CONVERGENCIA: el plan no tiene cambios pendientes.
#   4. API de Cloudflare (según la config del proyecto):
#        - el Worker o el proyecto Pages existe,
#        - la app de Zero Trust Access existe y apunta al dominio,
#        - registros DNS de la zona (si hay zoneId),
#   5. RUNTIME: si hay dominio, curl -I  → estado HTTP + redirección (p.ej. a
#      *.cloudflareaccess.com si Access está activo) y TLS.
#
# Uso:  zsh ./cf-verificar.zsh        (PULUMI_STACK=prod por defecto)
###############################################################################

set -e
setopt pipe_fail 2>/dev/null || true
cd "${0:A:h}"
STACK="${PULUMI_STACK:-prod}"
API="https://api.cloudflare.com/client/v4"

log()  { print -P "%F{cyan}▸%f $*"; }
ok()   { print -P "%F{green}✔%f $*"; }
warn() { print -P "%F{yellow}⚠%f $*"; }
bad()  { print -P "%F{red}✗%f $*"; }
die()  { print -P "%F{red}✗ $*%f" >&2; exit 1; }

ensure_tools() {
  command -v node >/dev/null 2>&1 || { command -v fnm >/dev/null 2>&1 && eval "$(fnm env)" || true; }
  command -v node >/dev/null 2>&1 || die "node no encontrado."
  command -v pulumi >/dev/null 2>&1 || export PATH="$HOME/.pulumi/bin:$PATH"
  command -v pulumi >/dev/null 2>&1 || die "pulumi no encontrado."
}
ensure_creds() {
  if [[ -z "${CLOUDFLARE_API_TOKEN:-}" || -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]]; then
    [[ -n "${KEEPASSXC_PASSWORDS:-}" ]] || die "Exporta CLOUDFLARE_API_TOKEN y CLOUDFLARE_ACCOUNT_ID (o define KEEPASSXC_PASSWORDS)."
    local kp; read -s "kp?KeePass Password: " < /dev/tty; echo
    export CLOUDFLARE_API_TOKEN=$(echo "$kp" | keepassxc-cli show -s -a api_token  "$KEEPASSXC_PASSWORDS" 'Cloudflare_API')
    export CLOUDFLARE_ACCOUNT_ID=$(echo "$kp" | keepassxc-cli show -s -a account_id "$KEEPASSXC_PASSWORDS" 'Cloudflare_API')
    unset kp
  fi
  if [[ -z "${PULUMI_CONFIG_PASSPHRASE:-}" ]]; then
    local pp; read -s "pp?Pulumi passphrase: " < /dev/tty; echo; export PULUMI_CONFIG_PASSPHRASE="$pp"; unset pp
  fi
}
cfget() { pulumi config get "$1" 2>/dev/null || echo ""; }
cf_api() { curl -s -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" "$API$1"; }
cf_code() { curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" "$API$1"; }

# --- 1. token ---------------------------------------------------------------
v_token() {
  cf_api "/user/tokens/verify" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);process.exit(j.success&&j.result&&j.result.status==="active"?0:1)})' \
    && ok "Token activo y con permisos." || die "Token inválido."
}

# --- 2-3. drift + convergencia ---------------------------------------------
v_drift() {
  pulumi login --local >/dev/null
  pulumi stack select "$STACK" 2>/dev/null || { warn "No existe el stack '$STACK' (¿ya hiciste cf:up?)."; return 0; }
  log "Drift / convergencia (pulumi preview --refresh)…"
  local plan="/tmp/cf-ver-$$.json"
  if ! pulumi preview --refresh --json > "$plan" 2>/tmp/cf-ver-$$.err; then
    cat /tmp/cf-ver-$$.err >&2; rm -f "$plan" /tmp/cf-ver-$$.err; warn "No pude refrescar (¿recursos sin crear?)."; return 0
  fi
  node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);const cs=j.changeSummary||{};const ch=(cs.create||0)+(cs.update||0)+(cs.delete||0)+(cs.replace||0);console.error(`   crear:${cs.create||0} actualizar:${cs.update||0} BORRAR:${cs.delete||0} REEMPLAZAR:${cs.replace||0} igual:${cs.same||0}`);process.exit(ch>0?1:0)})' < "$plan" \
    && ok "Sin drift: Cloudflare coincide con tu código Pulumi." \
    || warn "HAY DRIFT o cambios pendientes (alguien tocó el dashboard, o falta un up). Detalle: pulumi preview --refresh --diff"
  rm -f "$plan" /tmp/cf-ver-$$.err
}

# --- 4. API de Cloudflare ---------------------------------------------------
v_api() {
  local worker=$(cfget workerName) pages=$(cfget pagesProjectName)
  local domain=$(cfget zeroTrustDomain) zone=$(cfget zoneId)

  if [[ -n "$worker" ]]; then
    local code=$(cf_code "/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/scripts/$worker")
    [[ "$code" == "200" ]] && ok "Worker '$worker' desplegado." || warn "Worker '$worker' no existe (HTTP $code) → wrangler deploy."
  fi
  if [[ -n "$pages" ]]; then
    cf_api "/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$pages" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);if(j.success){const r=j.result||{};console.error(`   Pages "${r.name}" subdominio=${r.subdomain} dominios=${(r.domains||[]).join(",")||"-"}`);process.exit(0)}process.exit(1)})' \
      && ok "Proyecto Pages '$pages' existe." || warn "Pages '$pages' no existe → wrangler pages deploy."
  fi

  if [[ -n "$domain" ]]; then
    cf_api "/accounts/$CLOUDFLARE_ACCOUNT_ID/access/apps" | node -e '
      let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);const apps=(j.result||[]);
      const a=apps.find(x=>String(x.domain||"").includes(process.argv[1]));
      if(a){console.error(`   Access app "${a.name}" dominio=${a.domain} aud=${a.aud}`);process.exit(0)}process.exit(1)})' "$domain" \
      && ok "App de Zero Trust Access encontrada para $domain." || warn "No hay app de Access para $domain (¿pulumi up con zeroTrustDomain?)."
  else
    log "Zero Trust no configurado (sin zeroTrustDomain) — se omite Access."
  fi

  if [[ -n "$zone" ]]; then
    cf_api "/zones/$zone/dns_records?per_page=100" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);if(!j.success){process.exit(1)}const r=j.result||[];console.error(`   ${r.length} registro(s) DNS:`);r.slice(0,20).forEach(x=>console.error(`     ${x.type} ${x.name} → ${x.content} ${x.proxied?"(proxied)":""}`));process.exit(0)})' \
      && ok "DNS de la zona leído." || warn "No pude leer DNS de la zona $zone (¿el token tiene Zone:DNS:Read?)."
  fi
}

# --- 5. runtime -------------------------------------------------------------
v_runtime() {
  local domain=$(cfget zeroTrustDomain)
  [[ -n "$domain" ]] || return 0
  log "Probando https://$domain (estado + redirección + TLS)…"
  local info; info=$(curl -s -I -o /dev/null -w "%{http_code}|%{redirect_url}|%{ssl_verify_result}" "https://$domain" 2>/dev/null) || { warn "No respondió https://$domain."; return 0; }
  local code="${info%%|*}"; local rest="${info#*|}"; local redir="${rest%%|*}"; local ssl="${rest##*|}"
  print -P "   HTTP $code  TLS_verify=$ssl  redirect=${redir:-—}"
  if [[ "$redir" == *cloudflareaccess.com* ]]; then ok "Access activo: redirige al login de Cloudflare Access."
  elif [[ "$code" == 2* || "$code" == 3* ]]; then ok "Responde (HTTP $code)."
  else warn "Respuesta inusual (HTTP $code)."; fi
}

# ============================== main ========================================
print -P "%F{magenta}== cf-verificar :: $(basename ${0:A:h:h}) / stack $STACK ==%f"
ensure_tools
ensure_creds
v_token
v_drift
v_api
v_runtime
ok "Verificación terminada."
exit 0
