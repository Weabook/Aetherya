import React from 'react';
import ReactDOM from 'react-dom';

require('@babel/polyfill');

function init() {
	// HMR requires that this be a require()
	let App = require('./components/app').default;
	const archive = document.getElementById('archive');
	ReactDOM.render(<App />, archive ? archive : document.getElementById('app'));
}

init();

if (module.hot) module.hot.accept('./components/app', init);
