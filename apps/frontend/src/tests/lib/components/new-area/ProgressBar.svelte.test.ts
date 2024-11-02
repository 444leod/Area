import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import ProgressBar from '../../../../lib/components/new-area/ProgressBarSlug.svelte';

describe('ProgressBar', () => {
	const mockSteps = [{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }];

	it('should render all steps', () => {
		const { container, getByText } = render(ProgressBar, {
			props: {
				steps: mockSteps,
				currentStep: 0
			}
		});

		mockSteps.forEach((step) => {
			expect(getByText(step.label)).toBeTruthy();
		});
	});

	it('should be hidden on mobile', () => {
		const { container } = render(ProgressBar, {
			props: {
				steps: mockSteps,
				currentStep: 0
			}
		});

		expect(container.firstChild).toHaveClass('hidden');
		expect(container.firstChild).toHaveClass('md:flex');
	});
});
