import jsdom from 'jsdom';

import helper from './../../../core/helper';
import ItemAbstract from './../../../core/models/ItemAbstract';


const JSDOM = jsdom.JSDOM;


class Item extends ItemAbstract {
	constructor(json) {
		super(json);

		this.model = json.model || '';
	};

	getName(document) {
		return this.getTextContent(document, 'h1');
	}

	getDescription(document) {
		return this.getTextContent(document, '[itemprop="description"] p');
	}

	getDetails(document) {
		const details = document.querySelector('.product-item-detail-properties');

		return details.innerHTML;
	}

	getImage(document) {
		const result = [];
		const mainImageElement = document.querySelector('[itemprop="image"]');
		if (mainImageElement) {
			const imageUri = mainImageElement.getAttribute('src');

			result.push(imageUri);
		}

		return result;
	}

	getItem(timeout, parrent) {
		const options = {method: 'GET'};
		const task = helper.requestWithTimer(this.uri, options, parrent, timeout);
		return Promise.all([task])
			.then((result) => {
				const doc = new JSDOM(result).window.document;

				this.name = this.getName(doc);
				this.description = this.getDescription(doc);
				this.fullInformation = this.getDetails(doc);
				this.image = this.getImage(doc);

				this.error = '';
			})
			.catch((err) => {
				this.error = err.message;
			});
	}
}

module.exports = Item;
