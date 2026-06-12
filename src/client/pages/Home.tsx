import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { useMachine } from '@xstate/react';
import { cvMachine } from '@/lib/cvMachine';
import {
    Sidebar,
    PDFPreviewPanel, Button,
    DEFAULT_HARVARD_THEME,
    type CVData,
    type CVThemeConfig,
} from '@datakit/react-core';

import { LocalPDFPreviewPanel, CVDocument } from '../components/LocalPDFPreviewPanel';
import { BlobProvider } from '@react-pdf/renderer';
import { Login, useAuth } from '@datakit/cloudflare-login';
import { RoleManager } from '../components/RoleComponents';
import { Plus, Trash2, GripVertical, RefreshCw, ChevronLeft, ChevronRight, Download, Globe, LogOut, Layout } from 'lucide-react';
import { useCVSection } from '../hooks/useCVSection';
import { TimelineView } from '../components/TimelineView';
import { CVCodeEditor } from '../components/CVCodeEditor';
import * as api from '../api';
import { mapCVDataToPreview, isVisibleForRole } from '../utils/cvMapping';

// New Section Editors
import { HeaderSectionEditor } from './sections/HeaderSectionEditor';
import { EducationSectionEditor } from './sections/EducationSectionEditor';
import { ExperienceSectionEditor } from './sections/ExperienceSectionEditor';
import { SkillsSectionEditor } from './sections/SkillsSectionEditor';
import { ProjectsSectionEditor } from './sections/ProjectsSectionEditor';
import { LeadershipSectionEditor } from './sections/LeadershipSectionEditor';
import { CertificatesSectionEditor } from './sections/CertificatesSectionEditor';
import { LanguagesSectionEditor } from './sections/LanguagesSectionEditor';
import { AwardsSectionEditor } from './sections/AwardsSectionEditor';
import { HobbiesSectionEditor } from './sections/HobbiesSectionEditor';
import { LayoutManager } from './sections/LayoutManager';
import { ThemeSectionEditor } from './sections/ThemeSectionEditor';

type SectionId = 'roles' | 'header' | 'education' | 'skills' | 'experience' | 'leadership' | 'certificates' | 'languages' | 'projects' | 'awards' | 'hobbies' | 'timeline' | 'code' | 'layout' | 'theme';

const sections: { id: SectionId; icon: string }[] = [
    { id: 'roles', icon: '👥' },
    { id: 'header', icon: '👤' },
    { id: 'education', icon: '🎓' },
    { id: 'skills', icon: '💻' },
    { id: 'experience', icon: '💼' },
    { id: 'projects', icon: '📁' },
    { id: 'leadership', icon: '🏆' },
    { id: 'certificates', icon: '📜' },
    { id: 'languages', icon: '🌐' },
    { id: 'awards', icon: '🏅' },
    { id: 'hobbies', icon: '⛺' },
    { id: 'layout', icon: '🏗️' },
    { id: 'theme', icon: '🎨' },
    { id: 'timeline', icon: '📅' },
    { id: 'code', icon: '⌨️' },
];

export default function Home() {
    const { t, i18n } = useTranslation();
    const { 
        isAuthenticated, 
        login, 
        logout, 
        isLoading, 
        error, 
        clearError, 
        defaultEmail 
    } = useAuth();
    
    const [state, send] = useMachine(cvMachine);
    const [activeSection, setActiveSection] = useState<SectionId>('roles');
    const [showPreview, setShowPreview] = useState(true);
    const [activeRoleId, setActiveRoleId] = useState<string>(() => {
        return localStorage.getItem('activeRoleId') || 'all';
    });

    const [themeConfig, setThemeConfig] = useState<CVThemeConfig>(() => {
        const saved = localStorage.getItem('cvThemeConfig');
        return saved ? JSON.parse(saved) : DEFAULT_HARVARD_THEME;
    });

    useEffect(() => {
        localStorage.setItem('cvThemeConfig', JSON.stringify(themeConfig));
    }, [themeConfig]);

    useEffect(() => {
        localStorage.setItem('activeRoleId', activeRoleId);
    }, [activeRoleId]);

    // PDF Preview panel resizer
    const [previewWidth, setPreviewWidth] = useState<number>(() => {
        const saved = localStorage.getItem('cvPreviewWidth');
        return saved ? parseInt(saved, 10) : 600;
    });
    const [isDragging, setIsDragging] = useState(false);
    const [timelineLayoutMode, setTimelineLayoutMode] = useState<'normal' | 'bottom' | 'fullscreen'>('normal');

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            const containerWidth = window.innerWidth;
            const newWidth = containerWidth - e.clientX;
            // Limit width between 300px and 70% of screen width
            if (newWidth > 300 && newWidth < containerWidth * 0.7) {
                setPreviewWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            localStorage.setItem('cvPreviewWidth', previewWidth.toString());
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, previewWidth]);

    const data = state.context.data;

    // CRUD hooks for all sections
    const educationSect = useCVSection('education', send, data);
    const experienceSect = useCVSection('experience', send, data);
    const projectsSect = useCVSection('projects', send, data);
    const skillsSect = useCVSection('skills', send, data);
    const leadershipSect = useCVSection('leadership', send, data);
    const certificatesSect = useCVSection('certificates', send, data);
    const languagesSect = useCVSection('languages', send, data);
    const awardsSect = useCVSection('awards', send, data);
    const hobbiesSect = useCVSection('hobbies', send, data);

    // Initial Load
    useEffect(() => {
        if (isAuthenticated) {
            const loadInitial = async () => {
                try {
                    const initialData = await api.fetchAllCVData();
                    send({ type: 'LOAD_DATA', data: initialData });
                } catch (err) {
                    console.error("Failed to load CV data:", err);
                }
            };
            loadInitial();
        }
    }, [send, isAuthenticated]);


    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const fileNameBase = useMemo(() => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const localeMap: Record<string, string> = { en: 'EN-US', es: 'ES-ES', fr: 'FR-FR' };
        const langCode = localeMap[i18n.language.toLowerCase()] || i18n.language.toUpperCase();
        return `Daniel_Tarazona_${langCode}_${year}_${month}_${day}`;
    }, [i18n.language]);

    const handleExport = async (format: 'json' | 'yaml' | 'pdf') => {
        if (!data) return;

        if (format === 'json') {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${fileNameBase}.json`;
            a.click();
        } else if (format === 'yaml') {
            const yaml = await import('js-yaml');
            const blob = new Blob([yaml.dump(data)], { type: 'text/yaml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${fileNameBase}.yaml`;
            a.click();
        } else if (format === 'pdf') {
            const originalTitle = document.title;
            document.title = fileNameBase;
            window.print();
            // Restore title after a short delay
            setTimeout(() => {
                document.title = originalTitle;
            }, 1000);
        }
    };

    const isVisibleForRoleWithContext = useCallback((item: any) => {
        return isVisibleForRole(item, activeRoleId);
    }, [activeRoleId]);

    const mappedPreviewData = useMemo(() => {
        if (!data) return null;
        return mapCVDataToPreview(data, activeRoleId, i18n.language);
    }, [data, i18n.language, activeRoleId]);

    const [debouncedPreviewData, setDebouncedPreviewData] = useState(mappedPreviewData);
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedPreviewData(mappedPreviewData);
        }, 800); // 800ms debounce for heavy PDF rendering
        return () => clearTimeout(timer);
    }, [mappedPreviewData]);

    const doc = useMemo(() => {
        if (!debouncedPreviewData) return null;
        return (
            <CVDocument
                data={debouncedPreviewData}
                labels={{
                    preview: t('common.preview'),
                    resume: t('common.resume'),
                    experience: t('experience.title'),
                    education: t('education.title'),
                    skills: t('skills.title'),
                    leadership: t('leadership.title'),
                    certificates: t('certificates.title'),
                    projects: t('projects.title'),
                    awards: t('awards.title'),
                    hobbies: t('hobbies.title'),
                    programming: t('skills.programming'),
                    design: t('skills.design'),
                    tools: t('skills.tools'),
                }}
                theme={themeConfig}
                lang={i18n.language}
            />
        );
    }, [debouncedPreviewData, themeConfig, i18n.language, t]);

    // Show loading spinner if auth status is unknown, but add a timeout fallback
    const [authTimedOut, setAuthTimedOut] = useState(false);
    useEffect(() => {
        if (isAuthenticated === null) {
            const timer = setTimeout(() => setAuthTimedOut(true), 5000);
            return () => clearTimeout(timer);
        } else {
            setAuthTimedOut(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        console.log('[Auth Debug]', { isAuthenticated, isLoading, error, authTimedOut });
    }, [isAuthenticated, isLoading, error, authTimedOut]);

    if (isAuthenticated === null && !authTimedOut) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-950 text-white font-mono animate-pulse gap-6">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="uppercase tracking-[4px] text-xs opacity-50">Initializing Secure Session...</span>
            </div>
        );
    }

    if (!isAuthenticated || authTimedOut) return (
        <div className="h-screen bg-gray-950">
            <Login 
                onLogin={login} 
                isLoading={isLoading} 
                error={authTimedOut ? "Authentication session timed out. Please check your credentials and try again." : error} 
                onClearError={() => {
                    clearError();
                    setAuthTimedOut(false);
                }} 
                defaultEmail={defaultEmail}
            />
        </div>
    );
    if (!data) return <div className="h-screen flex items-center justify-center bg-gray-950 text-white font-mono animate-pulse">Loading DataCore...</div>;

    const renderContent = (url: string | null, loading: boolean) => (
        <>
            {/* Custom Toolbar */}
            <header className="h-14 border-b border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <span className="font-bold text-sm">DK</span>
                        </div>
                        <h1 className="text-sm font-bold tracking-tight text-gray-200">DataKit CV Editor</h1>
                    </div>
                    <div className="h-6 w-px bg-white/10 mx-2" />
                    <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Active Role:</span>
                        <span className="ml-2 text-xs font-medium text-blue-200">
                            {data.roles.find((r: any) => r.id === activeRoleId)?.name || 'All Profiles'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* PDF Download Button */}
                    {url && !loading && (
                        <a
                            href={url}
                            download={`${fileNameBase}.pdf`}
                            className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl transition-all"
                        >
                            <Download size={12} />
                            Download
                        </a>
                    )}

                    {/* Exports */}
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
                        {(['json', 'yaml', 'pdf'] as const).map(fmt => (
                            <button
                                key={fmt}
                                onClick={() => handleExport(fmt)}
                                className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            >
                                {fmt}
                            </button>
                        ))}
                    </div>

                    {/* Languages */}
                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2 py-1">
                        {[
                            { code: 'en', flag: '🇺🇸' },
                            { code: 'es', flag: '🇪🇸' },
                            { code: 'fr', flag: '🇫🇷' }
                        ].map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                                    i18n.language === lang.code ? 'bg-white/10 shadow-inner' : 'hover:bg-white/5 opacity-50'
                                }`}
                                title={lang.code.toUpperCase()}
                            >
                                <span className="text-lg">{lang.flag}</span>
                            </button>
                        ))}
                    </div>

                    <button onClick={() => logout()} className="flex items-center justify-center w-9 h-9 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors" title="Logout">
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Main Workspace: Sidebar + Editor/Preview */}
                <div className="flex-1 flex overflow-hidden">
                    <Sidebar>
                        <Sidebar.Content>
                            {sections.map(s => (
                                <Sidebar.Item
                                    key={s.id}
                                    active={activeSection === s.id}
                                    onClick={() => setActiveSection(s.id)}
                                    icon={<span className="text-lg">{s.icon}</span>}
                                >
                                    <span className="capitalize">{s.id}</span>
                                </Sidebar.Item>
                            ))}
                        </Sidebar.Content>
                    </Sidebar>

                    <div className="flex-1 flex overflow-hidden">
                        <motion.div
                            layout
                            className="flex-1 overflow-y-auto bg-gray-950 px-12 pt-12 custom-scrollbar relative"
                        >
                            {/* Editor View */}
                            <div className="max-w-4xl mx-auto pb-32">
                                {(() => {
                                    const props = { data, activeRoleId, isVisibleForRole: isVisibleForRoleWithContext, t, lang: i18n.language };
                                    switch (activeSection) {
                                        case 'roles': return (
                                            <RoleManager
                                                roles={data.roles}
                                                activeRoleId={activeRoleId}
                                                onActiveRoleChange={setActiveRoleId}
                                                onCreateRole={async (name, jobTitle) => {
                                                    const { id } = await api.createRole(name, jobTitle);
                                                    const newRole = { id, name, jobTitle, sortOrder: data.roles.length };
                                                    send({ type: 'UPDATE_ROLES', roles: [...data.roles, newRole] });
                                                }}
                                                onDeleteRole={async (id) => {
                                                    try {
                                                        await api.deleteRole(id);
                                                        send({ type: 'UPDATE_ROLES', roles: data.roles.filter(r => r.id !== id) });
                                                        if (activeRoleId === id) setActiveRoleId('all');
                                                    } catch (err) {
                                                        console.error(`Failed to delete role ${id}:`, err);
                                                        alert("Failed to delete role. Please ensure you are connected and try again.");
                                                    }
                                                }}
                                                onUpdateRole={async (id, updates) => {
                                                    await api.updateRole(id, updates);
                                                    send({
                                                        type: 'UPDATE_ROLES',
                                                        roles: data.roles.map(r => r.id === id ? { ...r, ...updates } : r)
                                                    });
                                                }}
                                            />
                                        );
                                        case 'header': return (
                                            <HeaderSectionEditor 
                                                {...props} 
                                                sectHook={{
                                                    ...api,
                                                    updateHeader: async (updates: any) => {
                                                        Object.entries(updates).forEach(([field, value]) => {
                                                            send({ type: 'UPDATE_HEADER', field: field as keyof api.CVHeaderData, value: value as string });
                                                        });
                                                        api.debouncedUpdateHeader(updates);
                                                    }
                                                }} 
                                            />
                                        );
                                        case 'education': return <EducationSectionEditor {...props} sectHook={educationSect} />;
                                        case 'experience': return <ExperienceSectionEditor {...props} sectHook={experienceSect} projectsSect={projectsSect} />;
                                        case 'skills': return <SkillsSectionEditor {...props} sectHook={skillsSect} />;
                                        case 'projects': return <ProjectsSectionEditor {...props} sectHook={projectsSect} />;
                                        case 'leadership': return <LeadershipSectionEditor {...props} sectHook={leadershipSect} />;
                                        case 'certificates': return <CertificatesSectionEditor {...props} sectHook={certificatesSect} />;
                                        case 'languages': return <LanguagesSectionEditor {...props} sectHook={languagesSect} />;
                                        case 'awards': return <AwardsSectionEditor {...props} sectHook={awardsSect} />;
                                        case 'hobbies': return <HobbiesSectionEditor {...props} sectHook={hobbiesSect} />;
                                        case 'layout': return (
                                            <LayoutManager 
                                                data={data} 
                                                t={t} 
                                                onReorder={(newOrder) => {
                                                    send({ type: 'REORDER_SECTIONS', sections: newOrder });
                                                    api.reorderSections(newOrder);
                                                }} 
                                            />
                                        );
                                        case 'timeline': {
                                            if (timelineLayoutMode === 'bottom') {
                                                return (
                                                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/[0.02] text-center max-w-lg mx-auto">
                                                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 text-blue-400">
                                                            <Layout size={24} />
                                                        </div>
                                                        <h3 className="text-lg font-bold mb-2">Timeline is Docked at the Bottom</h3>
                                                        <p className="text-sm text-gray-400 mb-6 px-4">
                                                            The timeline is currently visible in the bottom panel of your workspace so you can edit and view it simultaneously.
                                                        </p>
                                                        <Button 
                                                            onClick={() => setTimelineLayoutMode('normal')} 
                                                            variant="solid" 
                                                            size="sm"
                                                        >
                                                            Restore to Normal View
                                                        </Button>
                                                    </div>
                                                );
                                            }
                                            return (
                                                <TimelineView 
                                                    experience={data.experience} 
                                                    education={data.education}
                                                    projects={data.projects}
                                                    leadership={data.leadership}
                                                    certificates={data.certificates}
                                                    activeRoleId={activeRoleId}
                                                    layoutMode="normal"
                                                    onChangeLayoutMode={setTimelineLayoutMode}
                                                />
                                            );
                                        }
                                        case 'code': return (
                                            <CVCodeEditor
                                                data={data}
                                                onUpdate={(updatedData) => send({ type: 'LOAD_DATA', data: updatedData })}
                                            />
                                        );
                                        case 'theme': return (
                                            <ThemeSectionEditor 
                                                theme={themeConfig} 
                                                onChange={setThemeConfig} 
                                            />
                                        );
                                        default: return null;
                                    }
                                })()}
                            </div>
                        </motion.div>

                        {/* Draggable Divider */}
                        {showPreview && (
                            <div
                                onMouseDown={handleMouseDown}
                                className={`w-1.5 hover:w-2 cursor-col-resize self-stretch z-40 transition-colors relative flex items-center justify-center ${
                                    isDragging ? 'bg-blue-500' : 'bg-white/10 hover:bg-blue-500/50'
                                }`}
                            >
                                <div className="absolute w-1 h-8 rounded-full bg-white/20 pointer-events-none" />
                            </div>
                        )}

                        {showPreview && (
                            <div
                                style={{ width: `${previewWidth}px` }}
                                className="border-l border-white/10 overflow-hidden bg-white h-full relative"
                            >
                                <LocalPDFPreviewPanel 
                                    url={url} 
                                    loading={loading}
                                    fileName={`${fileNameBase}.pdf`}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Row Dashboard Panel */}
                {timelineLayoutMode === 'bottom' && (
                    <div className="h-[30vh] min-h-[220px] max-h-[400px] border-t border-white/10 bg-gray-950 flex flex-col overflow-hidden relative">
                        <TimelineView 
                            experience={data.experience} 
                            education={data.education}
                            projects={data.projects}
                            leadership={data.leadership}
                            certificates={data.certificates}
                            activeRoleId={activeRoleId}
                            layoutMode="bottom"
                            onChangeLayoutMode={setTimelineLayoutMode}
                        />
                    </div>
                )}
            </div>

            {/* Fullscreen Modal Overlay */}
            {timelineLayoutMode === 'fullscreen' && (
                <div className="fixed inset-0 z-50 bg-gray-950 overflow-hidden flex flex-col">
                    <TimelineView 
                        experience={data.experience} 
                        education={data.education}
                        projects={data.projects}
                        leadership={data.leadership}
                        certificates={data.certificates}
                        activeRoleId={activeRoleId}
                        layoutMode="fullscreen"
                        onChangeLayoutMode={setTimelineLayoutMode}
                    />
                </div>
            )}
        </>
    );

    return (
        <div className="h-screen flex flex-col bg-gray-950 text-white overflow-hidden selection:bg-blue-500/30">
            {doc ? (
                <BlobProvider document={doc}>
                    {({ url, loading }) => renderContent(url, loading)}
                </BlobProvider>
            ) : (
                renderContent(null, true)
            )}
        </div>
    );
}
