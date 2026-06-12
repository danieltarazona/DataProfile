import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import type { CVEntry } from '../api';
import { useTranslation } from 'react-i18next';

interface TimelineViewProps {
    experience: CVEntry[];
    education: CVEntry[];
    projects: CVEntry[];
    leadership: CVEntry[];
    certificates: CVEntry[];
    activeRoleId?: string;
    layoutMode?: 'normal' | 'bottom' | 'fullscreen';
    onChangeLayoutMode?: (mode: 'normal' | 'bottom' | 'fullscreen') => void;
}

export function TimelineView({ 
    experience = [], 
    education = [], 
    projects = [], 
    leadership = [], 
    certificates = [], 
    activeRoleId = 'all',
    layoutMode = 'normal',
    onChangeLayoutMode
}: TimelineViewProps) {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language || 'en';
    const langSuffix = currentLang.startsWith('es') ? 'Es' : currentLang.startsWith('fr') ? 'Fr' : 'En';

    const events = useMemo(() => {
        const isVisible = (it: CVEntry) => {
            if (activeRoleId === 'all') return true;
            if (!it.roleIds) return true;
            return it.roleIds.split(',').map(s => s.trim()).includes(activeRoleId) || it.roleIds.split(',').map(s => s.trim()).includes('all');
        };

        const extractYear = (dateStr: string | null | undefined): number | null => {
            if (!dateStr) return null;
            const match = dateStr.match(/\d{4}/);
            const lowercase = dateStr.toLowerCase();
            if (lowercase.includes('present') || lowercase.includes('actual') || lowercase.includes('présent') || lowercase.includes('hoy')) return new Date().getFullYear();
            return match ? parseInt(match[0]) : null;
        };

        const allItems = [
            ...experience.filter(isVisible).map(it => ({ ...it, type: 'experience' as const, color: 'bg-purple-500', label: it.company || 'Experience' })),
            ...education.filter(isVisible).map(it => ({ ...it, type: 'education' as const, color: 'bg-blue-500', label: it[`institution${langSuffix}`] || it.institutionEn || 'Education' })),
            ...projects.filter(isVisible).map(it => ({ ...it, type: 'projects' as const, color: 'bg-indigo-500', label: it[`name${langSuffix}`] || it.nameEn || 'Project' })),
            ...leadership.filter(isVisible).map(it => ({ ...it, type: 'leadership' as const, color: 'bg-pink-500', label: it[`organization${langSuffix}`] || it.organizationEn || 'Leadership' })),
            ...certificates.filter(isVisible).map(it => ({ ...it, type: 'certificates' as const, color: 'bg-orange-500', label: it[`name${langSuffix}`] || it.nameEn || 'Certificate' })),
        ];

        return allItems.map((ev: any) => {
            const startStr = ev.dateStart || ev.date;
            const endStr = ev.dateEnd || ev.date;
            
            const startYear = extractYear(startStr);
            let endYear = extractYear(endStr);
            
            if (startYear && !endYear) endYear = startYear + 0.5; // Single point items get half a year width
            if (startYear && endYear && startYear === endYear) endYear = startYear + 0.5;
            
            return {
                ...ev,
                startYear,
                endYear,
            };
        }).filter(e => e.startYear !== null) as any[];
    }, [experience, education, projects, leadership, certificates, activeRoleId, langSuffix]);

    const { minYear, maxYear } = useMemo(() => {
        if (events.length === 0) return { minYear: new Date().getFullYear() - 5, maxYear: new Date().getFullYear() };
        let min = Math.min(...events.map(e => e.startYear));
        let max = Math.max(...events.map(e => e.endYear || e.startYear));
        return { minYear: min, maxYear: Math.max(max + 1, min + 1) };
    }, [events]);

    const years = useMemo(() => {
        const y = [];
        for (let i = minYear; i <= maxYear; i++) y.push(i);
        return y;
    }, [minYear, maxYear]);

    const isBottomMode = layoutMode === 'bottom';

    if (events.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-gray-400 italic">
                {t('timeline.noData') || 'No activities found for the selected role.'}
            </div>
        );
    }

    return (
        <div className={`overflow-auto bg-gray-950/80 w-full h-full relative custom-scrollbar flex flex-col ${isBottomMode ? 'p-4 space-y-4' : 'p-8 space-y-8 min-h-screen'}`}>
            <div className="flex justify-between items-center flex-shrink-0">
                <div className="space-y-1">
                    {!isBottomMode && (
                        <>
                            <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Full Timeline</h2>
                            <div className="h-2 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                        </>
                    )}
                    {isBottomMode && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-widest text-gray-200">Timeline Dashboard</span>
                            <div className="h-1.5 w-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                        </div>
                    )}
                </div>

                {/* Layout controls */}
                {onChangeLayoutMode && (
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
                        <button 
                            onClick={() => onChangeLayoutMode('normal')}
                            className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all ${layoutMode === 'normal' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            title="Normal Tab View"
                        >
                            Standard
                        </button>
                        <button 
                            onClick={() => onChangeLayoutMode('bottom')}
                            className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all ${layoutMode === 'bottom' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            title="Dock Bottom"
                        >
                            Dock Bottom
                        </button>
                        <button 
                            onClick={() => onChangeLayoutMode('fullscreen')}
                            className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all ${layoutMode === 'fullscreen' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            title="Fullscreen Mode"
                        >
                            Fullscreen
                        </button>
                    </div>
                )}
            </div>

            <div className={`relative ${isBottomMode ? 'mt-4 pb-4' : 'mt-10 pb-20'} font-mono flex-1`}>
                {/* Legend */}
                <div className={`flex flex-wrap gap-4 ${isBottomMode ? 'mb-4' : 'mb-10'}`}>
                    {[
                        { label: 'Work', color: 'bg-purple-500' },
                        { label: 'Education', color: 'bg-blue-500' },
                        { label: 'Projects', color: 'bg-indigo-500' },
                        { label: 'Leadership', color: 'bg-pink-500' },
                        { label: 'Certs', color: 'bg-orange-500' },
                    ].map(item => (
                        <div key={item.label} className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{item.label}</span>
                        </div>
                    ))}
                </div>

                <div 
                    className="relative min-w-[1200px]"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${years.length}, minmax(120px, 1fr))`
                    }}
                >
                    {/* Background year stripes & labels */}
                    {years.map((year) => (
                        <div key={year} className={`relative border-l border-white/10 h-full ${isBottomMode ? 'min-h-[140px]' : 'min-h-[450px]'}`}>
                            <div className={`absolute left-2 text-xs font-black text-white/20 ${isBottomMode ? '-top-5' : '-top-8'}`}>
                                {year}
                            </div>
                        </div>
                    ))}

                    {/* Bars Container */}
                    <div className={`absolute top-0 left-0 right-0 flex flex-col ${isBottomMode ? 'pt-1 gap-1.5' : 'pt-4 gap-3.5'}`}>
                        {events.sort((a, b) => b.startYear - a.startYear || (b.endYear - a.endYear)).map((ev, idx) => {
                            const span = Math.max(0.5, (ev.endYear || ev.startYear) - ev.startYear);
                            const offset = ev.startYear - minYear;

                            return (
                                <motion.div
                                    key={ev.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.02 }}
                                    className={`relative flex items-center group ${isBottomMode ? 'h-7' : 'h-10'}`}
                                    style={{
                                        marginLeft: `calc(${offset} * (100% / ${years.length}))`,
                                        width: `calc(${span} * (100% / ${years.length}))`
                                    }}
                                >
                                    {/* The Gantt Bar */}
                                    <div className={`absolute inset-0 rounded-lg border ${ev.color.replace('bg-', 'bg-')}/20 ${ev.color.replace('bg-', 'border-')}/40 hover:${ev.color.replace('bg-', 'bg-')}/30 transition-all cursor-pointer backdrop-blur-md shadow-2xl flex items-center px-4 overflow-hidden group-hover:scale-[1.01] origin-left`} />
                                    
                                    <div className="relative z-10 truncate w-full px-1">
                                        <div className={`font-black text-white uppercase tracking-tighter truncate ${isBottomMode ? 'text-[9px]' : 'text-[10px]'}`}>
                                            {ev.label}
                                        </div>
                                    </div>

                                    {/* Advanced Tooltip */}
                                    <div className="absolute top-full left-0 mt-2 hidden group-hover:block z-50 bg-gray-900/95 border border-white/20 text-white rounded-xl p-4 w-72 backdrop-blur-xl shadow-2xl pointer-events-none">
                                        <div className={`text-[10px] font-black uppercase mb-2 tracking-[2px] ${ev.color.replace('bg-', 'text-')}`}>{ev.type}</div>
                                        <div className="font-bold text-sm mb-1">{ev.label}</div>
                                        <div className="text-gray-400 text-xs mb-3 line-clamp-2">
                                            {ev[`role${langSuffix}`] || ev.role || ev[`description${langSuffix}`] || ev.descriptionEn || ev[`degree${langSuffix}`] || ev.degreeEn || ''}
                                        </div>
                                        <div className="text-[10px] font-mono text-gray-500 bg-black/40 px-2 py-1 rounded w-fit">
                                            {ev.dateStart || ev.date} — {ev.dateEnd || 'Present'}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
