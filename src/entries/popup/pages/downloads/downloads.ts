export function bytesToHumanReadable(bytes: number, afterDigits = 0): string {
	const i = bytes == 0 ? 0 : Math.floor(Math.log(bytes) / Math.log(1024));
	return (
		Number((bytes / Math.pow(1024, i)).toFixed(afterDigits)) + ' ' + ['B', 'KB', 'MB', 'GB'][i]
	);
}

export function msToHumanReadable(ms: number): string {
	const seconds = ms != 0 ? Math.floor(ms / 1000) : 0;
	if (seconds < 60) return `${seconds}s`;
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m`;
	const hours = Math.floor(minutes / 60);
	return `${hours}h ${minutes % 60}m`;
}
