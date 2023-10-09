import { getElementMounted } from '~/entries/contentScript/player/utils';
import { SeriesSettings, subscribeSettings } from '~/lib/settings';
import { render } from '~/entries/contentScript/render';
import NextEpisodeAirDate from '~/entries/contentScript/series/elements/NextEpisodeAirDate.svelte';
import type { SvelteComponent } from 'svelte';

class ElementMount {
	static elems: Map<string, HTMLElement> = new Map();

	static async mount(component: typeof SvelteComponent, target: HTMLElement) {
		const elem = await render(import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS, target, (app) => {
			new component({
				target: app
			});
		});

		this.elems.set(component.name, elem);
	}

	static unmount(component: typeof SvelteComponent) {
		const elem = this.elems.get(component.name);
		if (!elem) return;
		elem.remove();
		this.elems.delete(component.name);
	}
}

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
						ElementMount.mount(NextEpisodeAirDate, container);
					} else {
						ElementMount.unmount(NextEpisodeAirDate);
					}
					break;
				}
			}
		},
		true
	);
}
