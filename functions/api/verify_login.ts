import { onRequest } from './[[route]]';

async function runTests() {
    const mockEnv = {
        ADMIN_EMAIL: 'admin@example.com',
        ADMIN_PASSWORD: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // hash of 'admin123'
        NODE_ENV: 'test',
    };

    console.log('--- Auth Test Suite ---');

    // Test 1: Successful Login
    try {
        const loginReq = new Request('http://localhost/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' })
        });
        const loginRes = await onRequest({ request: loginReq, env: mockEnv, params: {} } as any);
        const loginData = await loginRes.json();

        if (loginRes.status === 200 && loginData.success) {
            console.log('✅ Test 1: Successful Login - PASSED');
        } else {
            console.log('❌ Test 1: Successful Login - FAILED', loginRes.status, loginData);
        }

        const cookie = loginRes.headers.get('Set-Cookie');

        // Test 2: Verify Session
        const verifyReq = new Request('http://localhost/api/auth/verify', {
            headers: { 'Cookie': cookie || '' }
        });
        const verifyRes = await onRequest({ request: verifyReq, env: mockEnv, params: {} } as any);
        const verifyData = await verifyRes.json();

        if (verifyRes.status === 200 && verifyData.valid) {
            console.log('✅ Test 2: Verify Session - PASSED');
        } else {
            console.log('❌ Test 2: Verify Session - FAILED', verifyRes.status, verifyData);
        }

        // Test 3: Logout
        const logoutReq = new Request('http://localhost/api/auth/logout', { method: 'POST' });
        const logoutRes = await onRequest({ request: logoutReq, env: mockEnv, params: {} } as any);

        if (logoutRes.status === 200 && logoutRes.headers.get('Set-Cookie')?.includes('Max-Age=0')) {
            console.log('✅ Test 3: Logout - PASSED');
        } else {
            console.log('❌ Test 3: Logout - FAILED', logoutRes.status);
        }

    } catch (e) {
        console.error('Test Suite Error:', e);
    }
}

runTests();
