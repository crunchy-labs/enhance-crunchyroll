<script lang="ts">
	import { type Writable, writable } from 'svelte/store';
	import { type ActiveDownload, activeDownloadsListener } from '~/lib/downloads';
	import { bytesToHumanReadable } from '~/entries/popup/pages/downloads/downloads';

	let activeDownloads: Writable<{ [key: string]: ActiveDownload }> = writable({});
	let stopActiveDownloadIds: string[] = [];

	activeDownloadsListener(async (download) => {
		if (download.currentSegment == download.totalSegments) {
			delete $activeDownloads[download.id];
			return;
		}

		$activeDownloads[download.id] = download;

		const stopIndex = stopActiveDownloadIds.indexOf(download.id);
		if (stopIndex != -1) {
			stopActiveDownloadIds.splice(stopIndex, 1);
			delete $activeDownloads[download.id];
			return false;
		}
	});
</script>

<div class="container">
	{#each Object.values($activeDownloads) as download}
		<div class="download">
			<div class="download-details">
				<div class="download-details-main">
					<img src={download.thumbnail} alt="" />
					<p>{download.title}</p>
				</div>
				<div class="download-details-actions">
					<button on:click={() => stopActiveDownloadIds.push(download.id)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
							/>
						</svg>
					</button>
				</div>
			</div>
			<div class="download-progress">
				<div class="download-progress-bar">
					<div style="width: {(download.currentSegment / download.totalSegments) * 100}%" />
				</div>
				<div class="download-progress-size">
					<p>{bytesToHumanReadable(download.bytes, 2)}</p>
				</div>
			</div>
			<hr />
		</div>
	{/each}
	{#if Object.keys($activeDownloads).length === 0}
		<div class="no-downloads">
			<p>No downloads</p>
		</div>
	{/if}
</div>

<style lang="scss">
	.container {
		height: 100%;
	}

	.download {
		hr {
			background-color: darkgray;

			height: 1px;
			margin: 8px 10px 12px 10px;
		}

		&:last-child hr {
			display: none;
		}
	}

	.download-details {
		display: flex;
		flex-direction: row;

		width: 100%;
	}

	.download-details-main {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;

		width: 85%;

		& img {
			width: 100px;
		}

		& p {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;

			margin: 0;
		}
	}

	.download-details-actions {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		width: 15%;

		& button {
			background: none;
			border: none;

			width: 2rem;
			height: 2rem;

			transition: color 0.15s;
			color: white;

			cursor: pointer;

			&:hover {
				color: red;
			}
		}
	}

	.download-progress {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;

		width: 100%;
	}

	.download-progress-bar {
		background-color: #000;

		display: flex;
		align-items: center;

		width: 80%;
		height: 0.7rem;

		border-radius: 10px;

		& div {
			background-color: #f47521;

			height: 60%;
			margin: 0 0.5%;

			border-radius: 10px;
		}
	}

	.download-progress-size {
		font-size: 0.85rem;

		width: 20%;

		& p {
			margin: 0;
		}
	}

	.no-downloads {
		display: flex;
		align-items: center;
		justify-content: center;

		height: 100%;
	}
</style>
