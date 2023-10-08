<script lang="ts">
	import './main.scss';

	import { fly } from 'svelte/transition';
	import Downloads from '~/entries/popup/pages/downloads/Downloads.svelte';
	import Settings from '~/entries/popup/pages/settings/Settings.svelte';

	let tabs = ['downloads', 'settings'];

	let activeTab: string = tabs[0];

	let transitionInParams;
	$: transitionInParams = {
		x: tabs.indexOf(activeTab) == 0 ? -200 : 200,
		duration: 200
	};
	let transitionOutParams;
	$: transitionOutParams = {
		x: tabs.indexOf(activeTab) == 0 ? 200 : -200,
		duration: 200
	};
</script>

<main>
	<nav>
		{#each tabs as tab}
			<button on:click={() => (activeTab = tab)}>{tab}</button>
		{/each}
	</nav>
	<div class="main">
		{#if activeTab === 'downloads'}
			<div in:fly={transitionInParams} out:fly={transitionOutParams}>
				<Downloads />
			</div>
		{:else if activeTab === 'settings'}
			<div in:fly={transitionInParams} out:fly={transitionOutParams}>
				<Settings />
			</div>
		{/if}
	</div>
</main>

<style lang="scss">
	main {
		height: 100%;
	}

	nav {
		display: flex;
		align-items: center;
		justify-content: space-around;

		width: 100%;
		height: 3rem;

		background-color: #1d2021;

		button {
			border: none;
			background: none;
			color: #d1cdc7;
			font-size: 1rem;

			height: 100%;
			width: 100%;

			transition: background-color 0.1s;

			&:first-letter {
				text-transform: uppercase;
			}

			&:hover {
				background: #111213;
				color: #e8e6e3;
			}
		}
	}

	.main {
		display: grid;
		padding: 0.5rem 1rem;

		height: calc(100% - 3rem - 1rem);

		overflow-x: hidden;

		& > div {
			grid-column: 1;
			grid-row: 1;

			height: 100%;
		}
	}
</style>
