import browser from 'webextension-polyfill';

export interface Setting<T> {
	key: string;
	default: T;
}

export async function getSetting<T>(setting: Setting<T>): Promise<T> {
	const res = await browser.storage.local.get(setting.key);
	return res[setting.key] === undefined ? setting.default : res[setting.key];
}

export async function setSetting<T>(setting: Setting<T>, value: T) {
	await browser.storage.local.set({ [setting.key]: value });
}

export function subscribeSetting<T>(
	setting: Setting<T>,
	callback: (newValue: T, oldValue: T) => void
): () => void {
	const subscribeCallback = (changes: { [key: string]: browser.Storage.StorageChange }) => {
		const subscribed = changes[setting.key];
		if (subscribed !== undefined) {
			callback(subscribed.newValue, subscribed.oldValue);
		}
	};

	browser.storage.local.onChanged.addListener(subscribeCallback);

	return () => browser.storage.local.onChanged.removeListener(subscribeCallback);
}

export function subscribeSettings(
	settings: Setting<any>[],
	callback: (key: string, newValue: any, oldValue: any) => void,
	initialRead?: boolean
): () => void {
	const subscribeCallback = (changes: { [key: string]: browser.Storage.StorageChange }) => {
		for (const setting of settings) {
			const change = changes[setting.key];
			if (change !== undefined) {
				callback(setting.key, change.newValue, change.oldValue);
			}
		}
	};

	browser.storage.local.onChanged.addListener(subscribeCallback);

	if (initialRead === true) {
		browser.storage.local.get(settings.map((v) => v.key)).then((v) => {
			for (const setting of settings) {
				const value = v[setting.key] === undefined ? setting.default : v[setting.key];
				callback(setting.key, value, value);
			}
		});
	}

	return () => browser.storage.local.onChanged.removeListener(subscribeCallback);
}

export const PlayerSettings = {
	NoStreamLimit: {
		key: 'noStreamLimit',
		default: true
	} satisfies Setting<boolean>,
	DefaultContextMenu: {
		key: 'defaultContextMenu',
		default: true
	} satisfies Setting<boolean>
};

export const DebugSettings = {
	AlwaysShowPlayerControls: {
		key: 'alwaysShowPlayerControls',
		default: false
	} satisfies Setting<boolean>,
	ShowConsoleDownloadProgress: {
		key: 'showConsoleDownloadProgress',
		default: true
	} satisfies Setting<boolean>
};
