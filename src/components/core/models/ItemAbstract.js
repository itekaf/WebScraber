import helper from './../helper';

class ItemAbstract {
    constructor(json = {uri: '', category: ''}) {
        this.id = json.id || Math.floor(Math.random() * 10000000),
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
