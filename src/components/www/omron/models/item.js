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
		const crumbsNodes = document.querySelectorAll('.breadcrumbs li');
		const targetCrumbs = [].slice.call(crumbsNodes, 2);
		const crumbs = targetCrumbs.map((crumb) => crumb.textContent);

		return crumbs.reduce((acc, cur, index) => {
			const isLastCrumb = (crumbs.length - 1) === index;

			if (isLastCrumb) return acc + cur;

			return acc + cur + ', ';
		}, '');
	}

	getDescription(document) {
		return document.querySelectorAll('#details')[0].innerHTML;
	}

	getImage(document) {
		const result = [];
		const aNodes = document.querySelectorAll('[data-fancybox="goods-imgs"]');
		aNodes.forEach((aNode) => {
			const imageLink = this.website + aNode.getAttribute('href');
			result.push(imageLink);
		});

		return result;
	}

	getItem(timeout, parent) {
		const options = { method: 'GET' };
		const task = helper.requestWithTimer(this.uri, options, parent, timeout);
		return Promise.all([task])
			.then((result) => {
				const doc = new JSDOM(result).window.document;

				this.name = this.getName(doc);
				this.description = this.getDescription(doc);
				this.image = this.getImage(doc);
				this.sells = this.getTags(doc);

				this.error = '';
			})
			.catch((err) => {
				this.error = err.message;
			});
	}
}

module.exports = Item;
