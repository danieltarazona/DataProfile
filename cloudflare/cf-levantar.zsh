#!/usr/bin/env zsh
###############################################################################
# cf-levantar.zsh — Bring-up automatizado de la infraestructura Cloudflare
# (Pulumi) de un proyecto DataJS. Genérico: la misma copia sirve en cada
# proyecto porque lee todo de la config del stack y de import.json.example.
#
# Hace, en orden y con verificaciones:
#   1. Carga node/pnpm/pulumi y credenciales (env o KeePassXC).
#   2. Verifica el token contra la API de Cloudflare (tokens/verify).
#   3. pnpm install + tsc --noEmit (comprueba que el programa compila).
#   4. Selecciona/crea el stack (por defecto "prod") en el backend local.
#   5. ADOPTA los servicios existentes: genera import.json desde
#      import.json.example (sustituye el account id) e importa SOLO si el estado
#      está vacío. Así "traslada" los valores actuales (ids vivos) a Pulumi.
#   6. PREVIEW SEGURO: aborta si el plan incluye delete/replace (protege D1, etc.).
#   7. pulumi up (salvo --preview-only).
#   8. TRASLADA de vuelta los valores generados (KV id, AUD de Access) a
#      ../wrangler.toml (con backup .bak y diff).
#   9. Comprobación de convergencia: un preview final debe salir "sin cambios".
#
# Uso:
#   zsh ./cf-levantar.zsh                 # flujo completo
#   zsh ./cf-levantar.zsh --preview-only  # se detiene antes de aplicar
#   PULUMI_STACK=staging zsh ./cf-levantar.zsh
###############################################################################

set -e
setopt pipe_fail 2>/dev/null || true

cd "${0:A:h}"                       # carpeta del script (cloudflare/)
MODE="full"
[[ "${1:-}" == "--preview-only" ]] && MODE="preview"
STACK="${PULUMI_STACK:-prod}"
API="https://api.cloudflare.com/client/v4"

log()  { print -P "%F{cyan}▸%f $*"; }
ok()   { print -P "%F{green}✔%f $*"; }
warn() { print -P "%F{yellow}⚠%f $*"; }
die()  { print -P "%F{red}✗ $*%f" >&2; exit 1; }

# --- 1. Herramientas --------------------------------------------------------
ensure_tools() {
  if ! command -v node >/dev/null 2>&1; then
    command -v fnm >/dev/null 2>&1 && eval "$(fnm env)" || true
  fi
  command -v node >/dev/null 2>&1 || die "node no encontrado (instala node o fnm)."
  command -v pnpm >/dev/null 2>&1 || die "pnpm no encontrado."
  command -v pulumi >/dev/null 2>&1 || export PATH="$HOME/.pulumi/bin:$PATH"
  command -v pulumi >/dev/null 2>&1 || die "pulumi no encontrado (curl -fsSL https://get.pulumi.com | sh)."
}

# --- 1b. Credenciales (env o KeePassXC) -------------------------------------
ensure_creds() {
  if [[ -z "${CLOUDFLARE_API_TOKEN:-}" || -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]]; then
    [[ -n "${KEEPASSXC_PASSWORDS:-}" ]] || die "Exporta CLOUDFLARE_API_TOKEN y CLOUDFLARE_ACCOUNT_ID (o define KEEPASSXC_PASSWORDS)."
    command -v keepassxc-cli >/dev/null 2>&1 || die "keepassxc-cli no instalado."
    local kp
    read -s "kp?KeePass Password: " < /dev/tty; echo
    export CLOUDFLARE_API_TOKEN=$(echo "$kp" | keepassxc-cli show -s -a api_token  "$KEEPASSXC_PASSWORDS" 'Cloudflare_API')
    export CLOUDFLARE_ACCOUNT_ID=$(echo "$kp" | keepassxc-cli show -s -a account_id "$KEEPASSXC_PASSWORDS" 'Cloudflare_API')
    unset kp
  fi
  [[ -n "${CLOUDFLARE_API_TOKEN:-}" && -n "${CLOUDFLARE_ACCOUNT_ID:-}" ]] || die "No pude obtener las credenciales de Cloudflare."
  if [[ -z "${PULUMI_CONFIG_PASSPHRASE:-}" ]]; then
    local pp; read -s "pp?Pulumi passphrase (PULUMI_CONFIG_PASSPHRASE): " < /dev/tty; echo
    export PULUMI_CONFIG_PASSPHRASE="$pp"; unset pp
  fi
}

# --- 2. Token válido + Cloudflare alcanzable --------------------------------
verify_token() {
  log "Verificando el token contra Cloudflare…"
  local resp
  resp=$(curl -s -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" "$API/user/tokens/verify") || die "No hay red hacia api.cloudflare.com."
  echo "$resp" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);if(j.success&&j.result&&j.result.status==="active"){process.exit(0)}console.error(JSON.stringify(j.errors||j));process.exit(1)})' \
    && ok "Token activo." || die "El token de Cloudflare no es válido/activo."
}

# --- 3. Código compila ------------------------------------------------------
build_check() {
  log "pnpm install…"; pnpm install >/dev/null
  log "tsc --noEmit…"; npx tsc --noEmit && ok "El programa Pulumi compila."
}

# --- 4. Stack ---------------------------------------------------------------
select_stack() {
  pulumi login --local >/dev/null
  pulumi stack select "$STACK" 2>/dev/null || { log "Creando stack '$STACK'…"; pulumi stack init "$STACK"; }
}

# helper: nº de recursos cloudflare en el estado
state_resource_count() {
  pulumi stack export 2>/dev/null | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);const r=(j.deployment&&j.deployment.resources)||[];console.log(r.filter(x=>x.type&&String(x.type).startsWith("cloudflare:")).length)}catch{console.log(0)}})'
}

# --- 5. Adoptar servicios existentes (trasladar valores vivos → Pulumi) -----
adopt_existing() {
  [[ -f import.json.example ]] || { log "Sin import.json.example: nada que adoptar."; return 0; }
  local count; count=$(state_resource_count)
  if [[ "${count:-0}" -gt 0 ]]; then ok "El estado ya tiene $count recurso(s); omito import."; return 0; fi
  log "Adoptando servicios existentes (pulumi import)…"
  # Sustituye el account id y deja SOLO la clave resources (Pulumi no admite _comment).
  sed "s/ACCOUNT_ID_HERE/$CLOUDFLARE_ACCOUNT_ID/g" import.json.example \
    | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);process.stdout.write(JSON.stringify({resources:j.resources||[]}))})' > import.json
  pulumi import -f import.json --yes --generate-code=false || { rm -f import.json; die "Falló el import. Revisa nombres/ids o que el recurso exista."; }
  rm -f import.json
  ok "Servicios existentes adoptados en el estado de Pulumi."
}

# --- 6. Preview seguro (aborta ante delete/replace) -------------------------
safe_preview() {
  log "Calculando plan (pulumi preview)…"
  local plan="/tmp/cf-plan-$$.json"
  pulumi preview --json > "$plan" 2>/tmp/cf-plan-$$.err || { cat /tmp/cf-plan-$$.err >&2; rm -f "$plan"; die "El preview falló."; }
  node -e '
    let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{
      const j=JSON.parse(s); const cs=j.changeSummary||{};
      const c=cs.create||0,u=cs.update||0,sm=cs.same||0,del=cs.delete||0,rep=cs.replace||0;
      console.error(`   plan → crear:${c} actualizar:${u} igual:${sm} BORRAR:${del} REEMPLAZAR:${rep}`);
      process.exit((del+rep)>0?2:0);
    })' < "$plan"
  local rc=$?
  rm -f "$plan" /tmp/cf-plan-$$.err
  [[ $rc -eq 0 ]] || die "El plan incluye BORRAR/REEMPLAZAR. Abortado por seguridad (revisa p.ej. el nombre del D1 antes de continuar)."
  ok "Plan seguro (sin destrucciones)."
}

# --- 7. Aplicar -------------------------------------------------------------
apply() {
  log "Aplicando (pulumi up)…"; pulumi up --yes >/dev/null || die "pulumi up falló."; ok "Infraestructura aplicada."
}

# --- 8. Trasladar valores generados → ../wrangler.toml ----------------------
transfer_to_wrangler() {
  local wt="../wrangler.toml"; [[ -f "$wt" ]] || { warn "No hay ../wrangler.toml; omito traslado."; return 0; }
  command -v python3 >/dev/null 2>&1 || { warn "python3 no disponible; omito traslado a wrangler.toml."; return 0; }
  local outs; outs=$(pulumi stack output --json 2>/dev/null) || return 0
  log "Trasladando valores generados (KV id / AUD) a ../wrangler.toml…"
  local res
  res=$(python3 - "$wt" "$outs" <<'PY'
import sys, json, re, shutil, pathlib
wt = pathlib.Path(sys.argv[1]); outs = json.loads(sys.argv[2] or "{}")
text = wt.read_text(); orig = text
kv  = outs.get("sessionKvNamespaceId")
aud = outs.get("accessApplicationAud")
changes = []
# SESSION KV id (bloque [[kv_namespaces]] con binding="SESSION")
if kv:
    def repl(m):
        block = m.group(0)
        if re.search(r'binding\s*=\s*"SESSION"', block):
            nb = re.sub(r'(id\s*=\s*")[^"]*(")', r'\g<1>'+kv+r'\g<2>', block)
            if nb != block: changes.append(f"SESSION kv id -> {kv}")
            return nb
        return block
    text = re.sub(r'\[\[kv_namespaces\]\][^\[]*', repl, text)
# CF_ACCESS_AUD en [vars]
if aud:
    if re.search(r'^\s*CF_ACCESS_AUD\s*=', text, re.M):
        nt = re.sub(r'(^\s*CF_ACCESS_AUD\s*=\s*").*?(")', r'\g<1>'+aud+r'\g<2>', text, flags=re.M)
        if nt != text: changes.append("CF_ACCESS_AUD actualizado"); text = nt
    elif re.search(r'^\s*\[vars\]\s*$', text, re.M):
        text = re.sub(r'(^\s*\[vars\]\s*$)', r'\g<1>\nCF_ACCESS_AUD = "'+aud+'"', text, flags=re.M, count=1)
        changes.append("CF_ACCESS_AUD añadido a [vars]")
if text != orig:
    shutil.copyfile(wt, str(wt)+".bak")
    wt.write_text(text)
    print("; ".join(changes))
else:
    print("none")
PY
)
  if [[ "$res" == "none" || -z "$res" ]]; then
    ok "wrangler.toml ya estaba al día (sin cambios)."
  else
    ok "wrangler.toml actualizado ($res). Backup: ../wrangler.toml.bak"
  fi
}

# --- 9. Convergencia (preview final = sin cambios) --------------------------
verify_converged() {
  [[ "$MODE" == "preview" ]] && return 0
  log "Comprobando convergencia (preview final)…"
  local plan="/tmp/cf-conv-$$.json"
  pulumi preview --json > "$plan" 2>/dev/null || { rm -f "$plan"; warn "No pude comprobar convergencia."; return 0; }
  node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);const cs=j.changeSummary||{};const ch=(cs.create||0)+(cs.update||0)+(cs.delete||0)+(cs.replace||0);process.exit(ch>0?1:0)})' < "$plan" \
    && ok "Convergió: el estado coincide con tu código." \
    || warn "Quedan cambios pendientes tras el up (revisa con: pulumi preview --diff)."
  rm -f "$plan"
}

# ============================== main ========================================
print -P "%F{magenta}== cf-levantar :: $(basename ${0:A:h:h}) / stack $STACK ==%f"
ensure_tools
ensure_creds
verify_token
build_check
select_stack
adopt_existing
safe_preview
if [[ "$MODE" == "preview" ]]; then ok "Modo --preview-only: no se aplica nada. Listo."; exit 0; fi
apply
transfer_to_wrangler
verify_converged
ok "Listo."
exit 0
