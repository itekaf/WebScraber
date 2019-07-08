import jsdom from 'jsdom';
import md5 from 'md5';

import helper from './../../../core/helper';
import ItemAbstract from './../../../core/models/ItemAbstract';

const JSDOM = jsdom.JSDOM;

const prefixes = {
	uri: 'https://kreitspb.ru',
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
		const imageURI = document.querySelector('[data-lightbox~="images"]').getAttribute('href');
		return imageURI ? prefixes.uri + imageURI : null;
	}

	getArticle(document) {
		const itemArticle = document.querySelector('[name~="id"]').getAttribute('value');
		return itemArticle ? prefixes.article + itemArticle : null;
	}

	getPossibleSizes(document) {

	}

	getPossibleHeight(document) {

	}

	getPossibleColors(document) {

	}

	getDescription(document) {
		let result = '';
		const descriptionItems = document.querySelector('.catalog-element').children;
		// TODO: RL: refactor this bool shit
		for (let i = 1; i < descriptionItems.length; i++) {
			result += descriptionItems[i].innerHTML;
		}
		return result;
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

				const price = this.getPrice(doc);

				this.name = this.getTitle(doc);
				this.image = this.getImage(doc);
				this.article = this.getArticle(doc);
				this.category = this.getCategory(doc);
				this.description = this.getDescription(doc);
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
