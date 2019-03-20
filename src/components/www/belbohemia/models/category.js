import rp from 'request-promise';
import Item from './item';
import CategoryAbstract from './../../../core/models/CategoryAbstract';

class Category extends CategoryAbstract {
    constructor(json) {
        super(json);
    }

    getPages() {
        return Promise.all([rp(this.uri, 'GET')])
            .then((response) => {
                const pages = this.getSelectorAll(response, '.page-numbers li');
                this.pages = pages[pages.length - 2].querySelector('a').textContent;
                this.error = '';
            })
            .catch((err) => {
                this.pages = -1;
                this.error += err.message;
            });
    }

    getItems() {
        const tasks = [];
        for (let page = 1; page <= this.pages; page++) {
            tasks.push(rp(this.uri + 'page/' + page, 'GET'));
        }
        return Promise.all(tasks)
            .then((result) => {
                result.forEach((page) => {
                    const urls = this.getSelectorAll(page, '.box_product_img a');
                    const items = [];
                    urls.forEach((uri) => {
                        const item = {
                            uri: uri.getAttribute('href'),
                            appCategory: this.name,
                        };
                        items.push(new Item(item));
                    });
                    this.items.push(...items);
                });
                this.error = '';
            })
            .catch((err) => {
                this.error += err.message;
            });
    }
};

export default Category;
