<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { enterClickProxy } from '~/entries/contentScript/player/utils';

	export let name: string;
	export let value: string;

	const dispatch = createEventDispatcher();
</script>

<div
	class="popup-menu-item"
	tabindex="0"
	role="button"
	on:click|preventDefault|stopPropagation={() => dispatch('click')}
	on:keydown|preventDefault|stopPropagation={enterClickProxy}
>
	<div class="popup-menu-item-name">{name}</div>
	<div class="popup-menu-item-value">
		<span>{value}</span>
		<span style="width: 24px; height: 24px">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
				><path fill="#FFF" fill-rule="evenodd" d="M8.6 7.4L10 6l6 6-6 6-1.4-1.4 4.6-4.6z" /></svg
			>
		</span>
	</div>
</div>

<style lang="scss">
	.popup-menu-item {
		display: flex;
		justify-content: space-between;
		align-items: center;

		height: 42px;
		padding: 0 20px;

		cursor: pointer;

		&:hover {
			background-color: #23252b;
		}
	}

	.popup-menu-item-name {
		color: #fff;
	}

	.popup-menu-item-value {
		color: #dadada;
		font-family: Lato, serif;

		display: flex;
		align-items: center;
	}
</style>
