import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock SvelteKit's load function
vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');
	return {
		...actual,
		load: vi.fn()
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
