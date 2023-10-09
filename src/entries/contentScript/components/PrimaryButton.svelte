<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<button on:click={(e) => dispatch('click', e)}>
	<slot />
</button>

<style lang="scss">
	button {
		background-color: #f47521;
		color: #141519;
		border: none;

		font-family:
			Lato,
			Helvetica Neue,
			helvetica,
			sans-serif;
		font-weight: 900;
		font-size: 0.875rem;
		line-height: 1.125rem;

		display: flex;
		align-items: center;
		justify-content: center;

		height: 2.5rem;
		width: calc(100% - 0.625rem);

		margin: 0.3125rem;
		padding: 0 1rem;

		text-transform: uppercase;

		transition: background-color 0.2s ease;

		cursor: pointer;

		&:hover {
			background-color: #ff944d;
			color: #23252b;
		}
	}
</style>
