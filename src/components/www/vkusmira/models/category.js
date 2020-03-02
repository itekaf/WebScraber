import rp from 'request-promise';
import Item from './item';
import crud from './../core/crud';
import CategoryAbstract from './../../../core/models/CategoryAbstract';
import helper from './../../../core/helper';

class Category extends CategoryAbstract {
	constructor(json) {
		super(json);

		this.pageTitle = 'Вкусы мира';
	}

	getPages(url) {
		return Promise.all([rp(url || this.uri, 'GET')])
			.then((response) => {
				const pages = this.getSelectorAll(response, 'button[data-use]');
				this.pages = pages.length ? pages.length + 1 : this.pages;
				this.error = '';

				pages.length && this.getPages(this.uri + '?PAGEN_1=' + this.pages);
			})
			.catch((err) => {
				this.pages = 1;
				this.error += err.message;
			});
	}

	getItems() {
		const settings = crud.get.main.settings();
		const tasks = [];
		for (let page = 1; page <= this.pages; page++) {
			tasks.push(helper.requestWithTimer(this.uri + '?PAGEN_1=' + page, 'GET', null, settings.speed || 1000));
		}
		return Promise.all(tasks)
			.then((result) => {
				result.forEach((page) => {
					const urls = this.getSelectorAll(page, 'h3 a');

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
}

export default Category;
