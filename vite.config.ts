/// <reference types="vitest" />
/// <reference types="@sveltejs/kit" />

import { sveltekit } from '@sveltejs/kit/vite';
import WindiCSS from 'vite-plugin-windicss';
import { UserConfigExport } from 'vite';
import { resolve } from 'path';

const config: UserConfigExport = {
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: 'src/setupTests.ts',
		silent: false
	},
	plugins: [sveltekit(), WindiCSS()],
	resolve: {
		alias: {
			$routes: resolve('./src/routes'),
			$features: resolve('./src/features')
		}
	},
	server: {
		port: parseInt(process.env.PORT) || 5500
	}
};

export default config;
