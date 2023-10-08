import { getSetting, PlayerSettings } from '~/lib/settings';
import type { Downloads } from 'webextension-polyfill';
import browser from 'webextension-polyfill';
import { HlsDownload, type MessageRequest, parseMessage } from '~/lib/messages';
import { downloadHls } from '~/entries/background/download';
import { waitForCallback } from '~/lib/utils';

browser.runtime.onMessage.addListener(async (message) => {
	const parsed = parseMessage(message);
	if (parsed == null) return;

	switch (parsed.id) {
		case HlsDownload.id: {
			const content = (parsed as MessageRequest<typeof HlsDownload>).content;

			if ('showSaveFilePicker' in window) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const file: FileSystemFileHandle = await window.showSaveFilePicker({
					suggestedName: content.filename,
					types: [{ description: 'test', accept: { 'video/mp2t': ['.ts'] } }]
				});

				const writer = (await file.createWritable()).getWriter();

				const success = await downloadHls(content, async (data) => {
					await writer.write(data);
				});
				if (!success) return false;

				await writer.close();
			} else {
				const buf = [];

				const success = await downloadHls(content, async (data) => {
					buf.push(data);
				});
				if (!success) return false;

				const objectUrl = URL.createObjectURL(new Blob(buf));
				const downloadId = await browser.downloads.download({
					url: objectUrl,
					filename: content.filename
				});

				await waitForCallback(
					(delta: Downloads.OnChangedDownloadDeltaType) => {
						if (delta.id == downloadId && delta.state?.current === 'complete') {
							URL.revokeObjectURL(objectUrl);
							return true;
						}
					},
					browser.downloads.onChanged.addListener,
					browser.downloads.onChanged.removeListener
				);
			}

			return true;
		}
	}
});

const drmManifestUrlPattern =
	/^https:\/\/cr-play-service\.prd\.crunchyrollsvc\.com\/v1\/manifest\/(?<id>\w+)\/.*?playbackGuid=(?<guid>[^&]+).*$/gm;

browser.webRequest.onBeforeSendHeaders.addListener(
	async (details) => {
		if (!(await getSetting(PlayerSettings.NoStreamLimit)) || details.method !== 'GET') return;

		const [id, guid] = drmManifestUrlPattern.exec(details.url).splice(1);
		// header is 'Bearer <jwt>'
		const authorization = details.requestHeaders
			.find((h) => h.name.toLowerCase() === 'authorization')
			.value.split(' ')[1];

		const requestBody = new FormData();
		requestBody.append('jwtToken', authorization);

		// send request to the endpoint with deletes the tracking of the current active stream. the timeout is set to
		// give the request which triggered this function time to complete
		setTimeout(async () => {
			await fetch(`https://cr-play-service.prd.crunchyrollsvc.com/v1/token/${id}/${guid}/delete`, {
				method: 'POST',
				body: requestBody
			});
		}, 5000);

		return {};
	},
	{
		urls: ['https://cr-play-service.prd.crunchyrollsvc.com/v1/manifest/*'],
		types: ['xmlhttprequest']
	},
	['requestHeaders']
);
