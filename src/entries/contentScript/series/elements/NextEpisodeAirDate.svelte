<script lang="ts">
	import { JsonRequest, sendMessage } from '~/lib/messages';

	let airingDate: Date | null = null;

	(async () => {
		const nextAiringEpisodeQuery = `
      query {
        Media(search: "${
					document.location.pathname.split('/').slice(-1)[0]
				}", type: ANIME, status: RELEASING) {
          nextAiringEpisode {
            airingAt
          }
        }
      }
      `;

		const json: { data: { Media: { nextAiringEpisode: { airingAt: number } | null } } } =
			await sendMessage(JsonRequest, {
				url: 'https://graphql.anilist.co',
				init: {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ query: nextAiringEpisodeQuery })
				}
			});
		if (json.data.Media.nextAiringEpisode?.airingAt) {
			airingDate = new Date(json.data.Media.nextAiringEpisode.airingAt * 1000);
		}
	})();
</script>

{#if airingDate}
	<div style="margin: -1rem 0 1.625rem">
		<p style="text-decoration: underline #f47521">
			Next episode airs on {Intl.DateTimeFormat('en-GB', {
				day: '2-digit',
				weekday: 'long',
				month: '2-digit'
			}).format(airingDate)} at {Intl.DateTimeFormat('en-US', {
				minute: '2-digit',
				hour: '2-digit'
			}).format(airingDate)}
		</p>
	</div>
{/if}
