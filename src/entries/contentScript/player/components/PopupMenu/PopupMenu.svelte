<script lang="ts">
	import Button from '~/entries/contentScript/player/components/Button/Button.svelte';
	import PopupMenuItem from '~/entries/contentScript/player/components/PopupMenu/PopupMenuItem.svelte';
	import PopupMenuSelect from '~/entries/contentScript/player/components/PopupMenu/PopupMenuSelect.svelte';
	import { getElementMounted } from '~/entries/contentScript/player/utils';
	import type { Item } from '~/entries/contentScript/player/components/PopupMenu/popupMenu';
	import { createEventDispatcher } from 'svelte';
	import PrimarySpinner from '~/entries/contentScript/components/PrimarySpinner.svelte';

	export let itemsFn: () => Promise<Item[]>;

	const itemsFnWrapper = async () => {
		try {
			const items = await itemsFn();
			dispatchItemsChange(items);
			return items;
		} catch (e) {
			console.error(e);
			throw e;
		}
	};
	let activeItemSelect: Item | null = null;

	let popupOpen = false;
	let popupElem: HTMLDivElement;

	let nativeSettingsButton: HTMLDivElement;
	let abortController: AbortController;
	function showPopup() {
		const settingsControl = document.getElementById('settingsControl');
		nativeSettingsButton = settingsControl.firstElementChild.firstElementChild
			.firstElementChild as HTMLDivElement;

		nativeSettingsButton.click();
		nativeSettingsButton.style.backgroundColor = '';

		const controlsContainer = document.getElementById('vilosControlsContainer') as HTMLDivElement;
		getElementMounted(
			() => document.getElementById('velocity-settings-menu'),
			controlsContainer
		).then((menu) => (menu.style.display = 'none'));

		abortController = new AbortController();
		document.addEventListener(
			'click',
			(e) => {
				if (
					!(e.target as HTMLElement).contains(popupElem) &&
					!popupElem.contains(e.target as HTMLElement)
				) {
					hidePopup();
				}
			},
			{ signal: abortController.signal }
		);
	}
	function hidePopup() {
		abortController.abort();
		nativeSettingsButton.click();
		popupOpen = false;
	}

	$: if (popupOpen) showPopup();

	const dispatch = createEventDispatcher();
	function dispatchItemsChange(items: Item[]) {
		dispatch(
			'change',
			items.map((item) => {
				return { id: item.id, value: item.value };
			})
		);
	}
</script>

<div bind:this={popupElem}>
	{#if popupOpen}
		<div class="popup">
			{#await itemsFnWrapper()}
				<span class="loading">
					<span>
						<PrimarySpinner />
					</span>
				</span>
			{:then items}
				{#if activeItemSelect !== null}
					<PopupMenuSelect
						name={activeItemSelect.name}
						items={activeItemSelect.items}
						bind:value={activeItemSelect.value}
						on:click={() => {
							dispatchItemsChange(items);
							activeItemSelect = null;
						}}
						on:close={() => (activeItemSelect = null)}
					/>
				{:else}
					{#each items as item}
						<PopupMenuItem
							name={item.name}
							value={item.items.find((i) => i.value === item.value)?.name || 'n/a'}
							on:click={() => (activeItemSelect = item)}
						/>
					{/each}
					{#if $$slots.default}
						<div class="extra-content">
							<slot />
						</div>
					{/if}
				{/if}
			{:catch error}
				<div class="error">
					<p>{error}</p>
				</div>
			{/await}
		</div>
	{/if}
	<div class="button" class:active={popupOpen}>
		<Button on:click={() => (popupOpen ? hidePopup() : (popupOpen = true))}>
			<slot name="button" />
		</Button>
	</div>
</div>

<style lang="scss">
	.button {
		transition: all 0.125ms ease;

		opacity: 0.85;

		&.active {
			background-color: #141519;

			opacity: 1;
		}
	}

	.popup {
		font: 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
		line-height: 18px;

		background-color: #141519;

		position: absolute;
		transform: translateY(-100%);

		width: 320px;
		padding: 10px 0;
	}

	.error {
		color: red;

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

		margin: 0 1rem;
	}

	.loading {
		display: flex;
		justify-content: center;
		align-items: center;

		width: 100%;
		height: 100%;

		& > span {
			width: 2rem;
			height: 2rem;
		}
	}

	.extra-content {
		display: flex;
		align-items: center;

		width: calc(100% - 20px);
		margin: 0 10px;
	}
</style>
