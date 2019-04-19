import jsdom from 'jsdom';
import helper from './../../../core/helper';
import ItemAbstract from './../../../core/models/ItemAbstract';

const JSDOM = jsdom.JSDOM;

class Item extends ItemAbstract {
    constructor(json) {
        super(json);
    };

    getItem(timeout, parrent) {
        const options = {method: 'GET'};
        const task = helper.requestWithTimer(this.uri, options, parrent, timeout);
        return Promise.all([task])
            .then((result) => {
                const doc = new JSDOM(result).window.document;

                this.name = this.getTextContent(doc, '.product-name-details');
                this.description = this.getTextContent(doc, '#product-details-page-desc');
                this.image = doc.querySelector('.modal').getAttribute('href');

                this.article = this.getTextContent(doc, '.product-sku').replace(/\n|\t|:|Артикул/gim, '');
                this.country = this.getTextContent(doc, '.manufacturer').replace(/\n|\t|:|Производитель/gim, '');

                const additionalShopAttr = doc.querySelector('.product-fields');
                if (additionalShopAttr && additionalShopAttr.childElementCount !== 0) {
                    const array = [...additionalShopAttr.children];
                    array.forEach((child) => {
                        const name = this.getTextContent(child, '.product-fields-title').replace('\n', '');
                        switch (name) {
                            case 'Количество в упаковке:':
                                this.countPackage = this.getTextContent(child, '.product-field-display').replace('\n', '');
                                break;
                            case 'Масса нетто одной единицы:':
                                this.weight = this.getTextContent(child, '.product-field-display').replace('\n', '');
                                break;
                            case 'Срок годности:':
                                this.shelfLife = this.getTextContent(child, '.product-field-display').replace('\n', '');
                                break;
                        }
                    });
                }

                const categories = [...doc.querySelector('.breadcrumbs').children];
                categories.shift();
                categories.pop();
                this.category = categories ? categories.map((item) => item.textContent).toString() : '';

                this.error = '';
            })
            .catch((err) => {
                this.error = err.message;
            });
    }
};

module.exports = Item;
