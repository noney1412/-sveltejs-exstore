<script>
	import '../styles/global.scss';
	import 'virtual:windi.css';
</script>

<slot />

<style global>
	body {
		font-family: 'Chakra Petch', sans-serif;
		background-color: var(--web-bg);
		color: var(--web-text);
	}

	h1 {
		@apply text-5xl font-bold;
	}

	h2 {
		@apply text-2xl font-bold;
	}
</style>
