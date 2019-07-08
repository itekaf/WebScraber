import jsdom from 'jsdom';

const JSDOM = jsdom.JSDOM;

class CategoryAbstract {
	constructor(json = {name: '', uri: ''}) {
		this.id = json.id || Math.floor(Math.random() * 100000000);
		this.uri = json.uri;
		this.name = json.name;
		this.pages = json.pages || 0;
		this.active = typeof json.active === 'boolean' ? json.active : true;
		this.items = json.items || [];
		this.error = json.error || '';
		this.pageTitle = '';
	}

	getSelectorAll(response, query) {
		const html = new JSDOM(response).window.document;
		return html.querySelectorAll(query);
	}
	getPages() {}

	getItems() {}

	importFile() {}

	create(resetItems = true) {
		this.pages = 0;
		if (resetItems) {
			this.items = [];
		}
		return Promise.all([this.getPages(), this.getItems()]).then(() => this);
	}
};

module.exports = CategoryAbstract;
