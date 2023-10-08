export let id = '';

async function onMessage(message: MessageEvent) {
	const data: { value: { media?: { metadata: { id: string } } } } = JSON.parse(message.data);

	if (data.value.media?.metadata.id) {
		id = data.value.media.metadata.id;
	}
}

export function communication() {
	window.addEventListener('message', onMessage);
}
