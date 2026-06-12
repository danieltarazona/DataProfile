import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import devServer from '@hono/vite-dev-server'
import cloudflareAdapter from '@hono/vite-dev-server/cloudflare'
import build from '@hono/vite-build/cloudflare-pages'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    if (mode === 'client') {
        return {
            plugins: [react()],
            build: {
                outDir: 'dist',
                chunkSizeWarningLimit: 600,
                rollupOptions: {
                    output: {
                        manualChunks: {
                            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                            'xstate-vendor': ['xstate', '@xstate/react'],
                            'motion-vendor': ['motion'],
                        },
                    },
                },
            },
            esbuild: {
                logOverride: { 'css-syntax-error': 'silent' },
            },
            css: {
                postcss: './postcss.config.js',
            },
            resolve: {
                alias: {
                    '@': path.resolve(__dirname, './src'),
                    'xstate': path.resolve(__dirname, 'node_modules/xstate'),
                    '@xstate/react': path.resolve(__dirname, 'node_modules/@xstate/react'),
                },
                dedupe: ['xstate', '@xstate/react', 'react', 'react-dom'],
            },
            server: {
                port: 5173,
                proxy: {
                    '/api': {
                        target: 'http://localhost:8787',
                        changeOrigin: true,
                    }
                }
            },
            optimizeDeps: {
                exclude: ['@datakit/cloudflare-login'],
            },
        }
    } else {
        return {
            plugins: [
                react(),
                devServer({
                    entry: 'src/server/index.ts',
                    adapter: cloudflareAdapter,
                    exclude: [
                        /^(?!\/api).*/,
                    ]
                }),
                build({
                    entry: 'src/server/index.ts',
                })
            ],
            resolve: {
                alias: {
                    '@': path.resolve(__dirname, './src'),
                    'xstate': path.resolve(__dirname, 'node_modules/xstate'),
                    '@xstate/react': path.resolve(__dirname, 'node_modules/@xstate/react'),
                },
                dedupe: ['xstate', '@xstate/react', 'react', 'react-dom'],
            },
            optimizeDeps: {
                exclude: ['@datakit/cloudflare-login'],
            },
            ssr: {
                noExternal: ['@datakit/cloudflare-login', 'xstate', '@xstate/react'],
            },
        }
    }
})
