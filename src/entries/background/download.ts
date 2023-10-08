import { Parser as m3u8Parser } from 'm3u8-parser/dist/m3u8-parser';
import { DebugSettings, getSetting, subscribeSetting } from '~/lib/settings';
import { type ActiveDownload, sendActiveDownload } from '~/lib/downloads';
import { type HlsDownload, type MessageReqType } from '~/lib/messages';

export async function downloadHls(
	hlsDownload: MessageReqType<typeof HlsDownload>,
	callback: (data: ArrayBuffer) => Promise<void>
): Promise<boolean> {
	const { rawKey, decryptionKey, segmentUrls } = await getHlsData(hlsDownload.url);

	let consoleProgress = await getSetting(DebugSettings.ShowConsoleDownloadProgress);
	subscribeSetting(
		DebugSettings.ShowConsoleDownloadProgress,
		(newValue) => (consoleProgress = newValue)
	);

	const download: ActiveDownload = {
		id: hlsDownload.id,
		title: hlsDownload.title,
		thumbnail: hlsDownload.thumbnail,
		currentSegment: 0,
		totalSegments: segmentUrls.length,
		bytes: 0
	};

	for (const [i, segmentUrl] of segmentUrls.entries()) {
		const segmentRes = await fetch(segmentUrl);
		const segmentData = await segmentRes.arrayBuffer();

		const decrypted = await window.crypto.subtle.decrypt(
			{ name: 'AES-CBC', iv: rawKey },
			decryptionKey,
			segmentData
		);
		await callback(decrypted);

		download.currentSegment += 1;
		download.bytes += decrypted.byteLength;

		const continueDownload = await sendActiveDownload(download);
		if (!continueDownload) return false;

		if (consoleProgress) {
			console.log(
				`Downloaded and decrypted segment [${i + 1}/${segmentUrls.length} ${(
					((i + 1) / segmentUrls.length) *
					100
				).toFixed(2)}%] ${segmentUrl}`
			);
		}
	}

	return true;
}

async function getHlsData(
	url: string
): Promise<{ rawKey: ArrayBuffer; decryptionKey: CryptoKey; segmentUrls: string[] }> {
	const m3u8StreamRes = await fetch(url);
	const m3u8StreamData = await m3u8StreamRes.text();

	const m3u8StreamParser = new m3u8Parser();
	m3u8StreamParser.push(m3u8StreamData);
	m3u8StreamParser.end();

	const keyRes = await fetch(m3u8StreamParser.manifest.segments[0].key.uri);
	const keyData = await keyRes.arrayBuffer();

	return {
		rawKey: keyData,
		decryptionKey: await window.crypto.subtle.importKey('raw', keyData, 'AES-CBC', true, [
			'decrypt',
			'encrypt'
		]),
		segmentUrls: m3u8StreamParser.manifest.segments.map((s) => s.uri)
	};
}
