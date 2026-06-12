import React, { useCallback } from 'react';
import { GripVertical } from 'lucide-react';
import * as api from '../api';

/**
 * Expert-level hook for standardized CV section CRUD operations.
 * Handles API calls and provides a consistent interface for section components.
 */
export function useCVSection(section: keyof api.FullCVData, send: any, currentData: api.FullCVData | null) {
    const fetchLatest = useCallback(async () => {
        try {
            const all = await api.fetchAllCVData();
            send({ type: 'LOAD_DATA', data: all });
        } catch (err) {
            console.error(`Error refreshing ${section}:`, err);
        }
    }, [section, send]);

    const addEntry = useCallback(async (initialData: Record<string, any> = {}) => {
        try {
            await api.createEntry(section, { roleIds: 'all', ...initialData });
            await fetchLatest();
        } catch (err) {
            console.error(`Error adding to ${section}:`, err);
        }
    }, [section, fetchLatest]);

    const findEntryById = useCallback((id: string) => {
        if (!currentData) return null;
        const entries = currentData[section] as api.CVEntry[];
        return entries.find(e => e.id === id) || null;
    }, [currentData, section]);

    const updateEntry = useCallback(async (id: string, field: string, value: any) => {
        try {
            send({ type: 'UPDATE_ENTRY', section, id, field, value });
            api.debouncedUpdateEntry(section as string, id, field, value);
        } catch (err) {
            console.error(`Error updating ${section} ${id}:`, err);
            await fetchLatest();
        }
    }, [section, send, fetchLatest]);

    const updateRoles = useCallback(async (id: string, roleIds: string) => {
        try {
            send({ type: 'UPDATE_ENTRY_ROLES', section, id, roleIds });
            await api.updateEntry(section, id, { roleIds });
        } catch (err) {
            console.error(`Error updating roles for ${section} ${id}:`, err);
            await fetchLatest();
        }
    }, [section, send, fetchLatest]);

    const removeEntry = useCallback(async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this entry?')) return;
        try {
            send({ type: 'REMOVE_ENTRY', section, id });
            await api.deleteEntry(section, id);
        } catch (err) {
            console.error(`Error deleting from ${section} ${id}:`, err);
            await fetchLatest();
        }
    }, [section, send, fetchLatest]);

    const reorderEntries = useCallback(async (items: any[]) => {
        try {
            send({ type: 'REORDER_ENTRIES', section, items });
            const itemsWithOrder = items.map((it, idx) => ({ id: it.id, sortOrder: idx }));
            await api.reorderEntries(section, itemsWithOrder);
        } catch (err) {
            console.error(`Error reordering ${section}:`, err);
            await fetchLatest();
        }
    }, [section, send, fetchLatest]);

    const renderUI = (id: string, content: React.ReactNode) => (
        <section id={id} className="relative group">
            <div className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity section-drag-handle cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-white">
                <GripVertical size={20} />
            </div>
            {content}
        </section>
    );

    return {
        addEntry,
        updateEntry,
        updateRoles,
        removeEntry,
        reorderEntries,
        fetchLatest,
        renderUI,
        findEntryById
    };
}
