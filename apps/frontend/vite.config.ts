import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		globals: true,
		environment: 'jsdom',
		setupFiles: ['src/tests/setup.js'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: [
				'node_modules/**',
				'.svelte-kit/**',
				'coverage/**',
				'src/tests/**',
				'**/*.d.ts',
				'**/*.test.ts',
				'**/*.spec.ts',
				'*.config.{js,ts}',
				'svelte.config.js',
				'vite.config.ts'
			],
			include: [
				'src/routes/**/*.server.ts',
				'src/lib/utils/**',
				'src/lib/modules/**',
				'src/lib/store/**'
			],
			reportsDirectory: 'coverage',
			enabled: true,
			clean: true,
			all: true,
			// Spécifier les patterns de fichiers source
			extension: ['.js', '.ts', '.svelte'],
			// Utiliser des chemins absolus
			resolveSourceMapLocations: [
				'src/**/*.ts',
				'src/**/*.js',
				'src/**/*.svelte'
			]
		},
		// Ajout de la résolution des chemins
		resolve: {
			alias: {
				'$lib': path.resolve(__dirname, './src/lib'),
				'$routes': path.resolve(__dirname, './src/routes')
			}
		}
	}
});