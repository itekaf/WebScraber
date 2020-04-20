const inccorectSymbols = [
	'\\s+',
	'\&nbsp;',
];

const valuesHelper = {
	removeIncorrectSymbols: (value) => {
		const newSymbol = ' ';
		const regExp = new RegExp(inccorectSymbols.join('|'), 'gim');
		return value ? value.trim().replace(regExp, newSymbol) : '';
	},
	getRandomValue: () => Math.floor(Math.random() * 10000000),
	getIsUriHasQueryString: (uri) => (Boolean(~uri.indexOf('?'))),
};
export default valuesHelper;
