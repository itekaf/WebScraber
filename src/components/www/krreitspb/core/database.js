import fs from 'fs-extra';
import low from 'lowdb';
import path from 'path';
import FileSync from 'lowdb/adapters/FileSync';

const dbDir = 'db';
const websiteName = 'kreitspb';

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
                website: 'https://kreitspb.ru/',
                name: 'kreitspb',
                speed: 500,
                imageSpeed: 1000,
                tempFolder: 'temp/kreitspb',
                imageFolder: 'images/kreitspb',
            },
        });
    },
    categories: () => {
        const dir = path.join(dbDir, websiteName);
        return getDb(dir, 'categories.json', {categories: []});
    },
};

export default connect;
