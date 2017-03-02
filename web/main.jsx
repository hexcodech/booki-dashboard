import React														from 'react';
import ReactDOM														from 'react-dom';
//import {AppContainer}												from 'react-hot-loader';

import App															from 'web/containers/App';

const render = () => {
	ReactDOM.render(
		//<AppContainer>
			<App/>,
		//</AppContainer>,
		document.getElementById('root')
	);
}

render();

if(module.hot){
	module.hot.accept('./containers/App', () => { render(); })
}