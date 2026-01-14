'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import clsx from 'clsx';

interface LoginProps {
    onLogin: (email: string, password: string) => void;
    isLoading: boolean;
    error: string | null;
    onClearError: () => void;
}

export default function Login({ onLogin, isLoading, error, onClearError }: LoginProps) {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            onLogin(email, password);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-4">
            {/* Background gradient effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--color-primary)]/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--color-accent)]/20 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative w-full max-w-md"
            >
                {/* Card */}
                <div className={clsx(
                    'bg-[var(--color-card)] rounded-2xl p-8',
                    'border border-[var(--color-border)]',
                    'shadow-2xl shadow-black/20',
                    'backdrop-blur-xl'
                )}>
                    {/* Logo/Title */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center"
                        >
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </motion.div>
                        <h1 className="text-2xl font-bold text-[var(--color-text)]">
                            Data Profile
                        </h1>
                        <p className="text-sm text-[var(--color-text-muted)] mt-1">
                            {t('auth.title')}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error Alert */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-3 rounded-lg bg-red-500/10 border border-red-500/30"
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm text-red-400">{t('auth.error')}</span>
                                    <button
                                        type="button"
                                        onClick={onClearError}
                                        className="ml-auto text-red-400 hover:text-red-300"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">
                                {t('auth.email')}
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                className={clsx(
                                    'w-full px-4 py-3 rounded-lg',
                                    'bg-[var(--color-background)] border border-[var(--color-border)]',
                                    'text-[var(--color-text)] placeholder-[var(--color-text-muted)]',
                                    'focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]',
                                    'transition-colors duration-200'
                                )}
                                placeholder="admin@example.com"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">
                                {t('auth.password')}
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                className={clsx(
                                    'w-full px-4 py-3 rounded-lg',
                                    'bg-[var(--color-background)] border border-[var(--color-border)]',
                                    'text-[var(--color-text)] placeholder-[var(--color-text-muted)]',
                                    'focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]',
                                    'transition-colors duration-200'
                                )}
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading || !email || !password}
                            whileHover={{ scale: isLoading ? 1 : 1.02 }}
                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                            className={clsx(
                                'w-full py-3 px-4 rounded-lg font-medium',
                                'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]',
                                'text-white shadow-lg shadow-[var(--color-primary)]/25',
                                'transition-all duration-200',
                                'disabled:opacity-50 disabled:cursor-not-allowed',
                                'flex items-center justify-center gap-2'
                            )}
                        >
                            {isLoading ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                    />
                                    {t('auth.loading')}
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    {t('auth.login')}
                                </>
                            )}
                        </motion.button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-[var(--color-text-muted)] mt-6">
                    © {new Date().getFullYear()} Daniel Tarazona. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
}
