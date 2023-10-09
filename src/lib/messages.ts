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

// messages must be sent using a long living port. i would like to do it differently but when the popup menu is open,
// the normal browser.runtime.sendMessage doesn't return the correct results from the background script. i don't know
// why this is the case, the internet doesn't know it either
let port: browser.Runtime.Port | null = null;
export async function sendMessage<Req, Res>(
	message: Message<Req, Res>,
	content: Req
): Promise<Res> {
	if (!port) port = browser.runtime.connect();

	let resolve: (value: Res) => void;
	const promise = new Promise<Res>((r) => (resolve = r));

	const responseListener = (msg: { id: string; content: any }) => {
		if (msg.id == message.id) resolve(msg.content as unknown as Res);
	};
	port.onMessage.addListener(responseListener);

	port.postMessage({ ...message, content: content });

	const response = await promise;
	port.onMessage.removeListener(responseListener);

	return response;
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

export const JsonRequest: Message<{ url: string; init?: RequestInit }, any> = {
	id: 'jsonRequest'
};
