import { vi } from 'vitest';

// Tous les vi.mock() doivent être au tout début, avant tout autre import
vi.mock('$app/stores', async () => {
    const writable = (await import('svelte/store')).writable;
    return {
        page: writable({ form: undefined })
    };
});

vi.mock('$app/navigation', () => ({
    goto: vi.fn()
}));

vi.mock('$lib/modules/oauthGoogle', () => ({
    oauthGoogle: vi.fn()
}));

vi.mock('$lib/store/authStore', () => ({
    authStore: {
        set: vi.fn(),
        subscribe: vi.fn()
    }
}));

vi.mock('$lib/store/errorMessage', () => ({
    setError: vi.fn()
}));

vi.mock('$app/forms', () => ({
    enhance: vi.fn(() => vi.fn())
}));

// Imports après tous les vi.mock()
import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { tick } from 'svelte';
import { page } from '$app/stores';
import { authStore } from '$lib/store/authStore';
import { oauthGoogle } from '$lib/modules/oauthGoogle';
import { goto } from '$app/navigation';
import { setError } from '$lib/store/errorMessage';
import Page from '../../../routes/signup/+page.svelte';

describe('Signup Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        page.set({ form: undefined });
    });

    it('should render signup form', async () => {
        const { getByPlaceholderText, getByText } = render(Page);
        await tick();

        expect(getByPlaceholderText('John')).toBeTruthy();
        expect(getByPlaceholderText('Doe')).toBeTruthy();
        expect(getByPlaceholderText('your@email.com')).toBeTruthy();
        expect(getByText('Create an Account')).toBeTruthy();
    });

    it('should handle Google OAuth button click', async () => {
        const { getByText } = render(Page);
        await tick();

        const googleButton = getByText('Continue with Google');
        await fireEvent.click(googleButton);

        expect(oauthGoogle).toHaveBeenCalled();
    });

    it('should handle success redirect', async () => {
        page.set({ form: { success: true } });
        render(Page);
        await tick();

        expect(authStore.set).toHaveBeenCalledWith(true);

        await new Promise(resolve => setTimeout(resolve, 1500));
        expect(goto).toHaveBeenCalledWith('/dashboard');
    });

    it('should handle error', async () => {
        const errorMessage = 'Test error';
        page.set({ form: { error: errorMessage } });

        render(Page);
        await tick();

        expect(setError).toHaveBeenCalledWith(errorMessage);
    });

    it('should validate password match', async () => {
        const { getByPlaceholderText, getByText } = render(Page);
        await tick();

        await fireEvent.input(getByPlaceholderText('Create a strong password'), {
            target: { value: 'password123' }
        });
        await fireEvent.input(getByPlaceholderText('Confirm your password'), {
            target: { value: 'password456' }
        });

        const form = getByText('Sign Up').closest('form');
        await fireEvent.submit(form!);

        expect(form?.checkValidity()).toBe(false);
    });
});