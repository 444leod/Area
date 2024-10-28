import MobileIndicator from '../../../../lib/components/new-area/MobileIndicator.svelte';
import { render } from '@testing-library/svelte';

describe('MobileIndicator', () => {
	const defaultProps = {
		currentStep: 0,
		totalSteps: 3,
		stepName: 'Select Trigger'
	};

	it('should display correct step information', () => {
		const { getByText } = render(MobileIndicator, defaultProps);

		expect(getByText('Step 1 of 3')).toBeTruthy();
		expect(getByText('Select Trigger')).toBeTruthy();
	});

	it('should update when props change', async () => {
		const { component, getByText } = render(MobileIndicator, defaultProps);

		await component.$set({ currentStep: 1, stepName: 'Select Action' });
		expect(getByText('Step 2 of 3')).toBeTruthy();
		expect(getByText('Select Action')).toBeTruthy();
	});
});
