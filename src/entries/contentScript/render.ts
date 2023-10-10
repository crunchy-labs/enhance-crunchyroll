import browser from 'webextension-polyfill';
import { SvelteComponent } from 'svelte';

export async function render(
	cssPaths: string[],
	parent: HTMLElement,
	render: (appRoot: HTMLElement) => void
): Promise<HTMLElement> {
	const appContainer = document.createElement('div');
	const shadowRoot = appContainer.attachShadow({
		mode: import.meta.env.MODE === 'development' ? 'open' : 'closed'
	});
	const appRoot = document.createElement('div');
	appRoot.style.display = 'unset';

	if (import.meta.hot) {
		const { addViteStyleTarget } = await import('@samrum/vite-plugin-web-extension/client');

		await addViteStyleTarget(shadowRoot);
	} else {
		cssPaths.forEach((cssPath: string) => {
			const styleEl = document.createElement('link');
			styleEl.setAttribute('rel', 'stylesheet');
			styleEl.setAttribute('href', browser.runtime.getURL(cssPath));
			shadowRoot.appendChild(styleEl);
		});
	}

	shadowRoot.appendChild(appRoot);
	parent.appendChild(appContainer);

	render(appRoot);

	return appContainer;
}

export class MountComponent {
	static elems: Map<string, HTMLElement> = new Map();

	static mount(
		component: typeof SvelteComponent,
		cssPaths: string[],
		target: HTMLElement,
		props?: Record<string, any>
	) {
		render(cssPaths, target, (app) => {
			new component({
				props: props,
				target: app
			});
		}).then((e) => this.elems.set(component.name, e));
	}

	static unmount(component: typeof SvelteComponent) {
		const elem = this.elems.get(component.name);
		if (!elem) return;
		elem.remove();
		this.elems.delete(component.name);
	}
}
