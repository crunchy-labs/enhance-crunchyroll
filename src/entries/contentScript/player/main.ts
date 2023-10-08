import { getElementMounted } from '~/entries/contentScript/player/utils';
import { render } from '~/entries/contentScript/render';
import DownloadButton from '~/entries/contentScript/player/elements/DownloadButton.svelte';
import { settings } from '~/entries/contentScript/player/settings';
import { communication } from '~/entries/contentScript/player/communication';

function mountDownloadButton(videoControls: HTMLDivElement) {
	render(import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS, videoControls, (appRoot) => {
		new DownloadButton({
			target: appRoot
		});
	});
}

async function main() {
	const player = document.getElementById('vilos') as HTMLDivElement;
	const controlsContainer = await getElementMounted(
		(p) => p.querySelector('#vilosControlsContainer'),
		player,
		true
	);

	new MutationObserver(async () => {
		const settingsControl = controlsContainer.querySelector('#settingsControl');
		if (settingsControl == null) return;

		const controls = settingsControl.parentElement.parentElement!;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [videoControls, playerControls] = controls.children as unknown as HTMLDivElement[];

		mountDownloadButton(videoControls);
	}).observe(controlsContainer, {
		childList: true
	});
}

main();
communication();
settings();
