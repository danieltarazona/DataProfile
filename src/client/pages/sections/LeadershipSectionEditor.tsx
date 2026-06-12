import React from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@datakit/react-core';
import { RoleSelector } from '../../components/RoleComponents';
import { SortableList } from '../../components/SortableList';
import type { SectionEditorProps } from './types';

export function LeadershipSectionEditor({ data, activeRoleId, isVisibleForRole, t, lang, sectHook }: SectionEditorProps) {
    const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({});

    const toggleCollapse = (id: string) => {
        setCollapsed(prev => ({
            ...prev,
            [id]: prev[id] === false
        }));
    };

    return (
        <div className="space-y-12 pb-24 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">{t('leadership.title')}</h2>
                    <div className="h-1.5 w-12 bg-pink-500 rounded-full" />
                </div>
                <Button onClick={() => sectHook.addEntry({ organizationEn: 'New Org' })} variant="solid" size="sm">
                    <Plus size={18} className="mr-2" /> {t('leadership.add')}
                </Button>
            </div>
            
            <SortableList
                items={data.leadership}
                onReorder={(newOrder) => sectHook.reorderEntries(newOrder)}
                renderItem={(item) => {
                    const isCollapsed = collapsed[item.id] !== false;
                    const title = item.organizationEn || item.organizationEs || item.organizationFr || 'Untitled Organization';
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
                                        <div className="col-span-2">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-l-2 border-pink-500/20 pl-4 py-1">
                                                {(['En', 'Es', 'Fr'] as const).map(l => (
                                                    <div key={l} className="space-y-1">
                                                        <label className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Organization ({l})</label>
                                                        <input
                                                            value={item[`organization${l}`] || ''}
                                                            onChange={(e) => sectHook.updateEntry(item.id, `organization${l}`, e.target.value)}
                                                            className="input-field-compact text-xs w-full bg-white/5 border-white/10 rounded"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-4 col-span-2">
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
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-2">
                                            {(['En', 'Es', 'Fr'] as const).map(l => (
                                                <div key={l} className="space-y-1">
                                                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Location ({l})</label>
                                                    <input
                                                        value={item[`location${l}`] || ''}
                                                        onChange={(e) => sectHook.updateEntry(item.id, `location${l}`, e.target.value)}
                                                        className="input-field-compact"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {(['En', 'Es', 'Fr'] as const).map(l => (
                                            <div key={l} className="space-y-3 pt-3 border-t border-white/5">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Role ({l})</label>
                                                    <input
                                                        value={item[`role${l}`] || ''}
                                                        onChange={(e) => sectHook.updateEntry(item.id, `role${l}`, e.target.value)}
                                                        className="input-field-compact font-medium"
                                                    />
                                                </div>
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
                                </div>
                            )}
                        </div>
                    );
                }}
            />
        </div>
    );
}
