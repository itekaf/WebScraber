import fs from 'fs-extra';
import low from 'lowdb';
import path from 'path';
import FileSync from 'lowdb/adapters/FileSync';

const dbDir = 'db';
const websiteName = 'belbohemia';

const getDb = (dir, name, instanse) => {
	if (!fs.pathExistsSync(dir)) {
		fs.mkdirpSync(dir);
	}
	const dbFile = path.join(dir, name);
	const exist = fs.existsSync(dbFile);
	const adapter = new FileSync(dbFile);
	const db = low(adapter);
	if (!exist) {
		db.defaults(instanse).write();
	}
	return db;
};

const connect = {
	main: () => {
		const dir = path.join(dbDir, websiteName);
		return getDb(dir, 'main.json', {
			sessions: [],
			login: {
				name: '',
				password: '',
				cookie: {
					key: 'wordpress_test_cookie',
					value: 'WP+Cookie+check',
					domain: 'www.belbohemia.by',
					httpOnly: false,
					maxAge: 31536000,
				},
				post: {
					uri: 'https://www.belbohemia.by/wp-login.php',
					form: {
						'log': '',
						'pwd': '',
						'wp-submit': 'Войти',
						'redirect_to': 'https://www.belbohemia.by/wp-admin/',
						'testcookie': 1,
					},
				},
			},
			settings: {
				website: 'https://www.belbohemia.by',
				name: 'belbohemia',
				speed: 500,
				imageSpeed: 1000,
				tempFolder: 'temp/belbohemia',
				imageFolder: 'images/belbohemia',
				imageNaming: 'article',
			},
		});
	},
	categories: () => {
		const dir = path.join(dbDir, websiteName);
		return getDb(dir, 'categories.json', { categories: [] });
	},
};

export default connect;
