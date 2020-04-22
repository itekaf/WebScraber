import jsdom from 'jsdom';

import helper from './../../../core/helper';
import valuesHelper from '../../../utils/values';
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
		return document.querySelectorAll('.tab-content')[0].innerHTML;
	}

	getDetails(document) {
		return document.querySelectorAll('.tab-content')[1].innerHTML;
	}

	getImage(document) {
		const result = [];
		const imagesA = document.querySelectorAll('.cloud-zoom-gallery');
		if (imagesA) {
			imagesA.forEach((image) =>
				result.push(
					valuesHelper.replaceIncorrectSymbolsInURI(image.href)
				));
		}

		return result;
	}

	getItem(timeout, parrent) {
		const options = { method: 'GET' };
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
