import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Error from '../../routes/+error.svelte';

describe('Error Page', () => {
	it('should render with default message', () => {
		const { container, getByText } = render(Error);

		expect(getByText('404 not found')).toBeTruthy();
		expect(getByText('Something went wrong. Please try again.')).toBeTruthy();
		expect(getByText('Please check your connection or try again later.')).toBeTruthy();
	});

	it('should render with custom message', () => {
		const customMessage = 'Custom error message';
		const { getByText } = render(Error, { props: { message: customMessage } });

		expect(getByText(customMessage)).toBeTruthy();
	});

	it('should have correct styling', () => {
		const { container } = render(Error);
		const mainDiv = container.firstChild as HTMLElement;

		expect(mainDiv).toHaveClass('flex');
		expect(mainDiv).toHaveClass('flex-col');
		expect(mainDiv).toHaveClass('bg-error-100-800-token');
	});
});
