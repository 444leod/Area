import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { goto } from '$app/navigation';
import { authStore } from '$lib/store/authStore';
import Page from '../../routes/login/+page.svelte';

vi.mock('$app/stores', () => ({
    page: {
        subscribe: vi.fn((callback) => {
            callback({
                form: {
                    success: true  // Simuler un login réussi
                },
                data: {},
                url: new URL('http://localhost'),
                params: {},
                status: 200,
                error: null,
                route: { id: '' }
            });
            return () => {};
        })
    }
}));

vi.mock('$app/navigation', () => ({
    goto: vi.fn()
}));

// Mock your custom stores
vi.mock('$lib/store/authStore', () => ({
    authStore: {
        set: vi.fn(),
        subscribe: vi.fn()
    }
}));

vi.mock('$lib/store/errorMessage', () => ({
    setError: vi.fn()
}));

vi.mock('$lib/modules/oauthGoogle', () => ({
    oauthGoogle: vi.fn()
}));

describe('Login Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    it('renders without crashing', () => {
        render(Page);
        const mainContainer = screen.getByTestId('main-container');
        expect(mainContainer).toBeInTheDocument();
    });

    it('renders login form elements', () => {
        render(Page);
        expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
        expect(screen.getByText('Continue with Google')).toBeInTheDocument();
        expect(screen.getByText('Log In')).toBeInTheDocument();
    });

    it('handles successful login with redirect', () => {
        render(Page);

        // Vérifier que authStore.set a été appelé avec true
        expect(authStore.set).toHaveBeenCalledWith(true);

        // Avancer le temps de 500ms
        vi.advanceTimersByTime(500);
        expect(goto).toHaveBeenCalledWith('/dashboard');
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();
    });
});