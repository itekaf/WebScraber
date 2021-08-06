import jsdom from 'jsdom';

import helper from './../../../core/helper';
import ItemAbstract from './../../../core/models/ItemAbstract';
import crud from '../core/crud';


const JSDOM = jsdom.JSDOM;


class Item extends ItemAbstract {
	constructor(json) {
		super(json);

		this.website = crud.get.main.settings().website;
	};

	getName(document) {
		return this.getTextContent(document, 'h1');
	}

	getTags(document) {
		const crumbsNodes = document.querySelectorAll('.crumbs a');
		const targetCrumbs = [].slice.call(crumbsNodes, 2);
		const crumbs = targetCrumbs.map((crumb) => crumb.textContent);

		return crumbs.reduce((acc, cur, index) => {
			const isLastCrumb = (crumbs.length - 1) === index;

			if (isLastCrumb) return acc + cur;

			return acc + cur + ', ';
		}, '');
	}

	getDescription(document) {
		const props = document.querySelectorAll('.ci-info-block.ci-section--roll');

		props.forEach((prop) => {
			const propTitle = prop.querySelectorAll('.h2')[0].textContent.trim().toLowerCase();
			const propContent = prop.querySelectorAll('*:not(:first-child)')[0].textContent.trim();
			if (propTitle.trim().toLowerCase() === this.name.trim().toLowerCase()) {
				this.description = propContent;
			}
			if (propTitle === 'состав') {
				this.productIngredients = propContent;
			}
			if (propTitle === 'способ применения') {
				this.documentation = propContent;
			}
			if (propTitle === 'противопоказания') {
				this.features = propContent;
			}
			if (propTitle === 'сроки и условия хранения') {
				this.shelfLife = propContent;
			}
		});
	}

	getCountry(document, property) {
		let result = '';
		const props = document.querySelectorAll('.ci-prop');
		props.forEach((prop) => {
			if (prop.textContent.includes(property)) {
				result = prop.textContent.trim().replace(/\s+/g, ' ');
			}
		});

		return result;
	}

	getImage(document) {
		const result = [];
		const aNodes = document.querySelectorAll('#new-card__slider a'); // fotorama slider
		aNodes.forEach((aNode) => {
			const imageLink = this.website + aNode.getAttribute('href');
			result.push(imageLink);
		});

		const itemGaleryANodes = document.querySelectorAll('#itemGallery a'); // fotorama slider in itemGalery
		itemGaleryANodes.forEach((aNode) => {
			const imageLink = this.website + aNode.getAttribute('href');
			result.push(imageLink);
		});

		return result;
	}

	getItem(timeout, parent) {
		const options = {method: 'GET'};
		const task = helper.requestWithTimer(this.uri, options, parent, timeout);
		return Promise.all([task])
			.then((result) => {
				const doc = new JSDOM(result).window.document;

				this.name = this.getName(doc);
				this.sells = this.getTags(doc);
				this.country = this.getCountry(doc, 'Страна производства:');
				this.category = this.getCountry(doc, 'Производитель:');
				this.image = this.getImage(doc);

				this.getDescription(doc);

				this.error = '';
			})
			.catch((err) => {
				this.error = err.message;
			});
	}
}

module.exports = Item;
