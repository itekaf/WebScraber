import rp from 'request-promise';
import Item from './item';
import crud from './../core/crud';
import CategoryAbstract from './../../../core/models/CategoryAbstract';
import helper from './../../../core/helper';


class Category extends CategoryAbstract {
	constructor(json) {
		super(json);

		this.pageTitle = 'Официальный сайт интернет магазина медицинской техники Omron в России';
	}

	getPages() {
		return Promise.all([rp(this.uri, 'GET')])
			.then((response) => {
				this.pages = this.getSelectorAll(response, '.page-i')[0].children.length; // useless
				this.error = '';
			})
			.catch((err) => {
				this.pages = 1;
				this.error += err.message;
			});
	}

	getItems(pagen = '1') {
		const settings = crud.get.main.settings();
		const tasks = [];

		const lastSlashIndex = this.uri.lastIndexOf('/') + 1;
		const clearUrl = this.uri.slice(0, lastSlashIndex);
		const query = this.uri.substr(lastSlashIndex);
		const searchParams = new URLSearchParams(query);
		searchParams.set('recNum', '9999');
		const url = `${clearUrl}?${searchParams.toString()}`;

		tasks.push(helper.requestWithTimer(url, 'GET', null, settings.speed || 1000));

		return Promise.all(tasks)
			.then((pages) => {
				pages.forEach((page) => {
					const urls = this.getSelectorAll(page, '[itemprop="url"].title');
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
}

export default Category;
