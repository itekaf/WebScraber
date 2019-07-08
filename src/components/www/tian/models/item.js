import helper from './../../../core/helper';
import crud from './../core/crud';
import ItemAbstract from './../../../core/models/ItemAbstract';

class Item extends ItemAbstract {
	constructor(json) {
		super(json);

		this.website = crud.get.main.settings().website;
	};

	getItem(timeout, parrent) {
		const options = {method: 'GET'};
		const task = helper.requestWithTimer(`${ this.website}/new/csv/${this.article}.csv`, options, parrent, timeout);
		return Promise.all([task])
			.then((result) => {
				const itemArray = result[0].split('~');

				this.description = itemArray[2];

				this.error = '';
			})
			.catch((err) => {
				this.error = err.message;
			});
	}
};

module.exports = Item;
