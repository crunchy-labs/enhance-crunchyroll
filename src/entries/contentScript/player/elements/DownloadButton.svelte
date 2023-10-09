<script lang="ts">
	import { HlsDownload, sendMessage } from '~/lib/messages';
	import PopupMenu from '~/entries/contentScript/player/components/PopupMenu/PopupMenu.svelte';
	import PrimaryButton from '~/entries/contentScript/components/PrimaryButton.svelte';
	import { Parser as m3u8Parser } from 'm3u8-parser/dist/m3u8-parser';
	import type { Item } from '~/entries/contentScript/player/components/PopupMenu/popupMenu';
	import { getJwt } from '~/entries/contentScript/auth';
	import { id } from '~/entries/contentScript/player/communication';

	let objectData: {
		title: string;
		images: { thumbnail: { source: string }[][] };
		streams_link: string;
	} | null = null;
	let streamData: [{ width: number; height: number; url: string }] | null = null;

	type QualityValue = { width: number; height: number };

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	let downloadDetails: {
		id: string;
		title: string;
		sources: { [key: number]: string };
		options: { quality: QualityValue };
	} = {};
	async function settings(): Promise<Item[]> {
		const qualityItems = await loadQualityItems();

		return [
			{
				id: 'quality',
				name: 'Quality',
				items: qualityItems.map((v) => {
					return { name: `${v.height}p`, value: v };
				}),
				value: qualityItems[0]
			}
		];
	}

	async function loadQualityItems(): Promise<QualityValue[]> {
		if (objectData == null || streamData == null) {
			const jwt = await getJwt();

			if (objectData == null) {
				const objectRes = await fetch(`https://www.crunchyroll.com/content/v2/cms/objects/${id}`, {
					headers: {
						Authorization: `Bearer ${jwt}`
					}
				});
				objectData = (await objectRes.json()).data[0];
			}
			if (streamData == null) {
				const streamRes = await fetch(`https://www.crunchyroll.com${objectData.streams_link}`, {
					headers: {
						Authorization: `Bearer ${jwt}`
					}
				});
				const streamJson: { data: [{ adaptive_hls: { '': { url: string } } }] } =
					await streamRes.json();

				const m3u8MasterRes = await fetch(streamJson.data[0].adaptive_hls[''].url);
				const m3u8MasterData = await m3u8MasterRes.text();

				const m3u8MasterParser = new m3u8Parser();
				m3u8MasterParser.push(m3u8MasterData);
				m3u8MasterParser.end();

				streamData = m3u8MasterParser.manifest.playlists
					.map((p) => {
						return {
							width: p.attributes.RESOLUTION.width,
							height: p.attributes.RESOLUTION.height,
							url: p.uri
						};
					})
					.sort((a, b) => b.height - a.height);
			}
		}

		downloadDetails.id = id;
		downloadDetails.title = objectData.title;
		downloadDetails.sources = streamData.reduce((prev, curr) => {
			return { ...prev, [curr.height]: curr.url };
		}, {});
		downloadDetails.options = { quality: { width: 0, height: 0 } };

		return streamData.map((s) => {
			return { width: s.width, height: s.height };
		});
	}

	async function download() {
		await sendMessage(HlsDownload, {
			id: id,
			title: objectData.title,
			thumbnail: objectData.images.thumbnail[0][0].source,
			url: downloadDetails.sources[downloadDetails.options.quality.height],
			filename: `${downloadDetails.title}.ts`
		});
	}
</script>

<PopupMenu
	itemsFn={settings}
	on:change={(e) =>
		(downloadDetails.options = e.detail.reduce((prev, curr) => {
			return { ...prev, [curr.id]: curr.value };
		}, {}))}
>
	<div slot="button">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			width="20"
			height="20"
			style="filter: invert(1)"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
			/>
		</svg>
	</div>
	<div class="download-button">
		<PrimaryButton on:click={download}>Download</PrimaryButton>
	</div>
</PopupMenu>

<style lang="scss">
	.download-button {
		width: 100%;

		margin-top: 0.5rem;
	}
</style>
