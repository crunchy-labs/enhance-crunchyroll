import type { ActiveDownload as ActiveDownloadType } from '~/lib/downloads';
import browser from 'webextension-polyfill';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Message<Req, Res> {
	id: string;
}

export type MessageReqType<Type> = Type extends Message<infer Req, any> ? Req : never;
export type MessageResType<Type> = Type extends Message<any, infer Res> ? Res : never;

export type MessageRequest<M extends Message<any, any>> = M & {
	content: MessageReqType<M>;
};

export function parseMessage<Req, Res, M extends Message<Req, Res>>(
	payload: any
): MessageRequest<M> | null {
	if (!('id' in payload)) {
		return null;
	}

	return payload;
}

export async function sendMessage<Req, Res>(
	message: Message<Req, Res>,
	content: Req
): Promise<Res> {
	return await browser.runtime.sendMessage({ ...message, content: content });
}

export const HlsDownload: Message<
	{
		id: string;
		title: string;
		thumbnail: string;
		url: string;
		filename: string;
	},
	boolean
> = {
	id: 'hlsDownload'
};

export const ActiveDownload: Message<ActiveDownloadType, boolean> = {
	id: 'activeDownload'
};
