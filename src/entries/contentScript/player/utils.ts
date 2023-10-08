export async function getElementMounted<T extends Element, P extends HTMLElement>(
	watchFn: (parent: P) => T | null,
	parent: P,
	deep = false
): Promise<T> {
	let element = watchFn(parent);
	if (element != null) return element;

	let elementPromiseResolve: (value: T) => void;
	const elementPromise = new Promise<T>((r) => (elementPromiseResolve = r));

	new MutationObserver((_, observer) => {
		element = watchFn(parent);
		if (element != null) {
			observer.disconnect();
			elementPromiseResolve(element);
		}
	}).observe(parent, {
		childList: true,
		subtree: deep
	});

	return await elementPromise;
}

export function enterClickProxy(e: KeyboardEvent) {
	if (e.key == 'Enter') (e.target as HTMLElement).click();
}
