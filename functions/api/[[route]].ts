import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import { getCookie, setCookie } from 'hono/cookie';

type Bindings = {
    DB: D1Database;
    DATAKITREACTCORE: Fetcher;
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
    NODE_ENV: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath('/api');

// --- Auth Utilities ---

async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const inputHash = await hashPassword(password);
    console.log('[Auth] Verifying password...');
    console.log('[Auth] Input Hash:', inputHash);
    console.log('[Auth] Stored Hash:', storedHash);
    
    if (inputHash.length !== storedHash.length) {
        console.log('[Auth] Hash length mismatch');
        return false;
    }
    
    let result = 0;
    for (let i = 0; i < inputHash.length; i++) {
        result |= inputHash.charCodeAt(i) ^ storedHash.charCodeAt(i);
    }
    const isValid = result === 0;
    console.log('[Auth] Password match:', isValid);
    return isValid;
}

// --- Auth Routes ---

app.post('/auth/login', async (c) => {
    try {
        const body = await c.req.json();
        const { email, password } = body;

        console.log('[Auth] Login attempt for:', email);
        const adminEmail = c.env.ADMIN_EMAIL;
        const adminPasswordHash = c.env.ADMIN_PASSWORD;

        console.log('[Auth] Admin Email (configured):', adminEmail);
        console.log('[Auth] Admin Password Hash (configured):', adminPasswordHash ? 'PRESENT' : 'MISSING');

        if (!adminEmail || !adminPasswordHash) {
            console.error('[Auth] Server configuration error: ADMIN_EMAIL or ADMIN_PASSWORD missing');
            return c.json({ error: 'Server configuration error' }, 500);
        }

        if (email.toLowerCase() !== adminEmail.toLowerCase()) {
            console.log('[Auth] Email mismatch');
            return c.json({ error: 'Invalid credentials' }, 401);
        }

        const isValidPassword = await verifyPassword(password, adminPasswordHash);
        if (!isValidPassword) {
            console.log('[Auth] Invalid password');
            return c.json({ error: 'Invalid credentials' }, 401);
        }

        const sessionToken = crypto.randomUUID();
        const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days

        const sessionData = JSON.stringify({
            email: adminEmail,
            expiresAt,
            token: sessionToken,
        });

        const sessionEncoded = btoa(sessionData);

        setCookie(c, 'session', sessionEncoded, {
            path: '/',
            httpOnly: true,
            secure: c.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60,
        });

        return c.json({ success: true, email: adminEmail });
    } catch (e) {
        console.error('[Auth] Login error:', e);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

app.post('/auth/logout', async (c) => {
    setCookie(c, 'session', '', {
        path: '/',
        httpOnly: true,
        secure: c.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 0,
    });
    return c.json({ success: true });
});

app.get('/auth/verify', async (c) => {
    try {
        const sessionCookie = getCookie(c, 'session');
        if (!sessionCookie) {
            return c.json({ error: 'No session' }, 401);
        }

        try {
            const sessionData = JSON.parse(atob(sessionCookie));
            if (Date.now() > sessionData.expiresAt) {
                return c.json({ error: 'Session expired' }, 401);
            }
            return c.json({ valid: true, email: sessionData.email });
        } catch {
            return c.json({ error: 'Invalid session' }, 401);
        }
    } catch {
        return c.json({ error: 'Internal server error' }, 500);
    }
});

// --- Registry Routes ---
app.all('/registry/:path*', async (c) => {
    const path = c.req.param('path');
    const registry = c.env.DATAKITREACTCORE;

    if (!registry) {
        console.error('[Registry] DATAKITREACTCORE binding not found');
        return c.json({ error: 'Service binding not configured' }, 500);
    }

    const url = new URL(c.req.url);
    const targetUrl = `https://registry.internal/${path}${url.search}`;

    try {
        const fetchOptions: RequestInit = {
            method: c.req.method,
            headers: c.req.header() as any,
            body: (c.req.method !== 'GET' && c.req.method !== 'HEAD') ? await c.req.arrayBuffer() : undefined,
        };

        const response = await registry.fetch(targetUrl, fetchOptions);

        return new Response(response.body, {
            status: response.status,
            headers: response.headers,
        });
    } catch (e: any) {
        console.error('[Registry] Proxy error:', e);
        return c.json({ error: e.message }, 500);
    }
});

export const onRequest = handle(app);
