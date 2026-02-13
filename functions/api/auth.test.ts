import { describe, it, expect, beforeEach, vi } from 'vitest';
import { onRequest } from './[[route]]';

// Mock context and environment
const mockEnv = {
    ADMIN_EMAIL: 'admin@example.com',
    ADMIN_PASSWORD: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // hash of 'admin123'
    NODE_ENV: 'test',
};

describe('Auth API (Hono)', () => {
    it('should login successfully with correct credentials', async () => {
        const req = new Request('http://localhost/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'admin123'
            })
        });

        const response = await onRequest({ request: req, env: mockEnv, params: {}, waitUntil: () => { }, next: () => { }, data: {} } as any);

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.email).toBe('admin@example.com');
        expect(response.headers.get('Set-Cookie')).toContain('session=');
    });

    it('should fail login with incorrect password', async () => {
        const req = new Request('http://localhost/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'wrongpassword'
            })
        });

        const response = await onRequest({ request: req, env: mockEnv, params: {}, waitUntil: () => { }, next: () => { }, data: {} } as any);

        expect(response.status).toBe(401);
        const data = await response.json();
        expect(data.error).toBe('Invalid credentials');
    });

    it('should fail login with incorrect email', async () => {
        const req = new Request('http://localhost/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'wrong@example.com',
                password: 'admin123'
            })
        });

        const response = await onRequest({ request: req, env: mockEnv, params: {}, waitUntil: () => { }, next: () => { }, data: {} } as any);

        expect(response.status).toBe(401);
    });

    it('should verify session', async () => {
        // First login to get cookie
        const loginReq = new Request('http://localhost/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'admin123'
            })
        });
        const loginRes = await onRequest({ request: loginReq, env: mockEnv, params: {}, waitUntil: () => { }, next: () => { }, data: {} } as any);
        const cookie = loginRes.headers.get('Set-Cookie');

        // Then verify
        const verifyReq = new Request('http://localhost/api/auth/verify', {
            headers: { 'Cookie': cookie || '' }
        });
        const verifyRes = await onRequest({ request: verifyReq, env: mockEnv, params: {}, waitUntil: () => { }, next: () => { }, data: {} } as any);

        expect(verifyRes.status).toBe(200);
        const verifyData = await verifyRes.json();
        expect(verifyData.valid).toBe(true);
        expect(verifyData.email).toBe('admin@example.com');
    });

    it('should logout successfully', async () => {
        const req = new Request('http://localhost/api/auth/logout', {
            method: 'POST'
        });

        const response = await onRequest({ request: req, env: mockEnv, params: {}, waitUntil: () => { }, next: () => { }, data: {} } as any);

        expect(response.status).toBe(200);
        expect(response.headers.get('Set-Cookie')).toContain('Max-Age=0');
    });
});
