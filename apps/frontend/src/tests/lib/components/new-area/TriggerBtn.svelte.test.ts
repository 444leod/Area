import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import TriggerBtn from '../../../../lib/components/new-area/TriggerBtn.svelte';

// Tests TriggerBtn
describe('TriggerBtn', () => {
	const defaultProps = {
		item: 'new issue',
		onClick: vi.fn(),
		appName: 'github',
		type: 'trigger',
		description: 'Test description'
	};
	it('should handle click events', async () => {
		const { container } = render(TriggerBtn, defaultProps);

		const button = container.querySelector('button');
		await fireEvent.click(button!);

		expect(defaultProps.onClick).toHaveBeenCalled();
	});

	it('should render description when provided', () => {
		const { getByText } = render(TriggerBtn, defaultProps);
		expect(getByText('Test description')).toBeTruthy();
	});

	it('should not render description when not provided', () => {
		const { container } = render(TriggerBtn, {
			...defaultProps,
			description: undefined
		});

		const descriptionElements = container.getElementsByClassName('opacity-70');
		expect(descriptionElements.length).toBe(0);
	});

	it('should apply correct styling classes', () => {
		const { container } = render(TriggerBtn, defaultProps);

		const button = container.querySelector('button');
		expect(button).toHaveClass('variant-ghost');
		expect(button).toHaveClass('shadow-md');
	});
});
