import { getElementMounted } from '~/entries/contentScript/player/utils';
import { MountComponent } from '~/entries/contentScript/render';
import DownloadButton from '~/entries/contentScript/player/elements/DownloadButton.svelte';
import { settings } from '~/entries/contentScript/player/settings';

export let id = '';

let observer: MutationObserver;
async function onMessage(message: MessageEvent) {
	const data: { value?: { media?: { metadata: { id: string } } } } = JSON.parse(message.data);

	if (data.value?.media?.metadata.id == undefined) return;
	id = data.value.media.metadata.id;

	if (observer) {
		observer.disconnect();
	}

	const player = document.getElementById('vilos') as HTMLDivElement;
	const controlsContainer = await getElementMounted(
		(p) => p.querySelector('#vilosControlsContainer'),
		player,
		true
	);
	observer = new MutationObserver(async () => {
		const settingsControl = controlsContainer.querySelector('#settingsControl');
		if (settingsControl == null) return;

		const controls = settingsControl.parentElement.parentElement!;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [videoControls, playerControls] = controls.children as unknown as HTMLDivElement[];

		MountComponent.mount(DownloadButton, import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS, videoControls);
	});

	observer.observe(controlsContainer, {
		childList: true
	});
}

async function main() {
	window.addEventListener('message', onMessage);
}

main();
settings();
