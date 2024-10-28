// src/tests/lib/components/ServiceModal.test.ts
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import ServiceModal from '../../../lib/components/ServiceModal.svelte';

describe('ServiceModal', () => {
	const mockService = {
		name: 'Test Service',
		icon: 'test-icon',
		actions: [
			{ name: 'Action 1', description: 'Test action 1' },
			{ name: 'Action 2', description: 'Test action 2' }
		],
		reactions: [{ name: 'Reaction 1', description: 'Test reaction 1' }]
	};

	it('should render service details when show is true', () => {
		render(ServiceModal, {
			props: { show: true, service: mockService, onClose: vi.fn() }
		});

		expect(screen.getByText('Test Service')).toBeInTheDocument();
		expect(screen.getByText('Action 1')).toBeInTheDocument();
		expect(screen.getByText('Reaction 1')).toBeInTheDocument();
	});

	it('should call onClose when close button is clicked', async () => {
		const onClose = vi.fn();
		render(ServiceModal, {
			props: { show: true, service: mockService, onClose }
		});

		const closeButton = screen.getByRole('button');
		await fireEvent.click(closeButton);

		expect(onClose).toHaveBeenCalled();
	});

	it('should render empty state when no actions or reactions', () => {
		const emptyService = {
			name: 'Empty Service',
			icon: 'test-icon',
			actions: [],
			reactions: []
		};

		render(ServiceModal, {
			props: { show: true, service: emptyService, onClose: vi.fn() }
		});

		expect(screen.getByText('No actions or reactions available')).toBeInTheDocument();
	});
});
