<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let dispatch = createEventDispatcher();
</script>

<button style="display: block; background: none; border: none; width: 40px; height: 40px; cursor: pointer" on:click|preventDefault|stopPropagation={() => dispatch('click')}>
	<span style="width: 20px; height: 20px; margin: auto">
		<slot />
	</span>
</button>
