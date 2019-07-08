import jsdom from 'jsdom';
import cookies from './../core/cookies';
import helper from './../../../core/helper';
import ItemAbstract from './../../../core/models/ItemAbstract';

const JSDOM = jsdom.JSDOM;

class Item extends ItemAbstract {
	constructor(json) {
		super(json);
	};

	getPrice(element) {
		const price = this.getTextContent(element, '.price');
		const regExp = new RegExp('\\d*\\.{0,1}\\d*', 'gim');
		const matches = price.match(regExp).filter((x) => x !== '');
		return {
			price: matches && matches[0],
			sells: matches.length >= 2 && matches[1],
		};
	};

	getItem(timeout, parrent) {
		const options = {method: 'GET', jar: cookies.get()};
		const task = helper.requestWithTimer(this.uri, options, parrent, timeout);
		return Promise.all([task])
			.then((result) => {
				const doc = new JSDOM(result).window.document;

				this.name = this.getTextContent(doc, '.product_title_single');
				this.description = this.getTextContent(doc, '.woocommerce-product-details__short-description p');
				this.image = doc.querySelector('.easyzoom a').getAttribute('href');

				const shopAttr = doc.querySelector('.woocommerce-product-details__short-description .shop_attributes tbody');
				this.article = this.getTextContent(shopAttr, 'tr:nth-child(1) td').replace('\n', '');
				this.minOrder = this.getTextContent(shopAttr, 'tr:nth-child(3) td').replace('\n', '');
				this.countPackage = this.getTextContent(shopAttr, 'tr:nth-child(2) td').replace('\n', '');

				const additionalShopAttr = doc.querySelector('#additional_information table tbody');
				if (additionalShopAttr && additionalShopAttr.childElementCount !== 0) {
					const array = [...additionalShopAttr.children];
					array.forEach((child) => {
						const name = this.getTextContent(child, 'tr th').replace('\n', '');
						switch (name) {
							case 'Баркод':
								this.barcode = this.getTextContent(child, 'tr td').replace('\n', '');
								break;
							case 'Производство':
								this.country = this.getTextContent(child, 'tr td').replace('\n', '');
								break;
							case 'Габариты упаковки':
								this.dimensionsPackage = this.getTextContent(child, 'tr td').replace('\n', '');
								break;
							case 'Габариты':
								this.dimensions = this.getTextContent(child, 'tr td').replace('\n', '');
								break;
						}
					});
				}

				this.category = this.getTextContent(doc, '.product_meta').replace(/\n|\t|:|Категории/gim, '');

				const price = this.getPrice(doc);
				this.price = price.price;
				this.sells = price.sells;
				// this.price = matches ? matches[0] : '';
				// this.sells = matches.length >= 2 ? matches[1] : '';

				this.error = '';
			})
			.catch((err) => {
				this.error = err.message;
			});
	}
};

module.exports = Item;
