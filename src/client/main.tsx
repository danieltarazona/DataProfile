import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './globals.css'
import '@datakit/react-core/styles.css'
import '@datakit/cloudflare-login/styles.css'
import '@/lib/i18n'

// Global error handler for debugging "black screens"
window.onerror = (message, source, lineno, colno, error) => {
    const root = document.getElementById('root');
    if (root) {
        root.innerHTML = `
            <div style="background: #1a1a2e; color: #ff4d4d; padding: 2rem; font-family: monospace; height: 100vh;">
                <h1 style="border-bottom: 2px solid #ff4d4d; padding-bottom: 1rem;">致命的なエラー (Fatal Error)</h1>
                <p><strong>Message:</strong> ${message}</p>
                <p><strong>Source:</strong> ${source}:${lineno}:${colno}</p>
                <pre style="background: #0f0f1a; padding: 1rem; border-radius: 4px; overflow: auto; max-height: 50vh;">${error?.stack || 'No stack trace'}</pre>
                <button onclick="location.reload()" style="background: #ff4d4d; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; margin-top: 1rem;">Reload Application</button>
            </div>
        `;
    }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
