import database from './database';

const connect = {
    get: {
        main: {
            login: (prop = 'login') => database.main().get(prop).value(),
            settings: (prop = 'settings') => database.main().get(prop).value(),
            sessions: (prop = 'sessions') => database.main().get(prop).value(),
        },
        categories: (prop = 'categories') => database.categories().get(prop).value(),
    },
    set: {
        main: {
            login: (value, prop = 'login') => database.main().set(prop, value).write(),
            settings: (value, prop = 'settings') => database.main().set(prop, value).write(),
            sessions: (value, prop = 'sessions') => database.main().set(prop, value).write(),
        },
        categories: {
            set: (value, prop = 'categories') => database.categories().set(prop, value).write(),
            push: (value, prop = 'categories') => database.categories().get(prop).push(value).write(),
        },
    },
    remove: {
        categories: (value) => database.categories().get('categories').remove(value).write(),
    },
};

export default connect;
