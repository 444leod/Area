import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock enhance action
vi.mock('$app/forms', () => ({
	enhance: () => vi.fn()
}));

// Mock SvelteKit modules that might be used in components
vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');
	return {
		...actual,
		browser: true,
		building: false,
		dev: true,
		version: 'test'
	};
});

// Mock any browser APIs that might not be available in the test environment
global.matchMedia =
	global.matchMedia ||
	function () {
		return {
			matches: false,
			addListener: function () {},
			removeListener: function () {}
		};
	};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
};
