import browser from 'webextension-polyfill';

export interface Setting<T> {
	key: string;
	default: T;
}

async function allSettings(): Promise<{ [key: string]: any }> {
	return JSON.parse((await browser.storage.local.get('settings'))['settings'] || '{}');
}

export async function getSetting<T>(setting: Setting<T>): Promise<T> {
	const settings = await allSettings();
	return settings[setting.key] === undefined ? setting.default : settings[setting.key];
}

export async function setSetting<T>(setting: Setting<T>, value: T) {
	const settings = await allSettings();
	await browser.storage.local.set({
		settings: JSON.stringify({ ...settings, [setting.key]: value })
	});
}

export function subscribeSetting<T>(
	setting: Setting<T>,
	callback: (newValue: T, oldValue: T) => void,
	initialRead?: boolean
): () => void {
	const subscribeCallback = (changes: { [key: string]: browser.Storage.StorageChange }) => {
		const settingsChanges = changes['settings'];
		if (!settingsChanges) return;

		const oldValue = JSON.parse(settingsChanges.oldValue || '{}')[setting.key];
		const newValue = JSON.parse(settingsChanges.newValue || '{}')[setting.key];

		if (oldValue !== newValue) {
			callback(newValue, oldValue);
		}
	};

	browser.storage.local.onChanged.addListener(subscribeCallback);

	if (initialRead === true) {
		allSettings().then((v) => {
			const value = v[setting.key] === undefined ? setting.default : v[setting.key];
			callback(value, value);
		});
	}

	return () => browser.storage.local.onChanged.removeListener(subscribeCallback);
}

export function subscribeSettings(
	settings: Setting<any>[],
	callback: (key: string, newValue: any, oldValue: any) => void,
	initialRead?: boolean
): () => void {
	const subscribeCallback = (changes: { [key: string]: browser.Storage.StorageChange }) => {
		const settingsChanges = changes['settings'];
		if (!settingsChanges) return;

		for (const setting of settings) {
			const oldValue = JSON.parse(settingsChanges.oldValue || '{}')[setting.key];
			const newValue = JSON.parse(settingsChanges.newValue || '{}')[setting.key];

			if (oldValue !== newValue) {
				callback(setting.key, newValue, oldValue);
			}
		}
	};

	browser.storage.local.onChanged.addListener(subscribeCallback);

	if (initialRead === true) {
		allSettings().then((v) => {
			for (const setting of settings) {
				const value = v[setting.key] === undefined ? setting.default : v[setting.key];
				callback(setting.key, value, value);
			}
		});
	}

	return () => browser.storage.local.onChanged.removeListener(subscribeCallback);
}

export const PlayerSettings = {
	DoubleClickMaximize: {
		key: 'player.doubleClickMaximize',
		default: true
	} satisfies Setting<boolean>,
	NoStreamLimit: {
		key: 'player.noStreamLimit',
		default: false
	} satisfies Setting<boolean>,
	DefaultContextMenu: {
		key: 'player.defaultContextMenu',
		default: true
	} satisfies Setting<boolean>
};

export const SeriesSettings = {
	NextEpisodeAirDate: {
		key: 'series.nextEpisodeAirDate',
		default: true
	} satisfies Setting<boolean>,
	RelativeEpisodeNumber: {
		key: 'series.relativeEpisodeNumber',
		default: false
	} satisfies Setting<boolean>,
	AnimeListLinks: {
		key: 'series.animeListLinks',
		default: { anilist: false, mal: false }
	} satisfies Setting<{ anilist: boolean; mal: boolean }>
};

export const WatchSettings = {
	AnimeListLinks: {
		key: 'watch.animeListLinks',
		default: { anilist: false, mal: false }
	} satisfies Setting<{ anilist: boolean; mal: boolean }>
};

export const DebugSettings = {
	AlwaysShowPlayerControls: {
		key: 'debug.alwaysShowPlayerControls',
		default: false
	} satisfies Setting<boolean>,
	ShowConsoleDownloadProgress: {
		key: 'debug.showConsoleDownloadProgress',
		default: true
	} satisfies Setting<boolean>
};
