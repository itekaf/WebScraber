import _ from 'lodash';
import jsdom from 'jsdom';

import helper from './../../../core/helper';
import ItemAbstract from './../../../core/models/ItemAbstract';
import valuesHelper from '../../../utils/values';
import documentHelper from '../../../utils/document';

const JSDOM = jsdom.JSDOM;

const prefixes = {
	uri: 'https://microlife.by',
	article: 'MC',
};

class Item extends ItemAbstract {
	constructor(json) {
		super(json);

		this.model = json.model || '';
	};

	getName(document) {
		const name = document.querySelector('[itemprop="model"]').textContent;

		return valuesHelper.removeIncorrectSymbols(name);
	}

	getVideo(document) {
		const videoElement = document.querySelector('.play-video');
		const result = videoElement ? videoElement.getAttribute('href') : '';
		return result;
	}

	getDocumentation(document) {
		const linkElement = document.querySelector('.support-download a');
		return linkElement ? prefixes.uri + linkElement.getAttribute('href') : '';
	}

	getFeatures(document) {
		const featuresElement = document.querySelector('.product-features p');
		return featuresElement ? featuresElement.textContent : '';
	}

	getImage(document) {
		const result = [];
		const mainImageElement = document.querySelector('.js-product-image');
		if (mainImageElement) {
			const imageUri = mainImageElement.getAttribute('src');

			result.push(`${prefixes.uri}${imageUri}`);
		}
		const additionalImageElement = document.querySelector('.product-features-image img');
		if (additionalImageElement) {
			const imageUri = additionalImageElement.getAttribute('src');
			result.push(`${prefixes.uri}${imageUri}`);
		}

		return result;
	}

	getDescription(document) {
		return this.getTextContent(document, '[property="pagetitle"]');
	}

	getCategory(document) {
		const bread = document.querySelectorAll('.breadcrumb a');
		let result = null;
		bread.forEach((item, index) => {
			if (index === (bread.length - 2)) {
				result = item.textContent;
			}
		});
		return result;
	}

	getFullInformation(document) {
		const information = document.querySelector('[property="product_specifications_right"]');
		const result = information ? information.textContent : '';
		return valuesHelper.removeIncorrectSymbols(result);
	}

	getAdditionalInformation(document) {
		const information = document.querySelector('[property="product_specifications_left"]');
		const result = information ? information.textContent : '';
		return valuesHelper.removeIncorrectSymbols(result);
	}



	getItem(timeout, parrent) {
		const options = {method: 'GET'};
		const task = helper.requestWithTimer(this.uri, options, parrent, timeout);
		return Promise.all([task])
			.then((result) => {
				const doc = new JSDOM(result).window.document;

				this.name = this.getName(doc);
				this.article = this.name;
				this.image = this.getImage(doc);
				this.videoURI = this.getVideo(doc);
				this.documentation = this.getDocumentation(doc);
				this.features = this.getFeatures(doc);

				this.category = this.getCategory(doc);
				this.description = this.getDescription(doc);
				this.fullInformation = this.getFullInformation(doc);
				this.additionalInformation = this.getAdditionalInformation(doc);

				this.error = '';
			})
			.catch((err) => {
				this.error = err.message;
			});
	}
};

module.exports = Item;
