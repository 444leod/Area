import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';
import Page from '../../routes/+page.svelte';

describe('+page.svelte', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		render(Page);
	});

	it('renders without crashing', async () => {
		const mainContainer = screen.getByTestId('main-container');
		expect(mainContainer).toBeTruthy();
	});

	it('contains a div with the correct class', async () => {
		const mainDiv = screen.getByTestId('main-container');
		expect(mainDiv).toHaveClass('container mx-auto px-4 py-12');
	});

	it('renders the welcome message', async () => {
		await waitFor(() => {
			expect(screen.getByText(/Welcome to the BoogieBomb Area/i)).toBeTruthy();
		});
	});

	it('renders the subtitle', async () => {
		await waitFor(() => {
			expect(screen.getByText(/Automate your workflow/i)).toBeTruthy();
		});
	});

	it('renders the "Get Started" and "Learn More" buttons', async () => {
		await waitFor(() => {
			expect(screen.getByText(/Get Started/i)).toBeTruthy();
			expect(screen.getByText(/Login/i)).toBeTruthy();
		});
	});

	it('renders the feature cards', async () => {
		await waitFor(() => {
			expect(screen.getByText(/Powerful Automation/i)).toBeTruthy();
			expect(screen.getByText(/Lightning Fast/i)).toBeTruthy();
			expect(screen.getByText(/Endless Possibilities/i)).toBeTruthy();
		});
	});

	it('renders the integration section', async () => {
		await waitFor(() => {
			expect(screen.getByText(/Our Integrations/i)).toBeTruthy();
		});
	});
});
