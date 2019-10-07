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
		const options = {
			url: uri,
			dest: path.join(settings.imageFolder, item.article + SETINGS_IMAGE_SEPPARATOR + baseName),
		};
		const promise = helper.downloadWithTimer(options, context, speed);
		return promise;
	},
};
export default dowloadHelper;
