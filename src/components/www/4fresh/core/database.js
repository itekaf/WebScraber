import fs from 'fs-extra';
import low from 'lowdb';
import path from 'path';
import FileSync from 'lowdb/adapters/FileSync';

const dbDir = 'db';
const websiteName = '4fresh';

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
			settings: {
				website: 'https://4fresh.ru',
				name: '4fresh',
				speed: 1500,
				imageSpeed: 1500,
				tempFolder: 'temp/4fresh',
				imageFolder: 'images/4fresh',
				imageNaming: 'folder',
			},
		});
	},
	categories: () => {
		const dir = path.join(dbDir, websiteName);
		return getDb(dir, 'categories.json', {categories: []});
	},
};

export default connect;
