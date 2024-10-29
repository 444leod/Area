import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Layout from '../../../../routes/dashboard/new-area/+layout.svelte';

describe('New Area Layout', () => {
	const mockData = {
		steps: [
			{ path: '/step1', label: 'Step 1' },
			{ path: '/step2', label: 'Step 2' }
		],
		currentStepIndex: 0,
		services: [],
		authorizations: []
	};

	it('should render progress components', () => {
		const { container, getByText } = render(Layout, {
			props: { data: mockData }
		});

		expect(getByText('Create New Automation')).toBeTruthy();
		// Utilisez le data-testid pour le progress bar
		expect(container.querySelector('[data-testid="progress-bar"]')).toBeTruthy();
	});

	it('should handle current step display', () => {
		const { getAllByText } = render(Layout, {
			props: {
				data: {
					...mockData,
					currentStepIndex: 1
				}
			}
		});

		// Utilisez getAllByText car le texte apparaît plusieurs fois
		const stepElements = getAllByText('Step 2');
		expect(stepElements.length).toBeGreaterThan(0);
	});
});
