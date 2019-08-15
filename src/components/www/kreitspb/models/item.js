import _ from 'lodash';
import jsdom from 'jsdom';

import helper from './../../../core/helper';
import ItemAbstract from './../../../core/models/ItemAbstract';
import valuesHelper from '../../../utils/values';
import documentHelper from '../../../utils/document';

const JSDOM = jsdom.JSDOM;

const prefixes = {
	uri: 'https://kreitspb.ru',
	article: 'KRS',
};

const regExp = {
	price: new RegExp('\\d*\\.{0,1}\\d*', 'gim'),
	productIngredients: new RegExp('(состав:.*)(?=\<\\/li>)', 'gim' ),
};

class Item extends ItemAbstract {
	constructor(json) {
		super(json);
	};

	getPrice(element) {
		const price = this.getTextContent(element, '.cost');

		const priceMatches = price.match(regExp.price);
		const clearMatches = priceMatches ? priceMatches.filter((x) => x !== '') : null;
		return {
			price: clearMatches && clearMatches[0] ? clearMatches[0] : null,
			// sells: matches.length >= 2 && matches[1],
		};
	};

	getTitle(document) {
		return this.getTextContent(document, 'h1');
	}

	getImage(document) {
		const result = [];
		const imageItems = document.querySelectorAll('[data-lightbox~="images"]');
		imageItems.forEach((item) => {
			result.push(( prefixes.uri + item.getAttribute('href')));
		});
		return result;
	}

	getArticle(document) {
		const elementItemArticle = document.querySelector('[name~="id"]');
		const correctItemArticle = elementItemArticle ? elementItemArticle.getAttribute('value') : valuesHelper.getRandomValue();
		return correctItemArticle ? prefixes.article + correctItemArticle : null;
	}

	getPossibleSizes(document) {
		const result = [];
		const elementColors = documentHelper.getParrentNextSibling(document, 'small', 'Размер:', (nextSibling) => {
			return nextSibling.localName === 'button';
		});

		elementColors.forEach((elem) => {
			const correctContent = valuesHelper.removeIncorrectSymbols(elem.textContent);
			result.push(correctContent);
		});
		return _.uniq(result);
	}

	getPossibleColors(document) {
		const result = [];
		const elementColors = documentHelper.getParrentNextSibling(document, 'small', 'Цвет:', (nextSibling) => {
			return nextSibling.localName === 'button';
		});

		elementColors.forEach((elem) => {
			const correctContent = valuesHelper.removeIncorrectSymbols(elem.textContent);
			result.push(correctContent);
		});
		return _.uniq(result);
	}

	getDescription(document) {
		let result = '';
		const descriptionItems = document.querySelector('.catalog-element').children;
		// TODO: RL: refactor this bool shit
		for (let i = 1; i < descriptionItems.length; i++) {
			result += descriptionItems[i].innerHTML;
		}
		return valuesHelper.removeIncorrectSymbols(result);
	}

	getCategory(document) {
		const bread = document.querySelectorAll('span[itemprop~="itemListElement"]');
		let result = null;
		// TODO: RL: refactor this bool shit
		bread.forEach((item, index) => {
			if (index === 1) {
				result = item.textContent;
			}
		});
		return valuesHelper.removeIncorrectSymbols(result);
	}

	getProductIngredients(description) {
		if (!description) return null;
		const ingredientsMatches = description.match(regExp.productIngredients);
		return ingredientsMatches ? ingredientsMatches.filter((x) => x !== '').map((x) => valuesHelper.removeIncorrectSymbols(x)) : null;
	}

	getItem(timeout, parrent) {
		const options = {method: 'GET'};
		const task = helper.requestWithTimer(this.uri, options, parrent, timeout);
		return Promise.all([task])
			.then((result) => {
				const doc = new JSDOM(result).window.document;

				const price = this.getPrice(doc);

				this.name = this.getTitle(doc);
				this.image = this.getImage(doc);
				this.article = this.getArticle(doc);
				this.category = this.getCategory(doc);
				this.description = this.getDescription(doc);
				this.possibleSizes = this.getPossibleSizes(doc);
				this.possibleColors = this.getPossibleColors(doc);
				this.productIngredients = this.getProductIngredients(this.description);

				this.price = price.price;
				this.sells = price.sells;

				this.error = '';
			})
			.catch((err) => {
				this.error = err.message;
			});
	}
};

module.exports = Item;
