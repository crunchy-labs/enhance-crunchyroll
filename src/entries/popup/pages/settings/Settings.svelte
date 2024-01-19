<script lang="ts">
	import Section from '~/entries/popup/components/Section.svelte';
	import {
		type Setting,
		DebugSettings,
		getSetting,
		setSetting,
		PlayerSettings,
		SeriesSettings,
		WatchSettings
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

	let sections: {
		name: string;
		open: boolean;
		entries: {
			name: string;
			details: string;
			setting: Setting<any>;
			value: any;
			values?: { name: string; key: string }[];
		}[];
	}[] = [];
	(async () => {
		sections = [
			{
				name: 'Player',
				open: true,
				entries: [
					{
						name: 'Double click to maximize',
						details: 'Shows the video player in fullscreen when double clicking it',
						setting: PlayerSettings.DoubleClickMaximize,
						value: await settingStoreProxy(PlayerSettings.DoubleClickMaximize)
					},
					{
						name: 'Disable stream limit',
						details:
							'Disable the max. parallel stream limit. With this enabled, the player may stop playing the video and ' +
							'show an error more often (a reload of the page fixes this)',
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
					},
					{
						name: 'Relative episode numbers',
						details: 'Show episode numbers relative to the season',
						setting: SeriesSettings.RelativeEpisodeNumber,
						value: await settingStoreProxy(SeriesSettings.RelativeEpisodeNumber)
					},
					{
						name: 'External anime list links',
						details: 'Show links to external anime list/tracking websites',
						setting: SeriesSettings.AnimeListLinks,
						value: await settingStoreProxy(SeriesSettings.AnimeListLinks),
						values: [
							{ name: 'AniList', key: 'anilist' },
							{ name: 'MyAnimeList', key: 'mal' }
						]
					}
				]
			},
			{
				name: 'Watch',
				open: true,
				entries: [
					{
						name: 'External anime list links',
						details: 'Show links to external anime list/tracking websites',
						setting: WatchSettings.AnimeListLinks,
						value: await settingStoreProxy(WatchSettings.AnimeListLinks),
						values: [
							{ name: 'AniList', key: 'anilist' },
							{ name: 'MyAnimeList', key: 'mal' }
						]
					}
				]
			},
			{
				name: 'Debug',
				open: false,
				entries: [
					{
						name: 'Show debug console download progress',
						details: 'Show the video download progress in the extension debug console',
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
				<table>
					{#each section.entries as entry}
						<tr class:subtable-label={!(typeof entry.setting.default === 'boolean')}>
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
						{#if typeof entry.setting.default === 'object'}
							<tr class="subtable">
								<table>
									{#each entry.values || [] as value}
										<tr>
											<td>
												<label for={`${entry.setting.key}-${value.key}`}>{value.name}</label>
											</td>
											<td>
												<input
													id={`${entry.setting.key}-${value.key}`}
													type="checkbox"
													checked={get(entry.value)[value.key]}
													on:change={(e) =>
														entry.value.set({ ...get(entry.value), [value.key]: e.target.checked })}
												/>
											</td>
										</tr>
									{/each}
								</table>
							</tr>
						{/if}
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
		table-layout: fixed;
		width: 100%;

		tr {
			transition: color 0.2s ease;

			&:not(.subtable):not(.subtable-label) {
				&:hover {
					color: #2abdbb;
				}

				& td > * {
					display: block;
				}
			}
		}

		td {
			&:nth-child(1) {
				width: 75%;
			}
			&:nth-child(2) {
				width: 25%;
			}
		}
	}

	.subtable {
		display: block;
		margin: -0.675rem 0 0 2rem;
	}
</style>
