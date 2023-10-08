export async function waitForCallback<V, T, C extends (value: V) => T | undefined>(
	callback: C | null,
	listenAdd: (callback: any) => void,
	listenRemove?: (callback: any) => void
): Promise<T> {
	let resolve: (value: T) => void;
	const promise = new Promise<T>((r) => (resolve = r));

	const internalCallback = (value: V) => {
		const v = callback(value);
		if (v !== undefined) {
			if (listenRemove) listenRemove(internalCallback);
			resolve(v);
		}
	};
	listenAdd(internalCallback);

	return promise;
}
