/**
 * API client for DataReactProfile CV CRUD operations.
 * Replaces localStorage with D1 via the Hono API.
 */

export interface CVRole {
    id: string;
    name: string;
    jobTitle: string;
    sortOrder: number;
}

export interface CVHeaderData {
    id: string;
    name: string;
    titleEn: string; titleEs: string; titleFr: string;
    location: string;
    locationEn: string; locationEs: string; locationFr: string;
    email: string; phone: string; github: string;
    linkedin: string; website: string;
    aiPromptEnabled: number;
    aiPromptColor: string;
}

export interface CVEntry {
    id: string;
    sortOrder: number;
    roleIds: string;
    [key: string]: any;
}

export interface CVLanguageEntry extends CVEntry {
    nameEn: string; nameEs: string; nameFr: string;
    level: string;
}

export interface CVSectionOrderEntry {
    id: string;
    sectionKey: string;
    sortOrder: number;
    visible: number;
}

export interface FullCVData {
    roles: CVRole[];
    header: CVHeaderData | null;
    education: CVEntry[];
    experience: CVEntry[];
    projects: CVEntry[];
    skills: CVEntry[];
    leadership: CVEntry[];
    certificates: CVEntry[];
    languages: CVLanguageEntry[];
    awards: CVEntry[];
    hobbies: CVEntry[];
    sectionOrder: CVSectionOrderEntry[];
}

const API_BASE = '/api/cv';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).error || `API error: ${res.status}`);
    }
    return res.json();
}

// ─── Full CV data ────────────────────────────────────────────
export async function fetchAllCVData(): Promise<FullCVData> {
    return apiFetch('/all');
}

// ─── Roles ───────────────────────────────────────────────────
export async function fetchRoles(): Promise<CVRole[]> {
    return apiFetch('/roles');
}

export async function createRole(name: string, jobTitle: string): Promise<{ id: string }> {
    return apiFetch('/roles', {
        method: 'POST',
        body: JSON.stringify({ name, jobTitle }),
    });
}

export async function deleteRole(id: string): Promise<void> {
    await apiFetch(`/roles/${id}`, { method: 'DELETE' });
}

export async function updateRole(id: string, data: Partial<CVRole>): Promise<void> {
    await apiFetch(`/roles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

// ─── Header ──────────────────────────────────────────────────
export async function updateHeader(data: Partial<CVHeaderData>): Promise<void> {
    await apiFetch('/header', {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

// ─── Generic CRUD ────────────────────────────────────────────
export async function createEntry(section: string, data: Record<string, any> = {}): Promise<{ id: string }> {
    return apiFetch(`/${section}`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateEntry(section: string, id: string, data: Record<string, any>): Promise<void> {
    await apiFetch(`/${section}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteEntry(section: string, id: string): Promise<void> {
    await apiFetch(`/${section}/${id}`, { method: 'DELETE' });
}

// ─── Reorder ─────────────────────────────────────────────────
export async function reorderEntries(section: string, items: { id: string; sortOrder: number }[]): Promise<void> {
    await apiFetch('/reorder', {
        method: 'PATCH',
        body: JSON.stringify({ section, items }),
    });
}

export async function reorderSections(items: { sectionKey: string; sortOrder: number; visible: number }[]): Promise<void> {
    await apiFetch('/reorder-sections', {
        method: 'PATCH',
        body: JSON.stringify({ items }),
    });
}

// ─── Migration ───────────────────────────────────────────────
export async function runMigration(): Promise<void> {
    await apiFetch('/migrate', { method: 'POST' });
}

// ─── Helper: get localized field ─────────────────────────────
export function getLocalizedField(entry: Record<string, any>, field: string, lang: string): string {
    const cleanLang = (lang || 'en').slice(0, 2).toLowerCase();
    const suffix = cleanLang === 'en' ? 'En' : cleanLang === 'es' ? 'Es' : 'Fr';
    return entry[`${field}${suffix}`] || entry[`${field}En`] || '';
}

export function setLocalizedField(field: string, lang: string): string {
    const cleanLang = (lang || 'en').slice(0, 2).toLowerCase();
    const suffix = cleanLang === 'en' ? 'En' : cleanLang === 'es' ? 'Es' : 'Fr';
    return `${field}${suffix}`;
}

// ─── Debounced Updates ────────────────────────────────────────
const pendingEntryUpdates: Record<string, Record<string, any>> = {};
const entryDebounceTimers: Record<string, any> = {};

export function debouncedUpdateEntry(
    section: string,
    id: string,
    field: string,
    value: any,
    onSuccess?: () => void
): void {
    const key = `${section}:${id}`;
    if (!pendingEntryUpdates[key]) {
        pendingEntryUpdates[key] = {};
    }
    pendingEntryUpdates[key][field] = value;

    if (entryDebounceTimers[key]) {
        clearTimeout(entryDebounceTimers[key]);
    }

    entryDebounceTimers[key] = setTimeout(async () => {
        const updates = { ...pendingEntryUpdates[key] };
        delete pendingEntryUpdates[key];
        delete entryDebounceTimers[key];
        try {
            await updateEntry(section, id, updates);
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(`Debounced update failed for ${key}:`, err);
        }
    }, 600);
}

let pendingHeaderUpdates: Record<string, any> = {};
let headerDebounceTimer: any = null;

export function debouncedUpdateHeader(
    updates: Record<string, any>,
    onSuccess?: () => void
): void {
    pendingHeaderUpdates = { ...pendingHeaderUpdates, ...updates };

    if (headerDebounceTimer) {
        clearTimeout(headerDebounceTimer);
    }

    headerDebounceTimer = setTimeout(async () => {
        const finalUpdates = { ...pendingHeaderUpdates };
        pendingHeaderUpdates = {};
        headerDebounceTimer = null;
        try {
            await updateHeader(finalUpdates);
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error('Debounced header update failed:', err);
        }
    }, 600);
}
