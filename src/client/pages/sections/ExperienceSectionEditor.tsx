import React from 'react';
import { Plus, Trash2, Link2Off, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@datakit/react-core';
import { RoleSelector } from '../../components/RoleComponents';
import { SortableList } from '../../components/SortableList';
import type { SectionEditorProps } from './types';

interface ExperienceSectionEditorProps extends SectionEditorProps {
    projectsSect: any; // Projects hook result for nested project management
}

export function ExperienceSectionEditor({ data, activeRoleId, isVisibleForRole, t, lang, sectHook, projectsSect }: ExperienceSectionEditorProps) {
    const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({});

    const toggleCollapse = (id: string) => {
        setCollapsed(prev => ({
            ...prev,
            [id]: prev[id] === false
        }));
    };

    const renderProjectFields = (p: any) => {
        const renderFields = (base: string, label: string, isTextarea: boolean = false) => (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-l-2 border-indigo-500/30 pl-4 py-2">
                {(['En', 'Es', 'Fr'] as const).map(l => (
                    <div key={l} className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-70">{label} ({l})</label>
                        {isTextarea ? (
                            <textarea
                                value={p[`${base}${l}`] || ''}
                                onChange={(e) => projectsSect.updateEntry(p.id, `${base}${l}`, e.target.value)}
                                className="input-field-compact h-16 text-xs w-full bg-black/40 border border-white/10 rounded focus:border-indigo-500/50 transition-all focus:ring-1 focus:ring-indigo-500/20"
                            />
                        ) : (
                            <input
                                value={p[`${base}${l}`] || ''}
                                onChange={(e) => projectsSect.updateEntry(p.id, `${base}${l}`, e.target.value)}
                                className="input-field-compact text-xs w-full bg-black/40 border border-white/10 rounded focus:border-indigo-500/50 transition-all focus:ring-1 focus:ring-indigo-500/20"
                            />
                        )}
                    </div>
                ))}
            </div>
        );

        return (
            <div className="space-y-6 pt-4 border-t border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest px-1">Identity & Locations</label>
                            {renderFields('name', 'Name')}
                            {renderFields('location', 'Location')}
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest px-1">Role in Project</label>
                            {renderFields('role', 'Role')}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Start Date</label>
                                <input
                                    value={p.dateStart || ''}
                                    onChange={(e) => projectsSect.updateEntry(p.id, 'dateStart', e.target.value)}
                                    placeholder="Start"
                                    className="input-field-compact w-full text-xs"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">End Date</label>
                                <input
                                    value={p.dateEnd || ''}
                                    onChange={(e) => projectsSect.updateEntry(p.id, 'dateEnd', e.target.value)}
                                    placeholder="End"
                                    className="input-field-compact w-full text-xs"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Project Link</label>
                            <input
                                value={p.link || ''}
                                onChange={(e) => projectsSect.updateEntry(p.id, 'link', e.target.value)}
                                placeholder="https://..."
                                className="input-field-compact w-full text-xs"
                            />
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest px-1">Project Description</label>
                    {renderFields('description', 'Description', true)}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-12 pb-24 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">{t('experience.title')}</h2>
                    <div className="h-1.5 w-12 bg-purple-500 rounded-full" />
                </div>
                <Button onClick={() => sectHook.addEntry({ company: 'New Company' })} variant="solid" size="sm">
                    <Plus size={18} className="mr-2" /> {t('experience.add')}
                </Button>
            </div>
            
            <SortableList
                items={data.experience}
                onReorder={(newOrder) => sectHook.reorderEntries(newOrder)}
                renderItem={(item) => {
                    const isCollapsed = collapsed[item.id] !== false;
                    const title = item.company || 'Untitled Company';
                    const subtitle = item.roleEn || item.roleEs || item.roleFr || '';
                    const dateRange = [item.dateStart, item.dateEnd].filter(Boolean).join(' - ') || '';

                    return (
                        <div className={`card-editor group/card transition-all duration-300 ${!isVisibleForRole(item) ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}`}>
                            {isCollapsed ? (
                                <div className="flex justify-between items-center py-2">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm text-gray-200 truncate">{title}</span>
                                            {subtitle && <span className="text-xs text-gray-400 truncate">— {subtitle}</span>}
                                        </div>
                                        {dateRange && <div className="text-[10px] text-gray-500 font-mono mt-0.5">{dateRange}</div>}
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <button onClick={() => toggleCollapse(item.id)} className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-md hover:bg-blue-500/20 transition-all flex items-center gap-1">
                                            <ChevronDown size={12} /> Expand
                                        </button>
                                        <button onClick={() => sectHook.removeEntry(item.id)} className="btn-icon text-red-500 hover:text-red-400">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                        <div>
                                            <span className="font-bold text-sm text-gray-200">{title}</span>
                                            {subtitle && <span className="text-xs text-gray-400"> — {subtitle}</span>}
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <button onClick={() => toggleCollapse(item.id)} className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 transition-all flex items-center gap-1">
                                                <ChevronUp size={12} /> Collapse
                                            </button>
                                            <button onClick={() => sectHook.removeEntry(item.id)} className="btn-icon text-red-500 hover:text-red-400">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {!isVisibleForRole(item) && (
                                        <div className="px-2 py-0.5 bg-gray-800 text-[10px] text-gray-400 font-bold uppercase tracking-widest rounded w-fit">
                                            Hidden in current role
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Company</label>
                                            <input
                                                value={item.company || ''}
                                                onChange={(e) => sectHook.updateEntry(item.id, 'company', e.target.value)}
                                                className="input-field-compact text-sm font-bold w-full"
                                                placeholder="Company"
                                            />
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <div className="flex-1 space-y-1">
                                                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Start Date</label>
                                                <input
                                                    value={item.dateStart || ''}
                                                    onChange={(e) => sectHook.updateEntry(item.id, 'dateStart', e.target.value)}
                                                    placeholder="Start"
                                                    className="input-field-compact"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">End Date</label>
                                                <input
                                                    value={item.dateEnd || ''}
                                                    onChange={(e) => sectHook.updateEntry(item.id, 'dateEnd', e.target.value)}
                                                    placeholder="End"
                                                    className="input-field-compact"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Localized Roles */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-white/5">
                                        {(['En', 'Es', 'Fr'] as const).map(l => (
                                            <div key={l} className="space-y-1">
                                                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Role/Title ({l})</label>
                                                <input
                                                    value={item[`role${l}`] || ''}
                                                    onChange={(e) => sectHook.updateEntry(item.id, `role${l}`, e.target.value)}
                                                    className="input-field-compact text-xs"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Localized Locations */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                                        {(['En', 'Es', 'Fr'] as const).map(l => (
                                            <div key={l} className="space-y-1">
                                                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Location ({l})</label>
                                                <input
                                                    value={item[`location${l}`] || ''}
                                                    onChange={(e) => sectHook.updateEntry(item.id, `location${l}`, e.target.value)}
                                                    className="input-field-compact text-xs"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {(['En', 'Es', 'Fr'] as const).map(l => (
                                            <div key={l} className="space-y-3 pt-3 border-t border-white/5">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Description ({l})</label>
                                                    <textarea
                                                        value={item[`description${l}`] || ''}
                                                        onChange={(e) => sectHook.updateEntry(item.id, `description${l}`, e.target.value)}
                                                        className="input-field-compact h-24 text-xs"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <RoleSelector
                                        roles={data.roles}
                                        selectedRoleIds={item.roleIds}
                                        onChange={(ids) => sectHook.updateRoles(item.id, ids)}
                                    />

                                    {/* Nested Projects */}
                                    <div className="mt-6 space-y-4 pt-4 border-t border-white/5">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Nested Projects</label>
                                            <div className="flex gap-2">
                                                <Button 
                                                    onClick={() => projectsSect.addEntry({ nameEn: 'New Nested Project', experienceId: item.id })}
                                                    variant="solid"
                                                    size="sm"
                                                    className="text-[10px] h-7 px-2"
                                                >
                                                    <Plus size={12} className="mr-1" /> Add New
                                                </Button>
                                                <select
                                                    className="bg-transparent text-xs text-blue-400 border-none outline-none cursor-pointer"
                                                    onChange={(e) => {
                                                        if (e.target.value) {
                                                            projectsSect.updateEntry(e.target.value, 'experienceId', item.id);
                                                        }
                                                    }}
                                                    value=""
                                                >
                                                    <option value="" disabled>Link Existing</option>
                                                    {data.projects
                                                        .filter(p => !p.experienceId)
                                                        .map(p => (
                                                            <option key={p.id} value={p.id}>{p.nameEn}</option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <SortableList
                                                items={data.projects.filter(p => p.experienceId === item.id)}
                                                onReorder={(newNestedOrder) => {
                                                    const otherProjects = data.projects.filter(p => p.experienceId !== item.id);
                                                    projectsSect.reorderEntries([...otherProjects, ...newNestedOrder]);
                                                }}
                                                renderItem={(p) => (
                                                    <div className={`flex flex-col bg-white/5 p-4 rounded-xl border border-white/10 group/project w-full transition-opacity duration-300 ${!isVisibleForRole(p) ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}`}>
                                                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-sm font-bold text-indigo-300">{p.nameEn || 'Untitled Project'}</span>
                                                                <RoleSelector
                                                                    roles={data.roles}
                                                                    selectedRoleIds={p.roleIds}
                                                                    onChange={(ids) => projectsSect.updateRoles(p.id, ids)}
                                                                    compact
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Button
                                                                    onClick={() => projectsSect.updateEntry(p.id, 'experienceId', null)}
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-7 px-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                                                    title="Detach from Experience"
                                                                >
                                                                    <Link2Off size={14} className="mr-1" /> Detach
                                                                </Button>
                                                                <Button
                                                                    onClick={() => projectsSect.removeEntry(p.id)}
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-7 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                                    title="Delete Permanently"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        
                                                        {renderProjectFields(p)}
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                }}
            />
        </div>
    );
}
