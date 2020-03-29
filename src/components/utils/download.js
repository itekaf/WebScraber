import path from 'path';
import helper from './../core/helper';


const removeQueryString = (uriString) => {
	return uriString.replace(/\?.+/, '');
};

const dowloadHelper = {
	image: (uri, imageIndex, itemIndex, settings, item, context) => {
		const speed = itemIndex * settings.imageSpeed;

		const baseName = removeQueryString(path.basename(uri));
		const imageName = `${imageIndex + 1}${baseName.substr(baseName.lastIndexOf('.'))}`;
		const itemName = item.name.replace(/[/\\?%*:|"<>]/g, '');
		const folderName = `${itemIndex + 1}. ${itemName}`;
		const folderPath = `${settings.imageFolder}/${item.appCategory}/${folderName}`;
		helper.mkDir(folderPath);

		const options = {
			url: uri,
			dest: path.join(folderPath, imageName),
		};
		const promise = helper.downloadWithTimer(options, context, speed);

		return promise;
	},
};

export default dowloadHelper;
