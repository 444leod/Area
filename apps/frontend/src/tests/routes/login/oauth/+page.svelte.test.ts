import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { goto } from '$app/navigation';
import { authStore } from '$lib/store/authStore';
import Page from '../../../../routes/login/oauth/+page.svelte';

// Mocks nécessaires
vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

vi.mock('$lib/store/authStore', () => ({
	authStore: {
		set: vi.fn()
	}
}));

// Mock de fetch et window.location
global.fetch = vi.fn();
vi.stubGlobal('window', {
	location: {
		search: '?code=test_code'
	}
});

describe('Google Auth Page', () => {
	it('should show loading state by default', () => {
		const { container } = render(Page);
		expect(container.textContent).toContain('Authenticating...');
	});

	it('should handle missing code parameter', () => {
		// Simuler l'absence de code dans l'URL
		window.location.search = '';

		render(Page);
		expect(fetch).not.toHaveBeenCalled();
	});
});
