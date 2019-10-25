import jsdom from 'jsdom';

import helper from './../../../core/helper';
import ItemAbstract from './../../../core/models/ItemAbstract';
import valuesHelper from '../../../utils/values';

const JSDOM = jsdom.JSDOM;

const prefixes = {
	uri: 'https://beurer-belarus.by',
	article: 'MC',
};

class Item extends ItemAbstract {
	constructor(json) {
		super(json);

		this.model = json.model || '';
	};

	getName(document) {
		return document.querySelector('#pagetitle').textContent;
	}

	getPrice(document) {
		const price = document.querySelector('.curr-price-notiker');
		// get textContent method
		return price ? price.textContent : '';
	}

	getArticle(document) {
		const article = document.querySelector('.article').textContent;

		return valuesHelper.removeIncorrectSymbols(article);
	}

	getWarranty(document) {
		return document.querySelector('.GUARANTEE_MONTH span').textContent;
	}

	getBreadCrumbs(document) {
		const breadcrumbs = document.querySelectorAll('#navigation .breadcrumb__item a span');
		let result = '';

		breadcrumbs.forEach((item) => {
			result += item.textContent + ',';
		});

		return result.slice(0, -1);
	}

	getDocumentation(document) {
		const linkElement = document.querySelector('.files-docs-item');
		return linkElement ? prefixes.uri + linkElement.getAttribute('href') : '';
	}

	getFeatures(document) {
		const featuresElement = document.querySelector('.tabs__box');

		return featuresElement ? featuresElement.outerHTML.replace(/<img .*?>/g, '') : '';
	}

	getImage(document) {
		const result = [];
		const mainImageElement = document.querySelector('.catalog-detail-picture img');
		if (mainImageElement) {
			const imageUri = mainImageElement.getAttribute('src');

			result.push(`${prefixes.uri}${imageUri}`);
		}
		const additionalImages = document.querySelectorAll('.catalog-detail-pictures .more_photo a');
		if (additionalImages) {
			additionalImages.forEach((img) => {
				const imageUri = img.getAttribute('href');
				result.push(`${prefixes.uri}${imageUri}`);
			});
		}

		return result;
	}

	getDescription(document) {
		const description = this.getTextContent(document, '[itemprop="description"]');

		return valuesHelper.removeIncorrectSymbols(description);
	}

	getFullInformation(document) {
		const tabs = document.querySelectorAll('.tabs__box');
		const information = tabs[1];
		const result = information ? information.innerHTML : '';
		return valuesHelper.removeIncorrectSymbols(result);
	}

	getUsefulArticle(document) {
		const links = document.querySelectorAll('.reviews__item');
		let linksString = '';

		links.forEach((link) => {
			const href = link.getAttribute('href');
			linksString += prefixes.uri + href + ',';
		});

		return linksString.slice(0, -1);
	}


	getItem(timeout, parrent) {
		const options = {method: 'GET'};
		const task = helper.requestWithTimer(this.uri, options, parrent, timeout);
		return Promise.all([task])
			.then((result) => {
				const doc = new JSDOM(result).window.document;

				this.name = this.getName(doc);
				this.price = this.getPrice(doc);
				this.article = this.getArticle(doc);
				this.image = this.getImage(doc);
				this.warranty = this.getWarranty(doc);
				this.documentation = this.getDocumentation(doc);
				this.features = this.getFeatures(doc);

				this.category = this.getBreadCrumbs(doc);
				this.description = this.getDescription(doc);
				this.fullInformation = this.getFullInformation(doc);
				this.additionalInformation = this.getUsefulArticle(doc);

				this.error = '';
			})
			.catch((err) => {
				this.error = err.message;
			});
	}
}

module.exports = Item;
