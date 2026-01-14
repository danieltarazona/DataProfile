import crypto from 'crypto';

const password = process.argv[2];

if (!password) {
    console.log('Usage: deno run hash_password.ts <password>');
    process.exit(1);
}

const hash = crypto.createHash('sha256').update(password).digest('hex');
console.log(`\nPassword: ${password}`);
console.log(`SHA-256 Hash: ${hash}\n`);
console.log('Set this hash as the value for ADMIN_PASSWORD in your Cloudflare Pages environment variables.');
