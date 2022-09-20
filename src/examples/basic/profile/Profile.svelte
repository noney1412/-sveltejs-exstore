<script lang="ts">
	import { profile } from './profile';
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
		<h1 data-testid="display-name">{$profile.name}</h1>
		<h2 data-testid="display-age">{$profile.age}</h2>
	</div>

	<div class="row-container" flex="~" gap="12px">
		<input
			class="form__input"
			data-testid="input-name"
			type="text"
			h="60px"
			border="rounded-xl"
			flex="1"
			placeholder="name"
			bind:value={$profile.name}
		/>
		<input
			class="form__input"
			data-testid="input-age"
			type="text"
			h="60px"
			border="rounded-xl"
			flex="1"
			placeholder="age"
			bind:value={$profile.age}
		/>
	</div>
	<button
		on:click={() => {
			profile.changeName('John Doe');
		}}>Change Name To John Doe</button
	>
	<button
		on:click={() => {
			profile.set({});
		}}>Reset Name</button
	>
</div>
