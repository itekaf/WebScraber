import _ from 'lodash';
import jsdom from 'jsdom';

import helper from './../../../core/helper';
import ItemAbstract from './../../../core/models/ItemAbstract';

const JSDOM = jsdom.JSDOM;

const prefixes = {
	uri: 'https://nutricia-medical.ru',
	article: 'KRS',
};

const regExp = {
	price: new RegExp('\\d*\\.{0,1}\\d*', 'gim'),
	productIngredients: new RegExp('(состав:.+)(?=<\/li>)', 'gim' ),
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

	// getArticle(document) {
	// 	const itemArticle = document.querySelector('[name~="id"]').getAttribute('value');
	// 	return itemArticle ? prefixes.article + itemArticle : null;
	// }

	// getPossibleSizes(document) {
	// 	const result = [];
	// 	const elementColors = documentHelper.getParrentNextSibling(document, 'small', 'Размер:', (nextSibling) => {
	// 		return nextSibling.localName === 'button';
	// 	});

	// 	elementColors.forEach((elem) => {
	// 		result.push((elem.textContent));
	// 	});
	// 	return _.uniq(result);
	// }

	// getPossibleColors(document) {
	// 	const result = [];
	// 	const elementColors = documentHelper.getParrentNextSibling(document, 'small', 'Цвет:', (nextSibling) => {
	// 		return nextSibling.localName === 'button';
	// 	});

	// 	elementColors.forEach((elem) => {
	// 		result.push((elem.textContent));
	// 	});
	// 	return _.uniq(result);
	// }

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

	getProductIngredients(description) {
		if (!description) return null;
		const ingredientsMatches = description.match(regExp.productIngredients);
		return ingredientsMatches ? ingredientsMatches.filter((x) => x !== '') : null;
	}

	getItem(timeout, parrent) {
		const options = {method: 'GET'};
		const task = helper.requestWithTimer(this.uri, options, parrent, timeout);
		return Promise.all([task])
			.then((result) => {
				const doc = new JSDOM(result).window.document;

				this.name = this.getTitle(doc);
				this.image = this.getImage(doc);
				// this.article = this.getArticle(doc);
				this.category = this.getCategory(doc);
				this.description = this.getDescription(doc);
				// this.possibleSizes = this.getPossibleSizes(doc);
				// this.possibleColors = this.getPossibleColors(doc);
				// TODO: RL: Change it
				this.productIngredients = this.getProductIngredients(this.description);

				this.error = '';
			})
			.catch((err) => {
				this.error = err.message;
			});
	}
};

module.exports = Item;
