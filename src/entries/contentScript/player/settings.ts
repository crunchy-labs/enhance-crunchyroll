import { PlayerSettings, subscribeSettings } from '~/lib/settings';

export async function settings() {
	const hideContextMenuListener = (e: MouseEvent) => e.stopImmediatePropagation();

	const subscriptionSettings = [PlayerSettings.DefaultContextMenu];
	subscribeSettings(
		subscriptionSettings,
		(key, value) => {
			switch (key) {
				case PlayerSettings.DefaultContextMenu.key: {
					if (value as boolean) {
						document.addEventListener('contextmenu', hideContextMenuListener, true);
					} else {
						document.removeEventListener('contextmenu', hideContextMenuListener, true);
					}
					break;
				}
			}
		},
		true
	);
}
