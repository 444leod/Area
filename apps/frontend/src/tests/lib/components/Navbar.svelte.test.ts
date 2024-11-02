// src/tests/lib/components/Navbar.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { goto } from '$app/navigation';
import { authStore } from '$lib/store/authStore';
import Navbar from '../../../lib/components/Navbar.svelte';

vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

global.fetch = vi.fn();

describe('Navbar', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		authStore.set(false);
	});

	it('should render logo', () => {
		render(Navbar);
		expect(screen.getByTestId('logo')).toHaveTextContent("Boogie's Area");
	});

	it('should render login and signup buttons when not authenticated', () => {
		render(Navbar);
		expect(screen.getByTestId('desktop-login-button')).toBeInTheDocument();
		expect(screen.getByTestId('desktop-signup-button')).toBeInTheDocument();
	});

	it('should render profile and logout buttons when authenticated', async () => {
		authStore.set(true);
		render(Navbar);

		expect(screen.getByTestId('desktop-profile-button')).toBeInTheDocument();
		expect(screen.getByTestId('desktop-logout-button')).toBeInTheDocument();
	});

	it('should handle logout', async () => {
		const mockResponse = { ok: true, json: () => Promise.resolve({ success: true }) };
		global.fetch.mockResolvedValueOnce(mockResponse);

		authStore.set(true);
		render(Navbar);

		const logoutButton = screen.getByTestId('desktop-logout-button');
		await fireEvent.click(logoutButton);

		expect(global.fetch).toHaveBeenCalledWith('/api/logout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }
		});
		expect(goto).toHaveBeenCalledWith('/login');

		let authState;
		authStore.subscribe((value) => (authState = value))();
		expect(authState).toBe(false);
	});
});
