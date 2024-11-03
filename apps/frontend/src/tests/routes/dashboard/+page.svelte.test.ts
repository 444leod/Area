import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { goto } from '$app/navigation';
import Dashboard from '../../../routes/dashboard/+page.svelte';
import { tick } from 'svelte';

vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

vi.mock('$lib/store/errorMessage', () => ({
	setError: vi.fn()
}));

describe('Dashboard', () => {
	const mockData = {
		services: [
			{
				_id: '1',
				name: 'Test Automation 1',
				active: true,
				totalRuns: 10,
				successfulRuns: 8
			},
			{
				_id: '2',
				name: 'Test Automation 2',
				active: false,
				totalRuns: 5,
				successfulRuns: 4
			}
		],
		token: 'test-token'
	};

	beforeEach(() => {
		vi.clearAllMocks();
		global.fetch = vi.fn(() => Promise.resolve({ ok: true }));
	});

	it('should render dashboard stats correctly', () => {
		const { getByText } = render(Dashboard, { props: { data: mockData } });

		expect(getByText('Total Automations')).toBeTruthy();
		expect(getByText('2')).toBeTruthy();
		expect(getByText('Active Automations')).toBeTruthy();
		expect(getByText('1')).toBeTruthy();
		expect(getByText('80.0%')).toBeTruthy();
	});

	it('should show area details popup', async () => {
		const { container, getByText } = render(Dashboard, { props: { data: mockData } });

		const detailsButton = container.querySelector('.btn-icon');
		await fireEvent.click(detailsButton!);
		await tick();

		expect(document.querySelector('.fixed')).toBeTruthy();
	});

	it('should handle responsive layout', async () => {
		vi.stubGlobal('innerWidth', 400);
		const { container } = render(Dashboard, { props: { data: mockData } });

		window.dispatchEvent(new Event('resize'));
		await tick();

		expect(container.querySelector('table')).toBeFalsy();
		expect(container.querySelector('.card.variant-soft')).toBeTruthy();
	});
});
