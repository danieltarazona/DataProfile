/**
 * Worker + D1 + edge Zero Trust — shared Pulumi program (TypeScript).
 *
 * 1:1 port of the OpenTofu storage.tf + zero_trust.tf used by DataKitForms,
 * DataKitLinks, and DataProfile. All three have the same shape:
 *
 *   - a D1 database (always created; metadata store for the app), and
 *   - an admin panel + API protected at the Cloudflare edge by an identity
 *     (email) based Access policy — created ONLY when the Worker is routed to a
 *     custom domain (Access cannot protect *.workers.dev).
 *
 * Project-specific strings (worker name, D1 name, Access names) come from stack
 * config so this file is identical across the three projects. The Worker script
 * + its bindings (D1, registry service binding, admin secrets) are owned by
 * wrangler, not Pulumi.
 *
 * D1 NAME / IMPORT: `d1DatabaseName` is the LIVE database name (some predate the
 * `<project>d1` convention, e.g. datakitformsd1 / datareactprofiled1). It
 * must match the live name so `pulumi import` adopts the existing DB instead of
 * `pulumi up` creating a new empty one. See AGENTS.md + import.json.example.
 *
 * Credentials (never committed): CLOUDFLARE_API_TOKEN from env; account id from
 * CLOUDFLARE_ACCOUNT_ID (KeePassXC).
 */

import * as pulumi from "@pulumi/pulumi";
import * as cloudflare from "@pulumi/cloudflare";

const config = new pulumi.Config();

const accountId =
    config.get("accountId") ??
    process.env.CLOUDFLARE_ACCOUNT_ID ??
    process.env.CLOUDFLARE_API_ACCOUNT_ID;

if (!accountId) {
    throw new Error(
        `Cloudflare account id missing. Export CLOUDFLARE_ACCOUNT_ID (KeePassXC: Cloudflare_API/account_id) ` +
            `or \`pulumi config set --secret ${pulumi.getProject()}:accountId <id>\`.`,
    );
}

const workerName = config.require("workerName");
const d1DatabaseName = config.require("d1DatabaseName");
const accessPolicyName = config.require("accessPolicyName");
const accessAppName = config.require("accessAppName");
const zeroTrustDomain = config.get("zeroTrustDomain") ?? "";
const zoneId = config.get("zoneId") ?? "";
const accessAllowedEmails = config.getObject<string[]>("accessAllowedEmails") ?? [];

// D1 — always created. read_replication pinned to "auto" so the provider never
// sends read_replication=null on update (the D1 API rejects null).
const database = new cloudflare.D1Database("database", {
    accountId,
    name: d1DatabaseName,
    readReplication: { mode: "auto" },
});

// Edge Zero Trust — only with a custom domain.
let accessPolicy: cloudflare.ZeroTrustAccessPolicy | undefined;
let accessApplication: cloudflare.ZeroTrustAccessApplication | undefined;
let customDomain: cloudflare.WorkersCustomDomain | undefined;

if (zeroTrustDomain !== "") {
    accessPolicy = new cloudflare.ZeroTrustAccessPolicy("admin-policy", {
        accountId,
        name: accessPolicyName,
        decision: "allow",
        includes: accessAllowedEmails.map((email) => ({ email: { email } })),
    });

    accessApplication = new cloudflare.ZeroTrustAccessApplication("admin-app", {
        accountId,
        name: accessAppName,
        domain: zeroTrustDomain,
        type: "self_hosted",
        sessionDuration: "24h",
        appLauncherVisible: false,
        policies: [{ id: accessPolicy.id, precedence: 1 }],
    });

    customDomain = new cloudflare.WorkersCustomDomain("admin-domain", {
        accountId,
        hostname: zeroTrustDomain,
        service: workerName,
        zoneId,
    });
}

export const workerNameOut = workerName;
export const d1DatabaseId = database.id;
export const accessApplicationAud = accessApplication ? accessApplication.aud : pulumi.output("");
export const customDomainHostname = customDomain ? customDomain.hostname : pulumi.output("");
