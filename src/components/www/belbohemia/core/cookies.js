import rp from 'request-promise';
import tough from 'tough-cookie';
import crud from './crud';

const cookies = {
	get: () => {
		const sessions = crud.get.main.sessions();
		const settings = crud.get.main.settings();
		const sessionsCookie = sessions ? sessions : null;
		if (sessionsCookie) {
			const cookies = rp.jar();
			sessionsCookie.forEach((cook) => {
				cookies.setCookie(cook, settings.website);
			});
			return cookies;
		}
		return null;
	},
	login: () => {
		const login = crud.get.main.login();
		const settings = crud.get.main.settings();
		const jar = rp.jar();

		// fix issue with str.trim is not a function. For more details see: https://github.com/request/request-promise/issues/183;
		jar._jar = new tough.CookieJar(undefined, {looseMode: true});

		jar.setCookie(new tough.Cookie(login.cookie), settings.website);

		return jar;
	},
};

export default cookies;
