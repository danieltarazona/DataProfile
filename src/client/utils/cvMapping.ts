import * as api from '../api';

/**
 * Checks if a CV entry is visible for a specific role.
 * 'all' is the default role that includes everything.
 */
export function isVisibleForRole(item: any, activeRoleId: string): boolean {
    if (!activeRoleId || activeRoleId === 'all') return true;
    if (!item?.roleIds || item.roleIds === 'all') return true;
    const roleIds = item.roleIds.split(',').map((id: string) => id.trim().toLowerCase());
    const targetRole = activeRoleId.toLowerCase();
    return roleIds.includes(targetRole) || roleIds.includes('all');
}

/**
 * Maps raw FullCVData (with localized fields) to the flat CVData structure
 * expected by the PDFPreviewPanel and other core components.
 */
export function mapCVDataToPreview(data: api.FullCVData, activeRoleId: string, lang: string): any {
    if (!data || !data.header) return null;

    const isVisible = (it: any) => isVisibleForRole(it, activeRoleId);

    const visibleSections = data.sectionOrder && data.sectionOrder.length > 0
        ? data.sectionOrder.filter(s => s.visible !== 0).map(s => s.sectionKey)
        : ['education', 'skills', 'experience', 'projects', 'leadership', 'certificates', 'languages', 'awards'];

    const activeRole = (data.roles || []).find(r => r.id === activeRoleId);
    let headerTitle: string;
    if (!activeRoleId || activeRoleId === 'all') {
        const allTitles = (data.roles || [])
            .map(r => (r.jobTitle || '').trim())
            .filter(Boolean);
        headerTitle = allTitles.length > 0 ? allTitles.join(' / ') : api.getLocalizedField(data.header, 'title', lang);
    } else {
        headerTitle = activeRole?.jobTitle || '';
    }

    const previewData = {
        header: {
            name: data.header.name,
            title: headerTitle,
            location: api.getLocalizedField(data.header, 'location', lang),
            email: data.header.email,
            phone: data.header.phone,
            github: data.header.github,
            linkedin: data.header.linkedin || '',
            website: data.header.website || '',
            aiPromptEnabled: data.header.aiPromptEnabled,
            aiPromptColor: data.header.aiPromptColor,
        },
        education: visibleSections.includes('education')
            ? (data.education || []).filter(isVisible).map(it => ({
                institution: api.getLocalizedField(it, 'institution', lang).toUpperCase(),
                degree: `${api.getLocalizedField(it, 'degree', lang)}${it.gpa ? `, GPA: ${it.gpa}` : ''}`,
                location: api.getLocalizedField(it, 'location', lang),
                date: it.dateStart && it.dateEnd ? `${it.dateStart} - ${it.dateEnd}` : (it.dateStart || ''),
                coursework: api.getLocalizedField(it, 'coursework', lang)
            }))
            : [],
        experience: visibleSections.includes('experience')
            ? (data.experience || []).filter(isVisible).map(it => {
                const baseDescription = api.getLocalizedField(it, 'description', lang);
                
                return {
                    company: it.company,
                    location: api.getLocalizedField(it, 'location', lang),
                    date: it.dateStart && it.dateEnd ? `${it.dateStart} - ${it.dateEnd}` : (it.dateStart || ''),
                    description: baseDescription,
                    projects: (data.projects || [])
                        .filter(p => String(p.experienceId) === String(it.id) && isVisible(p))
                        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                        .map(p => ({
                            name: api.getLocalizedField(p, 'name', lang),
                            role: api.getLocalizedField(p, 'role', lang),
                            description: api.getLocalizedField(p, 'description', lang),
                            link: p.link || '',
                            date: p.dateStart && p.dateEnd ? `${p.dateStart} - ${p.dateEnd}` : (p.dateStart || ''),
                        })),
                    highlights: []
                };
            })
            : [],
        leadership: visibleSections.includes('leadership')
            ? (data.leadership || []).filter(isVisible).map(it => ({
                organization: api.getLocalizedField(it, 'organization', lang),
                role: api.getLocalizedField(it, 'role', lang),
                location: api.getLocalizedField(it, 'location', lang),
                date: it.dateStart && it.dateEnd ? `${it.dateStart} - ${it.dateEnd}` : (it.dateStart || ''),
                description: api.getLocalizedField(it, 'description', lang)
            }))
            : [],
        skills: {
            programming: visibleSections.includes('skills') 
                ? (data.skills || []).filter(s => s?.category === 'programming' && isVisible(s)).map(s => api.getLocalizedField(s, 'name', lang)).join(', ')
                : '',
            design: visibleSections.includes('skills')
                ? (data.skills || []).filter(s => s?.category === 'design' && isVisible(s)).map(s => api.getLocalizedField(s, 'name', lang)).join(', ')
                : '',
            tools: visibleSections.includes('skills')
                ? (data.skills || []).filter(s => s?.category === 'tools' && isVisible(s)).map(s => api.getLocalizedField(s, 'name', lang)).join(', ')
                : '',
            projects: [], 
        },
        projects: visibleSections.includes('projects')
            ? (data.projects || []).filter(it => !it.experienceId && isVisible(it)).map(it => ({
                name: api.getLocalizedField(it, 'name', lang),
                role: api.getLocalizedField(it, 'role', lang),
                date: it.dateStart && it.dateEnd ? `${it.dateStart} - ${it.dateEnd}` : (it.dateStart || ''),
                location: api.getLocalizedField(it, 'location', lang),
                link: it.link,
                description: api.getLocalizedField(it, 'description', lang)
            }))
            : [],
        certificates: visibleSections.includes('certificates')
            ? (data.certificates || [])
                .filter(isVisible)
                .sort((a, b) => {
                    const dateA = new Date(a.date || 0).getTime();
                    const dateB = new Date(b.date || 0).getTime();
                    return dateB - dateA;
                })
                .map(it => ({
                    name: api.getLocalizedField(it, 'name', lang),
                    issuer: api.getLocalizedField(it, 'issuer', lang),
                    date: it.date,
                    description: api.getLocalizedField(it, 'description', lang)
                }))
            : [],
        awards: visibleSections.includes('awards')
            ? (data.awards || [])
                .filter(isVisible)
                .sort((a, b) => {
                    const dateA = new Date(a.date || 0).getTime();
                    const dateB = new Date(b.date || 0).getTime();
                    return dateB - dateA;
                })
                .map(it => ({
                    name: api.getLocalizedField(it, 'name', lang),
                    issuer: api.getLocalizedField(it, 'issuer', lang),
                    location: api.getLocalizedField(it, 'location', lang),
                    date: it.date,
                    description: api.getLocalizedField(it, 'description', lang)
                }))
            : [],
        languages: visibleSections.includes('languages')
            ? (data.languages || []).filter(isVisible).map(it => ({
                name: api.getLocalizedField(it, 'name', lang),
                level: it.level
            }))
            : [],
        hobbies: (visibleSections.includes('hobbies') || data.hobbies?.length > 0)
            ? (data.hobbies || []).filter(isVisible).map(it => ({
                name: api.getLocalizedField(it, 'name', lang) || (it as any).nameEn || (it as any).name_en || '',
                description: api.getLocalizedField(it, 'description', lang) || (it as any).descriptionEn || (it as any).description_en || '',
                location: (it as any).locationEn || (it as any).location_en || ''
            }))
            : []
    };

    console.log('[DEBUG] Mapped CV Data:', {
        activeRole: activeRoleId,
        lang,
        visibleSections,
        hobbiesCount: previewData.hobbies?.length || 0,
        hobbiesData: previewData.hobbies
    });

    return previewData;
}
