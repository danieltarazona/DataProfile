'use client';

import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import clsx from 'clsx';

interface TopBarProps {
    language: string;
    onLanguageChange: (lng: string) => void;
    onExportJson: () => void;
    onTogglePreview: () => void;
    showPreview: boolean;
    isDirty: boolean;
    lastSaved: Date | null;
    onLogout?: () => void;
}

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export default function TopBar({
    language,
    onLanguageChange,
    onExportJson,
    onTogglePreview,
    showPreview,
    isDirty,
    lastSaved,
    onLogout,
}: TopBarProps) {
    const { t } = useTranslation();

    const formatLastSaved = (date: Date | null) => {
        if (!date) return null;
        return date.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <header className="h-16 px-6 flex items-center justify-between bg-[var(--color-card)] border-b border-[var(--color-border)]">
            {/* Left: Status */}
            <div className="flex items-center gap-4">
                {isDirty ? (
                    <span className="flex items-center gap-2 text-sm text-[var(--color-accent)]">
                        <motion.span
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-2 h-2 rounded-full bg-[var(--color-accent)]"
                        />
                        {t('actions.saving')}
                    </span>
                ) : lastSaved ? (
                    <span className="flex items-center gap-2 text-sm text-[var(--color-secondary)]">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)]" />
                        {t('actions.saved')} • {formatLastSaved(lastSaved)}
                    </span>
                ) : null}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                {/* Language Selector */}
                <select
                    value={language}
                    onChange={(e) => onLanguageChange(e.target.value)}
                    className={clsx(
                        'px-3 py-1.5 rounded-lg text-sm',
                        'bg-[var(--color-background)] border border-[var(--color-border)]',
                        'text-[var(--color-text)]',
                        'focus:border-[var(--color-primary)] focus:ring-0'
                    )}
                >
                    {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                        </option>
                    ))}
                </select>

                {/* Toggle Preview */}
                <button
                    onClick={onTogglePreview}
                    className={clsx(
                        'px-4 py-2 rounded-lg text-sm font-medium',
                        'transition-colors duration-200',
                        showPreview
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)]'
                    )}
                >
                    {showPreview ? '📄 PDF' : '📄 Show PDF'}
                </button>

                {/* Export JSON */}
                <button
                    onClick={onExportJson}
                    className={clsx(
                        'px-4 py-2 rounded-lg text-sm font-medium',
                        'bg-[var(--color-background)] border border-[var(--color-border)]',
                        'text-[var(--color-text)] hover:bg-[var(--color-border)]/50',
                        'transition-colors duration-200',
                        'flex items-center gap-2'
                    )}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {t('actions.exportJson')}
                </button>

                {/* Logout Button */}
                {onLogout && (
                    <button
                        onClick={onLogout}
                        className={clsx(
                            'px-4 py-2 rounded-lg text-sm font-medium',
                            'bg-red-500/10 border border-red-500/30',
                            'text-red-400 hover:bg-red-500/20',
                            'transition-colors duration-200',
                            'flex items-center gap-2'
                        )}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {t('auth.logout')}
                    </button>
                )}
            </div>
        </header>
    );
}
