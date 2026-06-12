import React from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { SortableList } from '../../components/SortableList';
import { RoleSelector } from '../../components/RoleComponents';

interface HobbiesSectionEditorProps {
    data: any;
    activeRoleId: string;
    isVisibleForRole: (item: any) => boolean;
    t: (key: string, opts?: any) => string;
    lang: string;
    sectHook: any;
}

export function HobbiesSectionEditor({ data, activeRoleId, isVisibleForRole, t, lang, sectHook }: HobbiesSectionEditorProps) {
    const hobbies = data.hobbies || [];
    const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({});

    const toggleCollapse = (id: string) => {
        setCollapsed(prev => ({
            ...prev,
            [id]: prev[id] === false
        }));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">{t('hobbies.title')}</h2>
                    <p className="text-gray-400 text-sm">Add your personal interests and hobbies to your profile.</p>
                    <div className="h-1.5 w-12 bg-blue-500 rounded-full" />
                </div>
                <button
                    onClick={() => sectHook.addEntry({
                        nameEn: '', nameEs: '', nameFr: '',
                        descriptionEn: '', descriptionEs: '', descriptionFr: '',
                        roleIds: 'all'
                    })}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                    <Plus size={18} />
                    <span>{t('hobbies.add')}</span>
                </button>
            </div>

            <SortableList
                items={hobbies}
                onReorder={(newOrder) => sectHook.reorderEntries(newOrder)}
                renderItem={(hobby: any) => {
                    const isVisible = isVisibleForRole(hobby);
                    const isCollapsed = collapsed[hobby.id] !== false;
                    const title = hobby.nameEn || hobby.nameEs || hobby.nameFr || 'Untitled Hobby';
                    const subtitle = hobby.descriptionEn || hobby.descriptionEs || hobby.descriptionFr || '';

                    return (
                        <div className={`group relative p-6 rounded-2xl border transition-all duration-300 ${
                            isVisible 
                            ? 'bg-white/5 border-white/10 hover:border-blue-500/30' 
                            : 'bg-black/20 border-white/5 opacity-50 grayscale'
                        }`}>
                            {isCollapsed ? (
                                <div className="flex gap-6 items-center">
                                    <div>
                                        <GripVertical size={20} className="text-gray-600 cursor-grab active:cursor-grabbing group-hover:text-gray-400 transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm text-gray-200 truncate">{title}</span>
                                            {subtitle && <span className="text-xs text-gray-400 truncate">— {subtitle}</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <button onClick={() => toggleCollapse(hobby.id)} className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-md hover:bg-blue-500/20 transition-all flex items-center gap-1">
                                            <ChevronDown size={12} /> Expand
                                        </button>
                                        <button onClick={() => sectHook.removeEntry(hobby.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-6">
                                    <div className="mt-1">
                                        <GripVertical size={20} className="text-gray-600 cursor-grab active:cursor-grabbing group-hover:text-gray-400 transition-colors" />
                                    </div>

                                    <div className="flex-1 space-y-6">
                                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                            <div>
                                                <span className="font-bold text-sm text-gray-200">{title}</span>
                                            </div>
                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                <button onClick={() => toggleCollapse(hobby.id)} className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 transition-all flex items-center gap-1">
                                                    <ChevronUp size={12} /> Collapse
                                                </button>
                                                <button onClick={() => sectHook.removeEntry(hobby.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Name (EN)</label>
                                                <input
                                                    value={hobby.nameEn || ''}
                                                    onChange={(e) => sectHook.updateEntry(hobby.id, 'nameEn', e.target.value)}
                                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500/50 transition-all outline-none"
                                                    placeholder="e.g. Photography"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Nombre (ES)</label>
                                                <input
                                                    value={hobby.nameEs || ''}
                                                    onChange={(e) => sectHook.updateEntry(hobby.id, 'nameEs', e.target.value)}
                                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500/50 transition-all outline-none"
                                                    placeholder="Ej. Fotografía"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Nom (FR)</label>
                                                <input
                                                    value={hobby.nameFr || ''}
                                                    onChange={(e) => sectHook.updateEntry(hobby.id, 'nameFr', e.target.value)}
                                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500/50 transition-all outline-none"
                                                    placeholder="Ex. Photographie"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Description (EN)</label>
                                                <textarea
                                                    value={hobby.descriptionEn || ''}
                                                    onChange={(e) => sectHook.updateEntry(hobby.id, 'descriptionEn', e.target.value)}
                                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500/50 transition-all outline-none min-h-[80px]"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Descripción (ES)</label>
                                                <textarea
                                                    value={hobby.descriptionEs || ''}
                                                    onChange={(e) => sectHook.updateEntry(hobby.id, 'descriptionEs', e.target.value)}
                                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500/50 transition-all outline-none min-h-[80px]"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Description (FR)</label>
                                                <textarea
                                                    value={hobby.descriptionFr || ''}
                                                    onChange={(e) => sectHook.updateEntry(hobby.id, 'descriptionFr', e.target.value)}
                                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500/50 transition-all outline-none min-h-[80px]"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex-1 max-w-xs">
                                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1 mb-2 block">Role Visibility</label>
                                                <RoleSelector
                                                    roles={data.roles}
                                                    selectedRoleIds={hobby.roleIds}
                                                    onChange={(ids) => sectHook.updateRoles(hobby.id, ids)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                }}
            />

            {hobbies.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                        <Plus className="text-gray-600" />
                    </div>
                    <p className="text-gray-500 font-medium">No hobbies added yet.</p>
                    <button
                        onClick={() => sectHook.addEntry({
                            nameEn: '', nameEs: '', nameFr: '',
                            descriptionEn: '', descriptionEs: '', descriptionFr: '',
                            roleIds: 'all'
                        })}
                        className="mt-4 text-blue-400 hover:text-blue-300 font-bold text-sm"
                    >
                        {t('hobbies.add')}
                    </button>
                </div>
            )}
        </div>
    );
}
