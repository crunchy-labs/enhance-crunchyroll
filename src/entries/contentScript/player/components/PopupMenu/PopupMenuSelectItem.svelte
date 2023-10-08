<script lang="ts" generics="T">
	import { enterClickProxy } from '~/entries/contentScript/player/utils';
	import { createEventDispatcher } from 'svelte';

	// eslint-disable-next-line no-undef
	export let value: T;
	// eslint-disable-next-line no-undef
	export let activeValue: T;

	const dispatch = createEventDispatcher();
</script>

<div
	class="popup-menu-select-item"
	class:active={activeValue === value}
	role="button"
	tabindex="0"
	on:click|preventDefault|stopPropagation={() => {
		activeValue = value;
		dispatch('click', { value: value });
	}}
	on:keydown|preventDefault|stopPropagation={enterClickProxy}
>
	<div class="popup-menu-select-item-icon">
		{#if activeValue === value}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				style="margin-right: 8px; height: 20px; width: 20px;"
				viewBox="0 0 20 20"
				><circle
					style="fill: rgb(25, 46, 56); opacity: 1;"
					class="bg"
					cx="10"
					cy="10"
					r="9"
				/><circle style="fill: rgb(68, 195, 171);" class="dot" cx="10" cy="10" r="4" /><path
					style="fill: rgb(68, 195, 171);"
					class="outer_circle"
					d="M10,2a8,8,0,1,1-8,8,8.009,8.009,0,0,1,8-8m0-2A10,10,0,1,0,20,10,10,10,0,0,0,10,0Z"
				/></svg
			>
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				style="margin-right: 8px; height: 20px; width: 20px;"
				viewBox="0 0 20 20"
				><circle style="fill: rgb(25, 46, 56); opacity: 1;" class="bg" cx="10" cy="10" r="9" /><path
					class="outer_circle"
					d="M10,2a8,8,0,1,1-8,8,8.009,8.009,0,0,1,8-8m0-2A10,10,0,1,0,20,10,10,10,0,0,0,10,0Z"
				/></svg
			>
		{/if}
	</div>
	<div class="popup-menu-select-item-content">
		<slot />
	</div>
</div>

<style lang="scss">
	.popup-menu-select-item-icon {
		display: flex;

		& svg path {
			fill: #a0a0a0;
		}
	}

	.popup-menu-select-item-content {
		color: #a0a0a0;
		font-family: Lato, serif;
	}

	.popup-menu-select-item {
		display: flex;
		align-items: center;

		height: 42px;
		padding: 0 20px;

		cursor: pointer;

		&:hover {
			background-color: #23252b;
		}

		&:hover,
		&.active {
			& > .popup-menu-select-item-icon svg path {
				fill: #fff;
			}

			& > .popup-menu-select-item-content {
				color: #fff;
			}
		}
	}
</style>
