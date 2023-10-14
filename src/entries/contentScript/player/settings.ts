import { PlayerSettings, subscribeSettings } from '~/lib/settings';

export async function settings() {
	const doubleClickHandler = () => {
		const maximizeButton = document.querySelector('#settingsControl')
			.nextElementSibling as HTMLButtonElement;
		maximizeButton.click();
	};
	const hideContextMenuHandler = (e: MouseEvent) => e.stopImmediatePropagation();

	const subscriptionSettings = [
		PlayerSettings.DoubleClickMaximize,
		PlayerSettings.DefaultContextMenu
	];
	subscribeSettings(
		subscriptionSettings,
		(key, value) => {
			switch (key) {
				case PlayerSettings.DoubleClickMaximize.key: {
					(value as boolean)
						? window.addEventListener('dblclick', doubleClickHandler)
						: window.removeEventListener('dblclick', doubleClickHandler);
					break;
				}
				case PlayerSettings.DefaultContextMenu.key: {
					(value as boolean)
						? document.addEventListener('contextmenu', hideContextMenuHandler, true)
						: document.removeEventListener('contextmenu', hideContextMenuHandler, true);
					break;
				}
			}
		},
		true
	);
}
