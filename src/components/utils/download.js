import path from 'path';
import helper from './../core/helper';


const SETINGS_IMAGE_SEPPARATOR = '-';

const removeQueryString = (uriString) => {
	return uriString.replace(/\?.+/, '');
};

const dowloadHelper = {
	image: (uri, imageIndex, itemIndex, settings, item, context) => {
		const {imageNaming, imageSpeed, imageFolder} = settings;
		const speed = itemIndex * imageSpeed;

		let dest = '';

		if (imageNaming === 'folder') {
			const baseName = removeQueryString(path.basename(uri));
			const imageName = `${imageIndex + 1}${baseName.substr(baseName.lastIndexOf('.'))}`;
			const itemName = item.name.replace(/[/\\?%*:|"<>]/g, '');
			const folderName = `${itemIndex + 1}. ${itemName}`;
			const folderPath = `${imageFolder}/${item.appCategory}/${folderName}`;
			helper.mkDir(folderPath);

			dest = path.join(folderPath, imageName);
		}

		if (imageNaming === 'article') {
			const baseName = path.basename(uri);
			dest = path.join(settings.imageFolder, item.article + SETINGS_IMAGE_SEPPARATOR + baseName);
		}

		const options = {
			url: uri,
			dest: dest,
		};
		const promise = helper.downloadWithTimer(options, context, speed);

		return promise;
	},
};

export default dowloadHelper;
