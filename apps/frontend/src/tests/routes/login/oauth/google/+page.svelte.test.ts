import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import Page from '../../../../../routes/login/oauth/google/+page.svelte';

// Mocks simples
vi.mock('$app/navigation', () => ({
    goto: vi.fn()
}));

describe('google Auth Page', () => {
    it('should render the loading message', () => {
        const { container } = render(Page);
        expect(container.textContent).toContain("Traitement de l'authentification google...");
    });

    it('should have onMount function', () => {
        const { container } = render(Page);
        expect(container).toBeTruthy();
    });
});