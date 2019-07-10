import fs from 'fs-extra';
import rp from 'request-promise';
import Loading from './../Loading';
import downloadImage from 'image-downloader';
import Modal from './../Modal';
import React from 'react';

// TODO: RL: Move it to utils
const helper = {
	requestWithTimer: (uri, options, context, timer) => {
		return new Promise((resolve, reject) => {
			setTimeout(() => resolve((() => {
				if (context) {
					const loading = new Loading(true, uri).setCounter(context.state.loading.counter - 1);
					context.setState({loading: loading});
				}
				return rp(uri, options);
			})()), timer);
		});
	},
	downloadWithTimer: (options, context, timer) => {
		return new Promise((resolve, reject) => {
			setTimeout(() => resolve((() => {
				const loading = new Loading(true, options.url).setCounter(context.state.loading.counter - 1);
				context.setState({loading: loading});
				return downloadImage.image(options)
					.catch((err) => {
						console.error(err);
					});
			})()), timer);
		});
	},
	modal: (context) => {
		return context.state.loading.result.set ?
			<Modal key={Math.random()} message={context.state.loading.result.message} parrent={context}/>
			: '';
	},
	loading: {
		waiting: (context, message = 'Ожидаем...', counter = 0, disableNav = true) => {
			if (disableNav) document.querySelector('.nav-group').classList.add('disable');
			context.setState({loading: new Loading(true, message).setCounter(counter)});
		},
		result: (context, message = 'Запрос успешно выполнен', status = true, enableNav = true) => {
			if (enableNav) document.querySelector('.nav-group').classList.remove('disable');
			context.setState({loading: new Loading().setResult(status, message)});
		},
	},
	mkDir: (path) => {
		if (!fs.existsSync(path)) {
			fs.mkdirpSync(path);
		}
	},
};
export default helper;
