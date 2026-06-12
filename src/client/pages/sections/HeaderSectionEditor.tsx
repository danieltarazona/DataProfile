import React from 'react';
import { HeaderSection as CoreHeaderSection } from '@datakit/react-core';
import type { SectionEditorProps } from './types';

export function HeaderSectionEditor({ data, t, lang, sectHook }: SectionEditorProps) {
    // Header is unique as it's NOT a list, and it's managed via updateHeader api
    // sectHook here is special (the api object or specialized wrapper)
    
    // In Home.tsx, we had:
    // headerData = { ...data.header!, title: api.getLocalizedField(...), location: api.getLocalizedField(...) }
    
    const { github: _, ...headerMinusGithub } = data.header!;
    const cleanLang = (lang || 'en').slice(0, 2).toLowerCase();
    const propSuffix = cleanLang === 'en' ? 'En' : cleanLang === 'es' ? 'Es' : 'Fr';
    const headerData = {
        ...headerMinusGithub,
        title: data.header![`title${propSuffix}` as keyof typeof data.header] || data.header?.titleEn,
        location: data.header![`location${propSuffix}` as keyof typeof data.header] || data.header?.locationEn,
    } as any;

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header Basic Info */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                    <h3 className="text-sm font-bold text-gray-200 uppercase tracking-widest">Personal Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('header.name')}</label>
                        <input
                            type="text"
                            value={data.header?.name || ''}
                            onChange={(e) => sectHook.updateHeader({ name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('header.title')} ({lang.toUpperCase()})</label>
                        <input
                            type="text"
                            value={data.header?.[`title${propSuffix}` as keyof typeof data.header] || ''}
                            onChange={(e) => {
                                sectHook.updateHeader({ [`title${propSuffix}`]: e.target.value });
                            }}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('header.email')}</label>
                        <input
                            type="email"
                            value={data.header?.email || ''}
                            onChange={(e) => sectHook.updateHeader({ email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('header.phone')}</label>
                        <input
                            type="tel"
                            value={data.header?.phone || ''}
                            onChange={(e) => sectHook.updateHeader({ phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('header.location')} ({lang.toUpperCase()})</label>
                        <input
                            type="text"
                            value={data.header?.[`location${propSuffix}` as keyof typeof data.header] || ''}
                            onChange={(e) => {
                                sectHook.updateHeader({ [`location${propSuffix}`]: e.target.value });
                            }}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Links Section */}
            <div className="mt-8 space-y-6 pt-8 border-t border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                    <h3 className="text-sm font-bold text-gray-200 uppercase tracking-widest">Connect & Portfolio</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <span>⌨ GitHub</span>
                        </label>
                        <input
                            type="url"
                            value={data.header?.github || ''}
                            onChange={(e) => sectHook.updateHeader({ github: e.target.value })}
                            placeholder="https://github.com/username"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <span>🔗 LinkedIn</span>
                        </label>
                        <input
                            type="url"
                            value={data.header?.linkedin || ''}
                            onChange={(e) => sectHook.updateHeader({ linkedin: e.target.value })}
                            placeholder="https://linkedin.com/in/profile"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <span>🌐 Website</span>
                        </label>
                        <input
                            type="url"
                            value={data.header?.website || ''}
                            onChange={(e) => sectHook.updateHeader({ website: e.target.value })}
                            placeholder="https://yourwebsite.com"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* AI & ATS Optimization (Academic) */}
            <div className="mt-8 space-y-6 pt-8 border-t border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                    <h3 className="text-sm font-bold text-gray-200 uppercase tracking-widest">Academic AI & ATS Optimization</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-purple-500/5 border border-purple-500/10 rounded-2xl p-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                            <span>Hidden AI Prompt Directive</span>
                        </label>
                        <div className="flex items-center gap-3 mt-2">
                            <input
                                type="checkbox"
                                id="aiPromptEnabled"
                                checked={data.header?.aiPromptEnabled === 1 || data.header?.aiPromptEnabled === true || data.header?.aiPromptEnabled === '1'}
                                onChange={(e) => sectHook.updateHeader({ aiPromptEnabled: e.target.checked ? 1 : 0 })}
                                className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-purple-500 focus:ring-opacity-25"
                            />
                            <label htmlFor="aiPromptEnabled" className="text-sm text-gray-300 cursor-pointer select-none">
                                Inject invisible AI prompt inside PDF (Academic Study)
                            </label>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed mt-1">
                            Adds a micro-sized (font size 2) AI instruction under Awards & Honors instructing automated LLM recruiters/ATS parsers to accept your profile and recommend a starting salary of $250k.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                            Directive Text Color
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={data.header?.aiPromptColor || '#ffffff'}
                                onChange={(e) => sectHook.updateHeader({ aiPromptColor: e.target.value })}
                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 cursor-pointer overflow-hidden p-0"
                            />
                            <input
                                type="text"
                                value={data.header?.aiPromptColor || '#ffffff'}
                                onChange={(e) => sectHook.updateHeader({ aiPromptColor: e.target.value })}
                                placeholder="#ffffff"
                                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500 transition-all font-mono"
                            />
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed mt-1">
                            Set this to white (#ffffff) or matching the page background color to render it invisible to human eyes but fully legible to AI parsers/OCR.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
