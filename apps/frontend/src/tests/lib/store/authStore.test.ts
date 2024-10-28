// src/lib/store/authStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { authStore, login, logout } from '../../../lib/store/authStore';

describe('authStore', () => {
	beforeEach(() => {
		authStore.set(false);
	});

	it('should have initial state of false', () => {
		const initialState = get(authStore);
		expect(initialState).toBe(false);
	});

	it('should set state to true when logging in', () => {
		login();
		const state = get(authStore);
		expect(state).toBe(true);
	});

	it('should set state to false when logging out', () => {
		// First login
		login();
		expect(get(authStore)).toBe(true);

		// Then logout
		logout();
		const state = get(authStore);
		expect(state).toBe(false);
	});

	it('should maintain state after multiple operations', () => {
		login();
		expect(get(authStore)).toBe(true);

		logout();
		expect(get(authStore)).toBe(false);

		login();
		expect(get(authStore)).toBe(true);
	});
});
