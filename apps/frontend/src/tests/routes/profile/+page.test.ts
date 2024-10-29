import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Profile from '../../../routes/profile/+page.svelte';
import { goto } from '$app/navigation';

// Mock des dépendances
vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

describe('Profile Page', () => {
	const mockProfile = {
		first_name: 'John',
		email: 'john@example.com',
		areas: [
			{
				_id: '1',
				active: true,
				action: {
					informations: {
						type: 'github_issue',
						exampleField: 'test field'
					}
				},
				reaction: {
					informations: {
						type: 'send_email',
						to: 'test@example.com',
						subject: 'Test Subject'
					}
				}
			},
			{
				_id: '2',
				active: false,
				action: {
					informations: {
						type: 'gmail_new_email'
					}
				},
				reaction: {
					informations: {
						type: 'discord_message'
					}
				}
			}
		]
	};

	beforeEach(() => {
		vi.clearAllMocks();
		global.fetch = vi.fn();
	});

	it('should handle logout correctly', async () => {
		global.fetch = vi.fn(() => Promise.resolve({ ok: true } as Response));

		const { getByText } = render(Profile, {
			data: { profile: mockProfile }
		});

		const logoutButton = getByText('Logout');
		await fireEvent.click(logoutButton);

		expect(global.fetch).toHaveBeenCalledWith('/api/logout', {
			method: 'POST'
		});
		expect(goto).toHaveBeenCalledWith('/login');
	});

	it('should render areas list correctly', () => {
		const { getAllByRole, getByText } = render(Profile, {
			data: { profile: mockProfile }
		});

		const areaCards = getAllByRole('article');
		expect(areaCards).toHaveLength(2);

		// Vérifier le premier AREA
		expect(getByText('github_issue → send_email')).toBeTruthy();
		expect(getByText('test field')).toBeTruthy();
		expect(getByText('test@example.com')).toBeTruthy();
		expect(getByText('Test Subject')).toBeTruthy();
	});

	it('should show correct status badges for areas', () => {
		const { getAllByText } = render(Profile, {
			data: { profile: mockProfile }
		});

		const activeStatus = getAllByText('Active');
		const inactiveStatus = getAllByText('Inactive');
		expect(activeStatus).toHaveLength(1);
		expect(inactiveStatus).toHaveLength(1);
	});

	it('should apply correct styles and accessibility attributes', () => {
		const { container } = render(Profile, {
			data: { profile: mockProfile }
		});

		// Vérifier les classes CSS importantes
		expect(container.querySelector('.profile-card')).toBeTruthy();
		expect(container.querySelector('.areas-title')).toBeTruthy();
		expect(container.querySelector('.area-card')).toBeTruthy();

		// Vérifier les attributs d'accessibilité
		const areaCards = container.querySelectorAll('[role="article"]');
		areaCards.forEach((card) => {
			expect(card.getAttribute('tabindex')).toBe('0');
		});

		const iconElements = container.querySelectorAll('[aria-hidden="true"]');
		expect(iconElements.length).toBeGreaterThan(0);
	});

	it('should handle failed logout', async () => {
		global.fetch = vi.fn(() => Promise.resolve({ ok: false } as Response));

		const { getByText } = render(Profile, {
			data: { profile: mockProfile }
		});

		const logoutButton = getByText('Logout');
		await fireEvent.click(logoutButton);

		expect(global.fetch).toHaveBeenCalledWith('/api/logout', {
			method: 'POST'
		});
		expect(goto).not.toHaveBeenCalled();
	});
});
