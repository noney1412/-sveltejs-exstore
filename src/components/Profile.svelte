<script lang="ts">
	import { profile } from '$models/profile';
</script>

<div class="column-container" flex="~ col" gap="18px">
	<div
		class="profile"
		w="720px"
		h="400px"
		p="8"
		flex="~ col"
		gap="12px"
		bg="red-400"
		border="rounded-xl"
	>
		<h1>{$profile.nameA}</h1>
		<h2>{$profile.age}</h2>
	</div>

	<div class="row-container" flex="~" gap="12px">
		<input
			class="form__input"
			type="text"
			h="60px"
			border="rounded-xl"
			flex="1"
			placeholder="name"
		/>
		<input
			class="form__input"
			type="text"
			h="60px"
			border="rounded-xl"
			flex="1"
			placeholder="age"
			bind:value={$profile.age}
		/>
	</div>
</div>
