import rp from 'request-promise';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import Item from './item';
import crud from './../core/crud';
import CategoryAbstract from './../../../core/models/CategoryAbstract';
import populate from 'xlsx-populate';

const startRow = 5;

const collName = 'E';
const collPrice = 'I';
const collArticle = 'C';
const collMinCount = 'F';

class Category extends CategoryAbstract {
	constructor(json) {
		super(json);

		this.website = crud.get.main.settings().website;
	}

	importFile(filePath) {
		return populate.fromFileAsync(filePath)
			.then((workbook) => {
				const workSheet = workbook.sheet(0);
				const endRow = workSheet._rows.length;

				const categoryList = [];
				let lastCategoryId = 0;
				let parrentCategoryName = '';
				for (let index = startRow; index < endRow; index++) {
					const itemName = workSheet.cell(collName + index).value();
					const article = workSheet.cell(collArticle + index).value();
					const minCount = workSheet.cell(collMinCount + index).value();
					const price = workSheet.cell(collPrice + index).value();

					const nextDescription = workSheet.cell(collName + (index + 1)).value();
					const nextArticle = workSheet.cell(collArticle + (index + 1)).value();
					if (itemName && !article && nextDescription && !nextArticle) {
						parrentCategoryName = itemName;
					} else if (itemName && !article) {
						// category
						const categoryItem = new Category({
							name: parrentCategoryName + ' - ' + itemName,
							uri: filePath,
						});
						lastCategoryId = categoryList.push(categoryItem) - 1;
					} else if (itemName && article) {
						// item
						const categoryItem = categoryList[lastCategoryId];
						categoryItem.items.push(new Item({
							name: itemName,
							uri: `${this.website}/show.html?${article}`,
							image: `${this.website}/new/${article}.jpg`,
							article: article,
							category: categoryItem.name,
							appCategory: categoryItem.name,
							price: price,
							minOrder: minCount,
						}));
					}
				}
				return categoryList;
			});
	}

	getPages() { }

	getItems() { }
};

export default Category;
