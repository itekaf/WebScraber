import rp from 'request-promise';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import Item from './item';
import crud from './../core/crud';
import CategoryAbstract from './../../../core/models/CategoryAbstract';

class Category extends CategoryAbstract {
	constructor(json) {
		super(json);

		this.pageTitle = 'ZProduct';
	}

	getPages() {
		return Promise.all([rp(this.uri, 'GET')])
			.then((response) => {
				const pages = this.getSelectorAll(response, '.pagination');
				this.pages = pages.length ? pages[pages.length - 1].querySelector('a').textContent : 1;
				this.error = '';
			})
			.catch((err) => {
				this.pages = -1;
				this.error += err.message;
			});
	}

	getItems() {
		const settings = crud.get.main.settings();
		const tasks = [];
		for (let page = 1; page <= this.pages; page++) {
			tasks.push(rp(this.uri + `/results,${page * 10 - 9}-${page * 10}`, 'GET'));
		}
		return Promise.all(tasks)
			.then((result) => {
				result.forEach((page) => {
					const urls = this.getSelectorAll(page, '.product-name a');
					const items = [];
					urls.forEach((uri) => {
						const item = {
							uri: settings.website + uri.getAttribute('href'),
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
