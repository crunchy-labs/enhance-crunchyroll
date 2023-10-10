import { JsonRequest, sendMessage } from '~/lib/messages';

export async function anilistApiRequest<T>(query: string): Promise<T> {
	return await sendMessage(JsonRequest, {
		url: 'https://graphql.anilist.co',
		init: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ query: query })
		}
	});
}
