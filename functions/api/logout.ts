/**
 * Logout API - Cloudflare Pages Function
 * Clears the authentication cookie
 */

/// <reference types="@cloudflare/workers-types" />

export const onRequestPost: PagesFunction = async (): Promise<Response> => {
    // Clear the session cookie
    const cookie = [
        'session=',
        'Path=/',
        'HttpOnly',
        'Secure',
        'SameSite=Strict',
        'Max-Age=0', // Expire immediately
    ].join('; ');

    return new Response(
        JSON.stringify({ success: true }),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Set-Cookie': cookie,
            },
        }
    );
};
