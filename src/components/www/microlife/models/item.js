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

	getTitle(document) {
		return this.getTextContent(document, 'title');
	}

	getVideo(document) {
		const videoElement = document.querySelector('.play-video js-video-overlay');
		const result = videoElement ? videoElement.getAttribute('href') : '';
		return result;
	}

	getImage(document) {
		const result = [];
		const mainImageElement = document.querySelector('.js-product-image');
		if (mainImageElement) {
			const imageUri = mainImageElement.getAttribute('src');
			result.push(`${prefixes.rui}/${imageUri}`);
		}
		const additionalImageElement = document.querySelector('.product-features-image img');
		if (additionalImageElement) {
			const imageUri = additionalImageElement.getAttribute('src');
			result.push(`${prefixes.rui}/${imageUri}`);
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

	getSize(document) {
		const result = [];
		const elementColors = documentHelper.getNextSibling(document, '[property="product_specifications_right"] ul li strong', 'Размер', (nextSibling) => {
			const isCorrectNode = nextSibling.localName === 'strong' || nextSibling.nodeName === '#text';
			const isCoorectContent = nextSibling.textContent === '' || nextSibling.textContent.length <= 20;
			return isCorrectNode && isCoorectContent;
		});

		elementColors.forEach((elem) => {
			const correctContent = valuesHelper.removeIncorrectSymbols(elem.textContent);
			result.push(correctContent.trim());
		});

		const correctResult = _.uniq(result).filter((x) => !!x);
		return correctResult;
	}

	getModel(document) {
		const result = [];
		const elementColors = documentHelper.getNextSibling(document, '[property="product_specifications_right"] ul li strong', 'Модель №', (nextSibling) => {
			const isCorrectNode = nextSibling.localName === 'strong' || nextSibling.nodeName === '#text';
			const isCoorectContent = nextSibling.textContent === '' || nextSibling.textContent.length <= 20;
			return isCorrectNode && isCoorectContent;
		});

		elementColors.forEach((elem) => {
			const correctContent = valuesHelper.removeIncorrectSymbols(elem.textContent);
			result.push(correctContent.trim());
		});

		const correctResult = _.uniq(result).filter((x) => !!x);
		return correctResult;
	}

	// getShelfLife(document) {
	// 	const result = [];
	// 	const elementColors = documentHelper.getNextSibling(document, '#info h4', 'Срок годности', (nextSibling) => {
	// 		const isCorrectNode = nextSibling.localName === 'p' || nextSibling.nodeName === '#text';
	// 		const isCoorectContent = nextSibling.textContent === '' || nextSibling.textContent.length <= 20;
	// 		return isCorrectNode && isCoorectContent;
	// 	});

	// 	elementColors.forEach((elem) => {
	// 		const correctContent = valuesHelper.removeIncorrectSymbols(elem.textContent);
	// 		result.push(correctContent.trim());
	// 	});

	// 	const correctResult = _.uniq(result).filter((x) => !!x);
	// 	return correctResult;
	// }

	getItem(timeout, parrent) {
		const options = {method: 'GET'};
		const task = helper.requestWithTimer(this.uri, options, parrent, timeout);
		return Promise.all([task])
			.then((result) => {
				const doc = new JSDOM(result).window.document;

				this.name = this.getTitle(doc);
				// FIX
				this.size = this.getSize(doc);
				// FIX
				this.image = this.getImage(doc);
				// FIX
				this.model = this.getModel(doc);
				// FIX
				this.videoURI = this.getVideo(doc);

				this.category = this.getCategory(doc);
				this.description = this.getDescription(doc);
				// this.possibleSizes = this.getPossibleSizes(doc);
				this.fullInformation = this.getFullInformation(doc);
				// this.productIngredients = this.getProductIngredients(doc);
				this.additionalInformation = this.getAdditionalInformation(doc);

				// this.shelfLife = this.getShelfLife(doc);

				this.error = '';
			})
			.catch((err) => {
				this.error = err.message;
			});
	}
};

module.exports = Item;
