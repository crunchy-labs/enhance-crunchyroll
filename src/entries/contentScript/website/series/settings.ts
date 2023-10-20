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
	seasonWithNavigationContainer: async (): Promise<HTMLDivElement> => {
		return await getElementMounted(
			(p) => p.querySelector('.erc-season-with-navigation'),
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

const relativeEpisodeNumbersEpisodeNumberRegex = /(E\d+)(?=\.|$)/;
let relativeEpisodeNumbersPairs = [];
let relativeEpisodeNumbersEpisodeListObserver: MutationObserver;
async function relativeEpisodeNumbersSetting(enable: boolean) {
	if (relativeEpisodeNumbersEpisodeListObserver)
		relativeEpisodeNumbersEpisodeListObserver.disconnect();

	if (!enable) {
		if (!relativeEpisodeNumbersPairs) return;

		for (const [card, relativeIdentifier, identifier] of relativeEpisodeNumbersPairs) {
			console.log(relativeIdentifier, identifier);
			card.innerHTML = card.innerHTML.replace(new RegExp(relativeIdentifier, 'gm'), identifier);
		}

		return;
	}
	relativeEpisodeNumbersPairs = [];

	let selfModify = false;
	const mountFunction = () => {
		const cards = document.querySelectorAll('.episode-list .card') as NodeListOf<HTMLDivElement>;

		let skipped = 0;
		for (const [i, card] of cards.entries()) {
			let identifier = card.querySelector('h4 a').textContent;
			identifier = identifier.split('-')[0].trim();

			const episodeNumber = relativeEpisodeNumbersEpisodeNumberRegex.exec(identifier);
			if (episodeNumber === null) {
				skipped++;
				continue;
			} else if (identifier.indexOf('.') != -1 || episodeNumber[0] == '0') {
				skipped++;
			}

			const relativeIdentifier = identifier.replace(
				relativeEpisodeNumbersEpisodeNumberRegex,
				`E${i + 1 - skipped}`
			);
			if (relativeIdentifier === identifier) continue;

			selfModify = true;
			relativeEpisodeNumbersPairs.push([card, relativeIdentifier, identifier]);
			card.innerHTML = card.innerHTML.replace(new RegExp(identifier, 'gm'), relativeIdentifier);
		}
	};

	const seasonWithNavigationContainer = await DomElements.seasonWithNavigationContainer();
	relativeEpisodeNumbersEpisodeListObserver = new MutationObserver(() => {
		// make sure that `mountFunction` is not re-triggered when the html is edited from inside it
		if (selfModify) {
			selfModify = false;
			return;
		}

		mountFunction();
	});
	relativeEpisodeNumbersEpisodeListObserver.observe(seasonWithNavigationContainer, {
		childList: true,
		subtree: true
	});

	mountFunction();
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
	const subscriptionSettings = [
		SeriesSettings.NextEpisodeAirDate,
		SeriesSettings.RelativeEpisodeNumber,
		SeriesSettings.AnimeListLinks
	];
	subscribeSettings(
		subscriptionSettings,
		(key, value) => {
			switch (key) {
				case SeriesSettings.NextEpisodeAirDate.key:
					nextEpisodeAirDateSetting(value);
					break;
				case SeriesSettings.RelativeEpisodeNumber.key:
					relativeEpisodeNumbersSetting(value);
					break;
				case SeriesSettings.AnimeListLinks.key:
					animeListLinkSetting(value);
					break;
			}
		},
		true
	);
}
