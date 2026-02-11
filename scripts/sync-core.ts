#!/usr/bin/env -S deno run --allow-all
/**
 * Generic Library Sync script - Downloads the latest tarball from the private registry.
 * Uses the Service Binding proxy when available.
 */

const LOCAL_PROXY = "http://localhost:3000/api/registry"; // Next.js default port
const REMOTE_REGISTRY = "https://datakitreactcore.danieltarazona.workers.dev";

const CF_CLIENT_ID = Deno.env.get("CF_CLIENT_ID");
const CF_CLIENT_SECRET = Deno.env.get("CF_CLIENT_SECRET");

const authHeaders = {
    ...(CF_CLIENT_ID && { "CF-Access-Client-Id": CF_CLIENT_ID }),
    ...(CF_CLIENT_SECRET && { "CF-Access-Client-Secret": CF_CLIENT_SECRET }),
};

async function sync(packageName: string, useLatest: boolean = true) {
    try {
        const isLocal = await checkLocalProxy();
        const registryUrl = isLocal ? LOCAL_PROXY : REMOTE_REGISTRY;
        const headers = isLocal ? {} : authHeaders;

        console.log(`🔍 Checking ${isLocal ? 'LOCAL PROXY' : 'REMOTE REGISTRY'} for ${packageName}...`);

        const baseName = packageName.replace('@', '').replace('/', '-');

        if (useLatest) {
            const tarballUrl = `${registryUrl}/${packageName}/tarball/latest`;
            const OUTPUT_FILE = `libs/${baseName}.tgz`; // Profile uses fixed name sometimes, but let's match the package.json expectation.

            console.log(`🚀 Downloading latest tarball from ${tarballUrl}...`);
            const tarballRes = await fetch(tarballUrl, { headers });

            if (!tarballRes.ok) {
                throw new Error(`Failed to download latest tarball: ${tarballRes.status} ${await tarballRes.text()}`);
            }

            const data = await tarballRes.arrayBuffer();
            await Deno.mkdir("libs", { recursive: true });
            await Deno.writeFile(OUTPUT_FILE, new Uint8Array(data));

            console.log(`\n🎉 Successfully synced ${packageName}@latest to ${OUTPUT_FILE}`);
            return OUTPUT_FILE;
        } else {
            const res = await fetch(`${registryUrl}/${packageName}`, { headers });
            if (!res.ok) throw new Error(`Failed to fetch metadata: ${res.status}`);
            const metadata = await res.json();
            const latestVersion = metadata["dist-tags"].latest;
            const tarballUrl = `${registryUrl}/${packageName}/tarball/${latestVersion}`;
            const OUTPUT_FILE = `libs/${baseName}.tgz`;

            const tarballRes = await fetch(tarballUrl, { headers });
            const data = await tarballRes.arrayBuffer();
            await Deno.mkdir("libs", { recursive: true });
            await Deno.writeFile(OUTPUT_FILE, new Uint8Array(data));
            return OUTPUT_FILE;
        }

    } catch (e) {
        console.error(`\n❌ Error: ${e.message}`);
        Deno.exit(1);
    }
}

async function checkLocalProxy(): Promise<boolean> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 500);
        const res = await fetch(`${LOCAL_PROXY}/status`, { signal: controller.signal }).catch(() => null);
        clearTimeout(timeoutId);
        return res?.ok || false;
    } catch {
        return false;
    }
}

const pkgName = Deno.args[0] || "@datakit/react-core";
sync(pkgName);
