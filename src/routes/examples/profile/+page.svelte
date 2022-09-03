<script>
	import Profile from '$examples/basic/profile/Profile.svelte';
</script>

<div class="page" w="screen" h="screen">
	<div class="page-content" w="full" h="full" flex="~" justify="center" align="items-center">
		<Profile />
	</div>
</div>

<style lang="scss">
	:root {
		@apply "<sm:(text-12px) md:(text-16px) desktop:(text-18px)";
	}
</style>
