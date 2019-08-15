const documentHelper = {
	getNextSibling: (document, query, elementCondition, nextSiblingCondition) => {
		const result = [];
		const elements = document.querySelectorAll(query);
		elements.forEach((element) => {
			if (element && elementCondition && element.textContent !== elementCondition) {
				return null;
			}

			if (nextSiblingCondition) {
				let nextSibling = element ? element.nextSibling : null;
				while (nextSibling) {
					if (nextSiblingCondition(nextSibling)) {
						result.push((nextSibling && nextSibling.textContent === '' ? null : nextSibling));
						nextSibling = nextSibling.nextSibling;
					} else {
						nextSibling = null;
					}
				}
			} else {
				const nextSibling = element ? element.nextSibling : null;
				result.push((nextSibling && nextSibling.textContent === '' ? null : nextSibling));
			}
		});
		return result;
	},
	getParrentNextSibling: (document, query, elementCondition, nextSiblingCondition) => {
		const result = [];
		const elements = document.querySelectorAll(query);
		elements.forEach((element) => {
			if (element && elementCondition && element.textContent !== elementCondition) {
				return null;
			}

			if (nextSiblingCondition) {
				let nextSibling = element ? element.parentElement.nextSibling : null;
				while (nextSibling) {
					if (nextSiblingCondition(nextSibling)) {
						result.push((nextSibling && nextSibling.textContent === '' ? null : nextSibling));
						nextSibling = nextSibling.nextSibling;
					} else {
						nextSibling = null;
					}
				}
			} else {
				const nextSibling = element ? element.parentElement.nextSibling : null;
				result.push((nextSibling && nextSibling.textContent === '' ? null : nextSibling));
			}
		});
		return result;
	},
};
export default documentHelper;
