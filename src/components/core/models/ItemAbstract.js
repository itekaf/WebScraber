import helper from './../helper';
import valuesHelper from '../../utils/values';

class ItemAbstract {
	constructor(json = {uri: '', category: ''}) {
		this.id = json.id || valuesHelper.getRandomValue(),
		this.uri = json.uri || '';
		this.name = json.name || '';
		this.description = json.description || '';
		this.price = json.price || '';
		this.sells = json.sells || '';
		this.barcode = json.barcode || '';
		this.country = json.country || '';
		this.category = json.category || '';
		this.appCategory = json.appCategory || '',
		this.error = json.error || '';
		this.dimensions = json.dimensions || '';
		this.article = json.article || '';
		this.minOrder = json.minOrder || '';
		this.countPackage = json.countPackage || '';
		this.dimensionsPackage = json.dimensionsPackage || '';
		this.image = json.image || '';
		this.weight = json.weight || '';
		this.shelfLife = json.shelfLife || '';

		this.size = json.size || '';
		this.color = json.color || '';
		this.height = json.height || '';
		this.videoURI = json.videoURI || '';
		this.possibleSizes = json.possibleSizes || '';
		this.possibleColors = json.possibleColors || '';
		this.possibleHeight = json.possibleHeight || '';
		this.fullInformation = json.fullInformation || '';
		this.productIngredients = json.productIngredients || '';
		this.additionalInformation = json.additionalInformation || '';
	}

	getTextContent(elem, query) {
		const result = elem.querySelector(query);
		return result && result.textContent;
	}

	getItem(timeout, parrent) {
		const options = {method: 'GET'};
		const task = helper.requestWithTimer(this.uri, options, parrent, timeout);
		return Promise.all([task])
			.then((result) => {
				console.log(result);
				this.error = '';
			})
			.catch((err) => {
				this.error = err.message;
			});
	}
};

module.exports = ItemAbstract;
