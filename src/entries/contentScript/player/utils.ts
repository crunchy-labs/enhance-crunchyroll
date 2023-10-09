export async function getElementMounted<T extends Element, P extends HTMLElement>(
	watchFn: (parent: P) => T | null,
	parent: P,
	deep = false
): Promise<T> {
	let elementPromiseResolve: (value: T) => void;
	const elementPromise = new Promise<T>((r) => (elementPromiseResolve = r));

	const observer = new MutationObserver(() => {
		const element = watchFn(parent);
		if (element != null) {
			observer.disconnect();
			elementPromiseResolve(element);
		}
	});
	observer.observe(parent, {
		childList: true,
		subtree: deep
	});

	const element = watchFn(parent);
	if (element != null) {
		observer.disconnect();
		return element;
	}

	return await elementPromise;
}

export function enterClickProxy(e: KeyboardEvent) {
	if (e.key == 'Enter') (e.target as HTMLElement).click();
}
