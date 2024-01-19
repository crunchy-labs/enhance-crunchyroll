import { main as seriesMain } from '~/entries/contentScript/website/series/main';
import { main as watchMain } from '~/entries/contentScript/website/watch/main';

const pairs = [
	{ entry: seriesMain, pattern: /^https:\/\/www\.crunchyroll\.com(\/\w+)?\/series\/.*$/ },
	{ entry: watchMain, pattern: /^https:\/\/www\.crunchyroll\.com(\/\w+)?\/watch\/.*$/ }
];

function checkLocation() {
	for (const { entry, pattern } of pairs) {
		if (pattern.test(window.location.href)) {
			entry();
		}
	}
}

function main() {
	let loc = window.location.href;
	new MutationObserver(() => {
		if (window.location.href != loc) {
			checkLocation();
			loc = window.location.href;
		}
	}).observe(document.body, { childList: true, subtree: true });
}

main();
checkLocation();
