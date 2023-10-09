<script lang="ts">
	import Section from '~/entries/popup/components/Section.svelte';
	import {
		type Setting,
		DebugSettings,
		getSetting,
		setSetting,
		PlayerSettings,
		SeriesSettings
	} from '~/lib/settings';
	import type { Writable } from 'svelte/store';
	import { get, writable } from 'svelte/store';

	async function settingStoreProxy<T>(setting: Setting<T>): Promise<Writable<T>> {
		const store = writable<T>(await getSetting(setting));

		let firstRun = true;
		store.subscribe(async (value) =>
			firstRun ? (firstRun = false) : await setSetting(setting, value)
		);

		return store;
	}

	let sections = [];
	(async () => {
		sections = [
			{
				name: 'Player',
				open: true,
				entries: [
					{
						name: 'Disable stream limit',
						details: 'Disable the max. parallel stream limit',
						setting: PlayerSettings.NoStreamLimit,
						value: await settingStoreProxy(PlayerSettings.NoStreamLimit)
					},
					{
						name: 'Default context menu',
						details: 'Show the default context menu instead of the custom one when right clicking',
						setting: PlayerSettings.DefaultContextMenu,
						value: await settingStoreProxy(PlayerSettings.DefaultContextMenu)
					}
				]
			},
			{
				name: 'Series',
				open: true,
				entries: [
					{
						name: 'Show next episode airing date',
						details: 'Show the date when the next episode of a series airs',
						setting: SeriesSettings.NextEpisodeAirDate,
						value: await settingStoreProxy(SeriesSettings.NextEpisodeAirDate)
					}
				]
			},
			{
				name: 'Debug',
				open: false,
				entries: [
					{
						name: 'Show console download progress',
						details: 'Show the video download progress in the console',
						setting: DebugSettings.ShowConsoleDownloadProgress,
						value: await settingStoreProxy(DebugSettings.ShowConsoleDownloadProgress)
					}
				]
			}
		];
	})();
</script>

<div class="settings">
	{#each sections as section}
		<div>
			<Section title={section.name} open={section.open}>
				<table style="width: 100%">
					<colgroup>
						<col style="width: 75%" />
						<col style="width: 25%" />
					</colgroup>
					{#each section.entries as entry}
						<tr>
							<td>
								<label for={entry.setting.key} title={entry.details}>{entry.name}</label>
							</td>
							<td>
								{#if typeof entry.setting.default === 'boolean'}
									<input
										id={entry.setting.key}
										type="checkbox"
										checked={get(entry.value)}
										on:change={(e) => entry.value.set(e.target.checked)}
									/>
								{/if}
							</td>
						</tr>
					{/each}
				</table>
			</Section>
		</div>
	{/each}
</div>

<style lang="scss">
	.settings {
		display: flex;
		flex-direction: column;
		row-gap: 1rem;
	}

	table {
		border-spacing: 0 0.5rem;

		tr {
			transition: color 0.2s ease;

			&:hover {
				color: #2abdbb;
			}
		}

		td > * {
			display: block;
		}
	}
</style>
