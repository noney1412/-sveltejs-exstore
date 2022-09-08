import { defineConfig } from 'cypress';

export default defineConfig({
	e2e: {
		env: {
			PORT: '5500'
		}
	}
});
