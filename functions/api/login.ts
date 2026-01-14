/**
 * Login API - Cloudflare Pages Function
 * Verifies credentials against environment variables
 */

/// <reference types="@cloudflare/workers-types" />

interface Env {
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string; // SHA-256 hashed password
}

interface LoginBody {
    email: string;
    password: string;
}

// Hash password using Web Crypto API (SHA-256)
async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const inputHash = await hashPassword(password);
    // Constant-time comparison to prevent timing attacks
    if (inputHash.length !== storedHash.length) return false;
    let result = 0;
    for (let i = 0; i < inputHash.length; i++) {
        result |= inputHash.charCodeAt(i) ^ storedHash.charCodeAt(i);
    }
    return result === 0;
}

export const onRequestPost: PagesFunction<Env> = async (context: EventContext<Env, string, unknown>) => {
    const { request, env } = context;

    try {
        const body = await request.json() as LoginBody;
        const { email, password } = body;

        // Validate input
        if (!email || !password) {
            return new Response(
                JSON.stringify({ error: 'Email and password required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check credentials against environment variables
        const adminEmail = env.ADMIN_EMAIL;
        const adminPasswordHash = env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPasswordHash) {
            console.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD environment variables');
            return new Response(
                JSON.stringify({ error: 'Server configuration error' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Verify email (case-insensitive)
        if (email.toLowerCase() !== adminEmail.toLowerCase()) {
            return new Response(
                JSON.stringify({ error: 'Invalid credentials' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, adminPasswordHash);
        if (!isValidPassword) {
            return new Response(
                JSON.stringify({ error: 'Invalid credentials' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Generate session token
        const sessionToken = crypto.randomUUID();
        const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days

        // Create session data
        const sessionData = JSON.stringify({
            email: adminEmail,
            expiresAt,
            token: sessionToken,
        });

        // Encode session as base64
        const sessionEncoded = btoa(sessionData);

        // Set secure HTTP-only cookie
        const cookie = [
            `session=${sessionEncoded}`,
            'Path=/',
            'HttpOnly',
            'Secure',
            'SameSite=Strict',
            `Max-Age=${7 * 24 * 60 * 60}`, // 7 days
        ].join('; ');

        return new Response(
            JSON.stringify({ success: true, email: adminEmail }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Set-Cookie': cookie,
                },
            }
        );
    } catch (error) {
        console.error('Login error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
