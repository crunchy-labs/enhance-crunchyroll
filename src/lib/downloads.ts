import browser from 'webextension-polyfill';
import { ActiveDownload as ActiveDownloadMsg, parseMessage } from '~/lib/messages';

export interface ActiveDownload {
	id: string;
	title: string;
	thumbnail: string;
	currentSegment: number;
	totalSegments: number;
	bytes: number;
}

export async function sendActiveDownload(download: ActiveDownload): Promise<boolean> {
	try {
		const response = await browser.runtime.sendMessage({ ...ActiveDownloadMsg, content: download });
		return response !== false;
	} catch (_) {
		return true;
	}
}

export function activeDownloadsListener(
	callback: (download: ActiveDownload) => Promise<boolean | void>
) {
	browser.runtime.onMessage.addListener(async (message) => {
		const parsed = parseMessage(message);
		if (parsed && parsed.id === ActiveDownloadMsg.id) {
			return await callback(parsed.content as ActiveDownload);
		}
	});
}
