import _ from 'lodash';
import jsdom from 'jsdom';

import helper from './../../../core/helper';
import ItemAbstract from './../../../core/models/ItemAbstract';
import valuesHelper from '../../../utils/values';
import documentHelper from '../../../utils/document';

const JSDOM = jsdom.JSDOM;

const prefixes = {
	uri: 'https://nutricia-medical.ru',
	article: 'NM',
};

class Item extends ItemAbstract {
	constructor(json) {
		super(json);
	};

	getTitle(document) {
		return this.getTextContent(document, 'h1[itemprop="name"]');
	}

	getImage(document) {
		const result = [];
		const imageItems = document.querySelectorAll('[itemprop="image"]');
		imageItems.forEach((item) => {
			result.push(( prefixes.uri + item.getAttribute('src')));
		});
		return result;
	}

	getPossibleSizes(document) {
		const result = [];
		const elementSizes = document.querySelectorAll('.tastes_names_c p a');

		elementSizes.forEach((elem) => {
			const correctSize = valuesHelper.removeIncorrectSymbols(elem.textContent);
			result.push(correctSize);
		});
		return _.uniq(result);
	}

	getDescription(document) {
		const descriptionItems = document.querySelector('[itemprop="description"');
		return descriptionItems ? descriptionItems.textContent : '';
	}

	getCategory(document) {
		const bread = document.querySelectorAll('.act_link_nav_pr i');
		let result = null;
		bread.forEach((item, index) => {
			if (index === 0) {
				result = item.textContent;
			}
		});
		return result;
	}

	getFullInformation(document) {
		const information = document.querySelector('#info');
		const result = information ? information.innerHTML : '';
		return valuesHelper.removeIncorrectSymbols(result);
	}

	getProductIngredients(document) {
		const ingredients = document.querySelector('#composition');
		const result = ingredients ? ingredients.innerHTML : '';
		return valuesHelper.removeIncorrectSymbols(result);
	}

	getAdditionalInformation(document) {
		const information = document.querySelector('#useful');
		const result = information ? information.innerHTML : '';
		return valuesHelper.removeIncorrectSymbols(result);
	}

	getShelfLife(document) {
		const result = [];
		const elementColors = documentHelper.getNextSibling(document, '#info h4', 'Срок годности', (nextSibling) => {
			const isCorrectNode = nextSibling.localName === 'p' || nextSibling.nodeName === '#text';
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

	getItem(timeout, parrent) {
		const options = {method: 'GET'};
		const task = helper.requestWithTimer(this.uri, options, parrent, timeout);
		return Promise.all([task])
			.then((result) => {
				const doc = new JSDOM(result).window.document;

				this.name = this.getTitle(doc);
				this.image = this.getImage(doc);
				this.category = this.getCategory(doc);
				this.description = this.getDescription(doc);
				this.possibleSizes = this.getPossibleSizes(doc);
				this.fullInformation = this.getFullInformation(doc);
				this.productIngredients = this.getProductIngredients(doc);
				this.additionalInformation = this.getAdditionalInformation(doc);

				this.shelfLife = this.getShelfLife(doc);

				this.error = '';
			})
			.catch((err) => {
				this.error = err.message;
			});
	}
};

module.exports = Item;
