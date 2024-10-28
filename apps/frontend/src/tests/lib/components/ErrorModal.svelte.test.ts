import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { errorMessage } from '../../../lib/store/errorMessage';
import ErrorModal from '../../../lib/components/ErrorModal.svelte';

describe('ErrorModal', () => {
	beforeEach(() => {
		errorMessage.set(null);
	});

	it('should render error message', () => {
		errorMessage.set('Test error message');
		render(ErrorModal);

		expect(screen.getByText('Test error message')).toBeInTheDocument();
		expect(screen.getByText('Error')).toBeInTheDocument();
	});

	it('should close when clicking the close button', async () => {
		errorMessage.set('Test error message');
		render(ErrorModal);

		const closeButton = screen.getByText('Close');
		await fireEvent.click(closeButton);

		let currentError;
		errorMessage.subscribe((value) => (currentError = value))();
		expect(currentError).toBeNull();
	});

	it('should close when pressing Escape key', async () => {
		errorMessage.set('Test error message');
		render(ErrorModal);

		await fireEvent.keyDown(window, { key: 'Escape' });

		let currentError;
		errorMessage.subscribe((value) => (currentError = value))();
		expect(currentError).toBeNull();
	});
});
