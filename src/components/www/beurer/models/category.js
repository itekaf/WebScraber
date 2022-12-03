import rp from 'request-promise';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import Item from './item';
import crud from './../core/crud';
import CategoryAbstract from './../../../core/models/CategoryAbstract';
import helper from './../../../core/helper';

class Category extends CategoryAbstract {
	constructor(json) {
		super(json);

		this.pageTitle = 'Beurer Belarus';
	}

	getPages() {
		return Promise.all([rp(this.uri, 'GET')])
			.then((response) => {
				const pages = this.getSelectorAll(response, '.pagination a');
				const lastPageLink = pages.length ? pages[pages.length - 2] : undefined;
				this.pages = lastPageLink ? parseInt(lastPageLink.textContent, 10) : 1;
				this.error = '';
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
					const urls = this.getSelectorAll(page, '#catalog .item-title');
					const items = [];
					urls.forEach((uri) => {
						const item = {
							uri: uri.getAttribute('href').startsWith('http')
								? uri.getAttribute('href') // // костыль, что бы работала категория "расходные материалы"
								: 'https://beurer-belarus.by' + uri.getAttribute('href'),
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
