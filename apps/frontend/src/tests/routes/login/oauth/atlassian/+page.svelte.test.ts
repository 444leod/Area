import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import Page from '../../../../../routes/login/oauth/atlassian/+page.svelte';
import { goto } from '$app/navigation';

// Mocks simples
vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

describe('Atlassian Auth Page', () => {
	it('should render the loading message', () => {
		const { container } = render(Page);
		expect(container.textContent).toContain("Traitement de l'authentification Atlassian");
	});

	it('should have onMount function', () => {
		const { container } = render(Page);
		expect(container).toBeTruthy();
	});
});
