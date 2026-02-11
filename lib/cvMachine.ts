/**
 * XState Machine for CV Data State Management
 */

import { createMachine, assign } from 'xstate';
import type { CVData } from '@datakit/react-core';

// Machine context
interface CVContext {
    data: CVData;
    isDirty: boolean;
    lastSaved: Date | null;
    error: string | null;
}

// Machine events
type CVEvent =
    | { type: 'UPDATE_HEADER'; field: keyof CVData['header']; value: string }
    | { type: 'UPDATE_SKILLS'; field: 'programming' | 'design' | 'tools'; value: string }
    | { type: 'UPDATE_ITEM'; section: 'education' | 'experience' | 'leadership' | 'certificates'; index: number; field: string; value: string }
    | { type: 'UPDATE_PROJECT'; index: number; field: string; value: string }
    | { type: 'ADD_ITEM'; section: 'education' | 'experience' | 'leadership' | 'certificates' }
    | { type: 'ADD_PROJECT' }
    | { type: 'REMOVE_ITEM'; section: 'education' | 'experience' | 'leadership' | 'certificates'; index: number }
    | { type: 'REMOVE_PROJECT'; index: number }
    | { type: 'SAVE' }
    | { type: 'SAVE_SUCCESS' }
    | { type: 'SAVE_ERROR'; error: string }
    | { type: 'LOAD_DATA'; data: CVData }
    | { type: 'EXPORT_JSON' }
    | { type: 'CLEAR_ERROR' };

// Initial CV data
const initialData: CVData = {
    header: {
        name: '',
        title: '',
        location: '',
        email: '',
        phone: '',
        github: '',
        summary: '',
    },
    education: [],
    skills: {
        programming: '',
        design: '',
        tools: '',
        projects: [],
    },
    experience: [],
    leadership: [],
    certificates: [],
};

// Default item templates
const defaultItems = {
    education: { institution: '', location: '', degree: '', date: '', coursework: '' },
    experience: { company: '', role: '', date: '', location: '', description: '' },
    leadership: { organization: '', role: '', date: '', location: '', description: '' },
    certificates: { name: '', issuer: '', date: '', description: '' },
    project: { name: '', date: '', description: '' },
};

// CV State Machine
export const cvMachine = createMachine({
    id: 'cvEditor',
    initial: 'idle',
    types: {} as {
        context: CVContext;
        events: CVEvent;
    },
    context: {
        data: initialData,
        isDirty: false,
        lastSaved: null,
        error: null,
    },
    states: {
        idle: {
            on: {
                UPDATE_HEADER: {
                    actions: assign({
                        data: ({ context, event }) => ({
                            ...context.data,
                            header: {
                                ...context.data.header,
                                [event.field]: event.value,
                            },
                        }),
                        isDirty: () => true,
                    }),
                },
                UPDATE_SKILLS: {
                    actions: assign({
                        data: ({ context, event }) => ({
                            ...context.data,
                            skills: {
                                ...context.data.skills,
                                [event.field]: event.value,
                            },
                        }),
                        isDirty: () => true,
                    }),
                },
                UPDATE_ITEM: {
                    actions: assign({
                        data: ({ context, event }) => {
                            const section = context.data[event.section] as unknown as Record<string, unknown>[];
                            const updatedSection = section.map((item, i) =>
                                i === event.index ? { ...item, [event.field]: event.value } : item
                            );
                            return {
                                ...context.data,
                                [event.section]: updatedSection,
                            };
                        },
                        isDirty: () => true,
                    }),
                },
                UPDATE_PROJECT: {
                    actions: assign({
                        data: ({ context, event }) => ({
                            ...context.data,
                            skills: {
                                ...context.data.skills,
                                projects: context.data.skills.projects.map((proj, i) =>
                                    i === event.index ? { ...proj, [event.field]: event.value } : proj
                                ),
                            },
                        }),
                        isDirty: () => true,
                    }),
                },
                ADD_ITEM: {
                    actions: assign({
                        data: ({ context, event }) => ({
                            ...context.data,
                            [event.section]: [
                                ...context.data[event.section],
                                { ...defaultItems[event.section] },
                            ],
                        }),
                        isDirty: () => true,
                    }),
                },
                ADD_PROJECT: {
                    actions: assign({
                        data: ({ context }) => ({
                            ...context.data,
                            skills: {
                                ...context.data.skills,
                                projects: [...context.data.skills.projects, { ...defaultItems.project }],
                            },
                        }),
                        isDirty: () => true,
                    }),
                },
                REMOVE_ITEM: {
                    actions: assign({
                        data: ({ context, event }) => ({
                            ...context.data,
                            [event.section]: context.data[event.section].filter((_, i) => i !== event.index),
                        }),
                        isDirty: () => true,
                    }),
                },
                REMOVE_PROJECT: {
                    actions: assign({
                        data: ({ context, event }) => ({
                            ...context.data,
                            skills: {
                                ...context.data.skills,
                                projects: context.data.skills.projects.filter((_, i) => i !== event.index),
                            },
                        }),
                        isDirty: () => true,
                    }),
                },
                LOAD_DATA: {
                    actions: assign({
                        data: ({ event }) => event.data,
                        isDirty: () => false,
                    }),
                },
                SAVE: {
                    target: 'saving',
                },
                CLEAR_ERROR: {
                    actions: assign({
                        error: () => null,
                    }),
                },
            },
        },
        saving: {
            entry: ({ context }) => {
                // Save to localStorage
                try {
                    localStorage.setItem('cvData', JSON.stringify(context.data));
                } catch {
                    // Handle error in state
                }
            },
            after: {
                100: {
                    target: 'idle',
                    actions: assign({
                        isDirty: () => false,
                        lastSaved: () => new Date(),
                    }),
                },
            },
        },
    },
});

export type CVMachine = typeof cvMachine;
