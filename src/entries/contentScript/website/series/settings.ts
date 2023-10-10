import { getElementMounted } from '~/entries/contentScript/player/utils';
import { SeriesSettings, subscribeSettings } from '~/lib/settings';
import NextEpisodeAirDate from '~/entries/contentScript/website/series/elements/NextEpisodeAirDate.svelte';
import { MountComponent } from '~/entries/contentScript/render';
import AnimeListLinks from '~/entries/contentScript/website/series/elements/AnimeListLinks.svelte';

const DomElements = {
	seriesRatingContainer: async (): Promise<HTMLDivElement> => {
		return await getElementMounted(
			(p) => p.querySelector('.action-buttons'),
			document.getElementById('content'),
			true
		);
	},
	seasonSelectContainer: async (): Promise<HTMLDivElement> => {
		return await getElementMounted(
			(p) => p.querySelector('.seasons-select'),
			document.getElementById('content'),
			true
		);
	}
};

async function nextEpisodeAirDateSetting(enable: boolean) {
	if (!enable) {
		MountComponent.unmount(NextEpisodeAirDate);
		return;
	}

	const seriesRatingContainer = await DomElements.seriesRatingContainer();
	const container = document.createElement('div');
	seriesRatingContainer.parentElement.insertBefore(container, seriesRatingContainer.nextSibling);
	MountComponent.mount(NextEpisodeAirDate, import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS, container);
}

let animeListLinkSeasonNameObserver: MutationObserver;
async function animeListLinkSetting(value: { anilist: boolean; mal: boolean }) {
	MountComponent.unmount(AnimeListLinks);
	if (!value.anilist && !value.mal) return;

	if (animeListLinkSeasonNameObserver) animeListLinkSeasonNameObserver.disconnect();

	const seasonSelectContainer = await DomElements.seasonSelectContainer();
	const seasonNameContainer = await getElementMounted(
		(p) => p.querySelector('h4'),
		seasonSelectContainer,
		true
	);

	const mountFunction = () => {
		MountComponent.unmount(AnimeListLinks);

		let seasonName = seasonNameContainer.innerText;
		// remove the season number prefix ('S1:', 'S2:', ...)
		seasonName = seasonName.replace(/^S\d+\s*[:-]\s*/, '');
		// remove the dub or episode indicator that some season have ('(German Dub)', '(English Dub)', '(25+)', ...)
		seasonName = seasonName.replace(/\([\w\s+-]+\)/, '');
		seasonName = seasonName.trim();

		MountComponent.mount(
			AnimeListLinks,
			import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS,
			seasonSelectContainer,
			{
				seasonName: seasonName,
				anilist: value.anilist,
				mal: value.mal
			}
		);
	};
	animeListLinkSeasonNameObserver = new MutationObserver(() => {
		mountFunction();
	});
	animeListLinkSeasonNameObserver.observe(seasonNameContainer, {
		characterData: true,
		childList: true,
		subtree: true
	});

	mountFunction();
}

export async function settings() {
	const subscriptionSettings = [SeriesSettings.NextEpisodeAirDate, SeriesSettings.AnimeListLinks];
	subscribeSettings(
		subscriptionSettings,
		(key, value) => {
			switch (key) {
				case SeriesSettings.NextEpisodeAirDate.key:
					nextEpisodeAirDateSetting(value);
					break;
				case SeriesSettings.AnimeListLinks.key:
					animeListLinkSetting(value);
					break;
			}
		},
		true
	);
}
