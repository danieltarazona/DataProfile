/**
 * XState Machine for Authentication State Management
 */

import { createMachine, assign } from 'xstate';

// Auth context
interface AuthContext {
    isAuthenticated: boolean;
    email: string;
    error: string | null;
    isLoading: boolean;
}

// Auth events
type AuthEvent =
    | { type: 'LOGIN'; email: string; password: string }
    | { type: 'LOGOUT' }
    | { type: 'CHECK_SESSION' }
    | { type: 'AUTH_SUCCESS' }
    | { type: 'AUTH_FAILURE'; error: string }
    | { type: 'SESSION_VALID'; email: string }
    | { type: 'SESSION_INVALID' }
    | { type: 'CLEAR_ERROR' };

// Auth State Machine
export const authMachine = createMachine({
    id: 'auth',
    initial: 'checking',
    types: {} as {
        context: AuthContext;
        events: AuthEvent;
    },
    context: {
        isAuthenticated: false,
        email: '',
        error: null,
        isLoading: true,
    },
    states: {
        checking: {
            entry: assign({ isLoading: () => true }),
            invoke: {
                id: 'checkSession',
                src: 'checkSession',
                onDone: {
                    target: 'authenticated',
                    actions: assign({
                        isAuthenticated: () => true,
                        email: ({ event }) => event.output?.email || '',
                        isLoading: () => false,
                    }),
                },
                onError: {
                    target: 'unauthenticated',
                    actions: assign({
                        isAuthenticated: () => false,
                        isLoading: () => false,
                    }),
                },
            },
        },
        unauthenticated: {
            on: {
                LOGIN: {
                    target: 'authenticating',
                },
                CLEAR_ERROR: {
                    actions: assign({ error: () => null }),
                },
            },
        },
        authenticating: {
            entry: assign({ isLoading: () => true, error: () => null }),
            invoke: {
                id: 'login',
                src: 'login',
                input: ({ event }) => {
                    if (event.type === 'LOGIN') {
                        return { email: event.email, password: event.password };
                    }
                    return { email: '', password: '' };
                },
                onDone: {
                    target: 'authenticated',
                    actions: assign({
                        isAuthenticated: () => true,
                        email: ({ event }) => event.output?.email || '',
                        isLoading: () => false,
                    }),
                },
                onError: {
                    target: 'unauthenticated',
                    actions: assign({
                        error: ({ event }) => {
                            const err = event.error as Error | undefined;
                            return err?.message || 'Authentication failed';
                        },
                        isLoading: () => false,
                    }),
                },
            },
        },
        authenticated: {
            on: {
                LOGOUT: {
                    target: 'loggingOut',
                },
            },
        },
        loggingOut: {
            invoke: {
                id: 'logout',
                src: 'logout',
                onDone: {
                    target: 'unauthenticated',
                    actions: assign({
                        isAuthenticated: () => false,
                        email: () => '',
                    }),
                },
                onError: {
                    target: 'unauthenticated',
                    actions: assign({
                        isAuthenticated: () => false,
                        email: () => '',
                    }),
                },
            },
        },
    },
});

// Auth service functions
export const authServices = {
    checkSession: async () => {
        const response = await fetch('/api/verify', {
            method: 'GET',
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Session invalid');
        }
        const data = await response.json();
        return { email: data.email };
    },

    login: async ({ input }: { input: { email: string; password: string } }) => {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email: input.email, password: input.password }),
        });
        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.error || 'Invalid credentials');
        }
        const data = await response.json();
        return { email: data.email };
    },

    logout: async () => {
        await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include',
        });
        return {};
    },
};

export type AuthMachine = typeof authMachine;
