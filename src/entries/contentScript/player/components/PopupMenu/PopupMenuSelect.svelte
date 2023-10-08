<script lang="ts" generics="T">
	import PopupMenuSelectItem from '~/entries/contentScript/player/components/PopupMenu/PopupMenuSelectItem.svelte';
	import { createEventDispatcher } from 'svelte';
	import { enterClickProxy } from '~/entries/contentScript/player/utils';

	export let name: string;
	// eslint-disable-next-line no-undef
	export let items: { name: string; value: T }[];
	// eslint-disable-next-line no-undef
	export let value: T;

	const dispatch = createEventDispatcher();
</script>

<div
	class="popup-menu-select-head"
	role="button"
	tabindex="0"
	on:click|preventDefault|stopPropagation={() => dispatch('close')}
	on:keydown|preventDefault|stopPropagation={enterClickProxy}
>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
		><path fill="#FFF" fill-rule="evenodd" d="M15.4 16.6L14 18l-6-6 6-6 1.4 1.4-4.6 4.6z" /></svg
	>
	<div>{name}</div>
</div>
<div>
	{#each items as item}
		<PopupMenuSelectItem
			value={item.value}
			bind:activeValue={value}
			on:click={(e) => dispatch('click', e.detail)}
		>
			{item.name}
		</PopupMenuSelectItem>
	{/each}
</div>

<style lang="scss">
	.popup-menu-select-head {
		display: flex;
		align-items: center;

		padding: 0 20px;

		height: 42px;

		cursor: pointer;

		& > svg {
			width: 24px;
			height: 24px;
		}

		& > div {
			color: #fff;

			font-size: 18px;
			font-family: Lato, serif;
			line-height: 26px;

			margin-left: 6px;
		}
	}
</style>
