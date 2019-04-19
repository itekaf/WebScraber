import database from './database';

const connect = {
    get: {
        main: {
            settings: (prop = 'settings') => database.main().get(prop).value(),
        },
        categories: (prop = 'categories') => database.categories().get(prop).value(),
    },
    set: {
        main: {
            settings: (value, prop = 'settings') => database.main().set(prop, value).write(),
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
