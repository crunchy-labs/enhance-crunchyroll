import pkg from '../package.json';

const sharedManifest: Partial<chrome.runtime.ManifestBase> = {
	content_scripts: [
		{
			js: ['src/entries/contentScript/player/main.ts'],
			matches: ['https://static.crunchyroll.com/vilos-v2/web/vilos/player.html*'],
			all_frames: true,
			run_at: 'document_start'
		}
	],
	icons: {
		16: 'icons/enhance-crunchyroll@16px.png',
		32: 'icons/enhance-crunchyroll@32px.png',
		48: 'icons/enhance-crunchyroll@48px.png',
		96: 'icons/enhance-crunchyroll@96px.png',
		128: 'icons/enhance-crunchyroll@128px.png'
	},
	permissions: ['downloads', 'storage', 'webRequest']
};

const browserAction = {
	default_icon: {
		16: 'icons/enhance-crunchyroll@16px.png',
		32: 'icons/enhance-crunchyroll@32px.png'
	},
	default_popup: 'src/entries/popup/index.html'
};

const websitePermissions = [
	'*://*.crunchyroll.com/*',
	'*://*.gccrunchyroll.com/*',
	'*://*.crunchyrollsvc.com/*'
];

const ManifestV2 = {
	...sharedManifest,
	background: {
		scripts: ['src/entries/background/main.ts'],
		persistent: true
	},
	browser_action: browserAction,
	permissions: [...sharedManifest.permissions, ...websitePermissions]
};

const ManifestV3 = {
	...sharedManifest,
	action: browserAction,
	background: {
		service_worker: 'src/entries/background/main.ts'
	},
	host_permissions: [...websitePermissions]
};

export function getManifest(
	manifestVersion: number
): chrome.runtime.ManifestV2 | chrome.runtime.ManifestV3 {
	const manifest = {
		author: pkg.author,
		description: pkg.description,
		name: pkg.displayName ?? pkg.name,
		version: pkg.version
	};

	if (manifestVersion === 2) {
		return {
			...manifest,
			...ManifestV2,
			manifest_version: manifestVersion
		};
	}

	if (manifestVersion === 3) {
		return {
			...manifest,
			...ManifestV3,
			manifest_version: manifestVersion
		};
	}

	throw new Error(`Missing manifest definition for manifestVersion ${manifestVersion}`);
}
