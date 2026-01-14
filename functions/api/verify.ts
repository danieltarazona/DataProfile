/**
 * Verify Session API - Cloudflare Pages Function
 * Verifies the session cookie is valid
 */

/// <reference types="@cloudflare/workers-types" />

interface SessionData {
    email: string;
    expiresAt: number;
    token: string;
}

export const onRequestGet: PagesFunction = async (context: EventContext<unknown, string, unknown>): Promise<Response> => {
    const { request } = context;

    try {
        // Get session cookie
        const cookieHeader = request.headers.get('Cookie') || '';
        const cookies = Object.fromEntries(
            cookieHeader.split(';').map((c: string) => {
                const [key, ...val] = c.trim().split('=');
                return [key, val.join('=')];
            })
        );

        const sessionCookie = cookies['session'];

        if (!sessionCookie) {
            return new Response(
                JSON.stringify({ error: 'No session' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Decode and parse session
        try {
            const sessionData = JSON.parse(atob(sessionCookie)) as SessionData;

            // Check expiration
            if (Date.now() > sessionData.expiresAt) {
                return new Response(
                    JSON.stringify({ error: 'Session expired' }),
                    { status: 401, headers: { 'Content-Type': 'application/json' } }
                );
            }

            // Session is valid
            return new Response(
                JSON.stringify({ valid: true, email: sessionData.email }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        } catch {
            return new Response(
                JSON.stringify({ error: 'Invalid session' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }
    } catch (error) {
        console.error('Verify error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
