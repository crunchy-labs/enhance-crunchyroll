import browser from 'webextension-polyfill';

export async function getJwt(): Promise<string> {
	let jwt = (await browser.storage.local.get('jwt'))['jwt'];
	if (jwt === undefined || jwtExpirationDate(jwt).getTime() - 5000 < Date.now()) {
		const tokenRes = await fetch('https://www.crunchyroll.com/auth/v1/token', {
			method: 'POST',
			headers: {
				Authorization: 'Basic bm9haWhkZXZtXzZpeWcwYThsMHE6',
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				grant_type: 'etp_rt_cookie'
			}),
			credentials: 'include'
		});
		const tokenJson: { access_token: string } = await tokenRes.json();
		jwt = tokenJson.access_token;
		await browser.storage.local.set({ jwt: jwt });
	}
	return jwt;
}

function jwtExpirationDate(jwt: string): Date {
	const payload: { exp: number } = JSON.parse(atob(jwt.split('.')[1]));
	return new Date(payload.exp * 1000);
}
