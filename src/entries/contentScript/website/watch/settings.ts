import { MountComponent } from '~/entries/contentScript/render';
import AnimeListLinks from '~/entries/contentScript/website/watch/elements/AnimeListLinks.svelte';
import { getElementMounted } from '~/entries/contentScript/player/utils';
import { subscribeSettings, WatchSettings } from '~/lib/settings';

const DomElements = {
	headerContainer: async (): Promise<HTMLDivElement> => {
		return await getElementMounted(
			(p) => p.querySelector('.current-media-header'),
			document.getElementById('content'),
			true
		);
	},
	episodeActionsContainer: async (): Promise<HTMLDivElement> => {
		return await getElementMounted(
			(p) => p.querySelector('.episode-actions'),
			document.getElementById('content'),
			true
		);
	}
};

let animeListLinkSeasonNameObserver: MutationObserver;
async function animeListLinkSetting(value: { anilist: boolean; mal: boolean }) {
	MountComponent.unmount(AnimeListLinks);
	if (!value.anilist && !value.mal) return;

	if (animeListLinkSeasonNameObserver) animeListLinkSeasonNameObserver.disconnect();

	const episodeActionsContainer = await DomElements.headerContainer();
	const rightContainer = document.createElement('div');
	rightContainer.style.display = 'flex';
	rightContainer.style.alignItems = 'center';
	rightContainer.appendChild(episodeActionsContainer.lastChild);
	episodeActionsContainer.appendChild(rightContainer);

	const container = document.createElement('div');
	rightContainer.prepend(container);

	const mountFunction = async () => {
		MountComponent.unmount(AnimeListLinks);

		const headerContainer = await DomElements.headerContainer();
		let seasonName = headerContainer.querySelector('h4').innerText;
		// remove the season number prefix ('S1:', 'S2:', ...)
		seasonName = seasonName.replace(/^S\d+\s*[:-]\s*/, '');
		// remove the dub or episode indicator that some season have ('(German Dub)', '(English Dub)', '(25+)', ...)
		seasonName = seasonName.replace(/\([\w\s+-]+\)/, '');
		seasonName = seasonName.trim();

		MountComponent.mount(AnimeListLinks, import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS, container, {
			seasonName: seasonName,
			anilist: value.anilist,
			mal: value.mal
		});
	};
	animeListLinkSeasonNameObserver = new MutationObserver(() => {
		mountFunction();
	});
	animeListLinkSeasonNameObserver.observe(episodeActionsContainer, {
		characterData: true,
		childList: true
	});

	await mountFunction();
}

export async function settings() {
	const subscriptionSettings = [WatchSettings.AnimeListLinks];
	subscribeSettings(
		subscriptionSettings,
		(key, value) => {
			switch (key) {
				case WatchSettings.AnimeListLinks.key:
					animeListLinkSetting(value);
					break;
			}
		},
		true
	);
}
