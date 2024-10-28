import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import AppCard from '../../../../lib/components/new-area/AppCard.svelte';

describe('AppCard', () => {
	const mockApp = {
		id: 1,
		name: 'Gmail'
	};

	it('should call onClick when clicked', async () => {
		const onClick = vi.fn();
		const { container } = render(AppCard, {
			props: {
				app: mockApp,
				onClick
			}
		});

		const button = container.querySelector('button');
		await fireEvent.click(button!);
		expect(onClick).toHaveBeenCalled();
	});
});
