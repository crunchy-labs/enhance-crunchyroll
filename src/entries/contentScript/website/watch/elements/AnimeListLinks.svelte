<script lang="ts">
	import { anilistApiRequest } from '~/entries/contentScript/api';

	export let seasonName: string;
	export let anilist: boolean;
	export let mal: boolean;

	let anilistId: number;
	let malId: number;

	(async () => {
		const externalIdsQuery = `
		query {
			Media(search: "${seasonName}", type: ANIME) {
				id
				idMal
			}
		}
		`;

		const json: { data: { Media: { id: number; idMal: number } } } =
			await anilistApiRequest(externalIdsQuery);

		anilistId = json.data.Media.id;
		malId = json.data.Media.idMal;
	})();
</script>

<div>
	{#if anilist && anilistId}
		<a href="https://anilist.co/anime/{anilistId}" target="_blank">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"
				><path fill="#1e2630" d="M0 0h1024v1024H0" style="stroke-width:2" /><path
					fill="#02a9ff"
					d="M643.84 646.54V273.199c0-21.395-11.773-33.203-33.116-33.203h-72.865c-21.344 0-33.123 11.808-33.123 33.203v177.303c0 4.993 47.992 28.178 49.245 33.082 36.565 143.219 7.945 257.84-26.717 263.2 56.675 2.81 62.91 30.128 20.696 11.462 6.458-76.418 31.656-76.269 104.098-2.812.62.634 14.854 30.564 15.74 30.564h171.09c21.344 0 33.116-11.8 33.116-33.2v-73.048c0-21.396-11.772-33.203-33.116-33.203z"
					style="stroke-width:2"
				/><path
					fill="#fefefe"
					d="M341.36 240 149.999 786h148.676l32.384-94.444h161.92L524.63 786h147.936L481.938 240Zm23.553 330.56 46.365-151.258 50.785 151.258z"
					style="stroke-width:2"
				/></svg
			>
		</a>
	{/if}
	{#if mal && malId}
		<a href="https://myanimelist.net/anime/{malId}" target="_blank">
			<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"
				><path d="M0 0h1024v1024H0Z" style="fill:#2e51a2;stroke-width:.99968" /><path
					d="M387.56 353.284v281.231l-70.21-.094v-174.1l-67.784 80.273-66.407-82.073-.673 176.464h-71.149V353.347h73.56l62.274 84.969 67.3-85zm288.07 69.083.83 211.522H597.5l-.265-95.862h-93.483c2.332 16.669 7.012 42.258 13.93 59.474 5.18 12.724 9.953 25.041 19.469 37.656l-56.922 37.562c-11.66-21.238-20.769-44.636-29.314-69.521a310.373 310.373 0 0 1-16.935-72.761c-2.833-25.042-3.24-49.113 3.569-73.857a130.481 130.481 0 0 1 38.767-62.306c10.455-9.782 25.041-16.7 36.733-22.944 11.69-6.245 24.806-8.812 36.967-11.989a247.284 247.284 0 0 1 39.769-6.104c13.287-1.142 36.967-2.206 79.82-.939l18.201 58.394H595.81c-19.798.266-29.314 0-44.777 6.98a74.655 74.655 0 0 0-42.664 64.169l88.913 1.095 1.267-60.428h77.097zm133.299-70.037v221.225l103.734 1.017-14.352 59.27h-160.5V351.281Z"
					style="fill:#fff;stroke-width:1.56459;stroke-dasharray:none"
				/></svg
			>
		</a>
	{/if}
</div>

<style lang="scss">
	div {
		display: flex;
		align-items: center;
		gap: 0.25rem;

		height: 100%;
		margin-left: 0.6rem;
	}

	a {
		width: 20px;
		height: 20px;

		& svg {
			border-radius: 2px;
		}
	}
</style>
