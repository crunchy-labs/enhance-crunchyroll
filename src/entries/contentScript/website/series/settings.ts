import { getElementMounted } from '~/entries/contentScript/player/utils';
import { SeriesSettings, subscribeSettings } from '~/lib/settings';
import NextEpisodeAirDate from '~/entries/contentScript/website/series/elements/NextEpisodeAirDate.svelte';
import { MountComponent } from '~/entries/contentScript/render';

export async function settings() {
	const seriesRatingContainer: HTMLDivElement = await getElementMounted(
		(p) => p.querySelector('.action-buttons'),
		document.getElementById('content'),
		true
	);

	const subscriptionSettings = [SeriesSettings.NextEpisodeAirDate];
	subscribeSettings(
		subscriptionSettings,
		(key, value) => {
			switch (key) {
				case SeriesSettings.NextEpisodeAirDate.key: {
					if (value) {
						const container = document.createElement('div');
						seriesRatingContainer.parentElement.insertBefore(
							container,
							seriesRatingContainer.nextSibling
						);
						MountComponent.mount(
							NextEpisodeAirDate,
							import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS,
							container
						);
					} else {
						MountComponent.unmount(NextEpisodeAirDate);
					}
					break;
				}
			}
		},
		true
	);
}
