import React from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@datakit/react-core';
import { RoleSelector } from '../../components/RoleComponents';
import { SortableList } from '../../components/SortableList';
import type { SectionEditorProps } from './types';

export function AwardsSectionEditor({ data, activeRoleId, isVisibleForRole, t, lang, sectHook }: SectionEditorProps) {
    const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({});

    const toggleCollapse = (id: string) => {
        setCollapsed(prev => ({
            ...prev,
            [id]: prev[id] === false
        }));
    };

    const renderLocalizedFields = (item: any, baseField: string, label: string, isTextarea: boolean = false) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-l-2 border-amber-500/20 pl-4 py-1">
            {(['En', 'Es', 'Fr'] as const).map(l => (
                <div key={l} className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{label} ({l})</label>
                    {isTextarea ? (
                        <textarea
                            value={item[`${baseField}${l}`] || ''}
                            onChange={(e) => sectHook.updateEntry(item.id, `${baseField}${l}`, e.target.value)}
                            className="input-field-compact h-24 text-xs w-full bg-white/5 border-white/10 rounded"
                        />
                    ) : (
                        <input
                            value={item[`${baseField}${l}`] || ''}
                            onChange={(e) => sectHook.updateEntry(item.id, `${baseField}${l}`, e.target.value)}
                            className="input-field-compact text-xs w-full bg-white/5 border-white/10 rounded font-bold"
                        />
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="space-y-12 pb-24 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">{t('awards.title')}</h2>
                    <div className="h-1.5 w-12 bg-amber-500 rounded-full" />
                </div>
                <Button onClick={() => sectHook.addEntry({ nameEn: 'New Award' })} variant="solid" size="sm">
                    <Plus size={18} className="mr-2" /> {t('awards.add')}
                </Button>
            </div>
            
            <SortableList
                items={data.awards}
                onReorder={(newOrder) => sectHook.reorderEntries(newOrder)}
                renderItem={(item) => {
                    const isCollapsed = collapsed[item.id] !== false;
                    const title = item.nameEn || item.nameEs || item.nameFr || 'Untitled Award';
                    const subtitle = item.issuerEn || item.issuerEs || item.issuerFr || '';
                    const dateRange = item.date || '';

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

                                    {/* Header Info Row (Date) */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/5 p-3 rounded-lg border border-white/5">
                                        <div className="col-span-1">
                                            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Date</label>
                                            <input
                                                value={item.date || ''}
                                                onChange={(e) => sectHook.updateEntry(item.id, 'date', e.target.value)}
                                                placeholder="Dec 2018"
                                                className="input-field-compact w-full"
                                            />
                                        </div>
                                    </div>

                                    {/* Field Groups */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-amber-400 font-bold uppercase tracking-widest px-1">Award Name</label>
                                            {renderLocalizedFields(item, 'name', 'Name')}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] text-amber-400 font-bold uppercase tracking-widest px-1">Issuer</label>
                                            {renderLocalizedFields(item, 'issuer', 'Issuer')}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] text-amber-400 font-bold uppercase tracking-widest px-1">Location</label>
                                            {renderLocalizedFields(item, 'location', 'Location')}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] text-amber-400 font-bold uppercase tracking-widest px-1">Description</label>
                                            {renderLocalizedFields(item, 'description', 'Description', true)}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <RoleSelector
                                            roles={data.roles}
                                            selectedRoleIds={item.roleIds}
                                            onChange={(ids) => sectHook.updateRoles(item.id, ids)}
                                        />
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
