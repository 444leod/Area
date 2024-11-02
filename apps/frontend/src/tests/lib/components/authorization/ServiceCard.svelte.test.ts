import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ServiceCard from '../../../../lib/components/authorization/ServiceCard.svelte';
import { tick } from 'svelte';

describe('ServiceCard', () => {
	const defaultProps = {
		name: 'Test Service',
		description: 'Test Description',
		icon: 'test-icon',
		connected: false,
		onConnect: vi.fn(),
		onDisconnect: vi.fn(),
		onDetails: vi.fn()
	};

	it('should render connect button when disconnected', async () => {
		const { getByText } = render(ServiceCard, defaultProps);

		const connectButton = getByText('Connect').closest('button');
		expect(connectButton).toBeTruthy();
		expect(getByText('Disconnected')).toBeTruthy();

		await fireEvent.click(connectButton!);
		expect(defaultProps.onConnect).toHaveBeenCalled();
	});

	it('should render disconnect button when connected', async () => {
		const connectedProps = {
			...defaultProps,
			connected: true
		};

		const { getByText } = render(ServiceCard, connectedProps);

		const disconnectButton = getByText('Disconnect').closest('button');
		expect(disconnectButton).toBeTruthy();
		expect(getByText('Connected')).toBeTruthy();

		await fireEvent.click(disconnectButton!);
		expect(defaultProps.onDisconnect).toHaveBeenCalled();
	});

	it('should call onDetails when details button is clicked', async () => {
		const { getByText } = render(ServiceCard, defaultProps);

		const detailsButton = getByText('Details').closest('button');
		expect(detailsButton).toBeTruthy();

		await fireEvent.click(detailsButton!);
		expect(defaultProps.onDetails).toHaveBeenCalled();
	});

	it('should maintain layout structure', () => {
		const { container } = render(ServiceCard, defaultProps);

		expect(container.querySelector('.card')).toHaveClass('variant-ghost-secondary');
		expect(container.querySelector('.flex.flex-col')).toBeTruthy();
		expect(container.querySelector('.flex.flex-row')).toBeTruthy();
	});

	it('should handle dynamic prop updates', async () => {
		const { component, getByText } = render(ServiceCard, defaultProps);

		expect(getByText('Disconnected')).toBeTruthy();

		await component.$set({ connected: true });
		await tick();

		expect(getByText('Connected')).toBeTruthy();
	});
});
