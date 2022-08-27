import { defineConfig } from 'cypress';

export default defineConfig({
	e2e: {
		env:{
			PORT: '5500'
		},
		setupNodeEvents(on, config) {
			// implement node event listeners here
		}
	}
});
