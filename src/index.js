import App from './App.js';
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import ElectronCookies from '@exponent/electron-cookies';

window.onload = () => {
	ElectronCookies.enable({
		origin: 'https://decentworld.com',
	});

	ReactDOM.render(
		<BrowserRouter>
			<App/>
		</BrowserRouter>,
		document.getElementById('app')
	);
};
