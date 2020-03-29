import path from 'path';
import helper from './../core/helper';

const SETINGS_IMAGE_SEPPARATOR = '-';

const removeQueryString = (uriString) => {
	return uriString.replace(/\?.+/, '');
};

const dowloadHelper = {
	image: (uri, index, settings, item, context) => {
		const speed = index * settings.imageSpeed;
		const baseName = removeQueryString(path.basename(uri));
		const folderName = item.name.replace(/[/\\?%*:|"<>]/g, '');
		const folderPath = settings.imageFolder + '/' + folderName;
		helper.mkDir(folderPath);

		const options = {
			url: uri,
			dest: path.join(folderPath, item.article + SETINGS_IMAGE_SEPPARATOR + baseName),
		};
		const promise = helper.downloadWithTimer(options, context, speed);

		return promise;
	},
};

export default dowloadHelper;
