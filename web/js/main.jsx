import React														from 'react';
import ReactDOM														from 'react-dom';
import {createStore, combineReducers, applyMiddleware, compose}		from 'redux'
import {Provider}													from 'react-redux';
import {Router, Route, IndexRoute, browserHistory}					from 'react-router';
import {syncHistoryWithStore, routerReducer, routerMiddleware}		from 'react-router-redux';
import thunkMiddleware												from 'redux-thunk';
import throttle														from 'lodash/throttle';

import {loadState, saveState}										from 'utilities/LocalStorage.js';

//reducer(s)

import appReducer													from 'reducers/appReducer.js';

//React Components

import Wrapper														from 'containers/layout/Wrapper.jsx';

//Dev

import DevTools														from 'containers/dev/DevTools.jsx';

//Containers


import Login														from 'components/auth/Login.jsx';
import OAuthCallback												from 'components/auth/OAuthCallback.jsx';

import Content														from 'containers/content/Content.jsx';
	import DashboardContent											from 'containers/content/dashboard/Dashboard.jsx';
	
	import UserList													from 'containers/content/user/UserList.jsx';
	import User														from 'containers/content/user/User.jsx';
	
	import ClientList												from 'containers/content/client/ClientList.jsx';
	import Client													from 'containers/content/client/Client.jsx';
	
	import BookList													from 'containers/content/book/BookList.jsx';
	import Book														from 'containers/content/book/Book.jsx';



const presistedState = loadState();

const store = createStore(
	combineReducers({
		app					: appReducer,
		routing				: routerReducer
	}),
	
	presistedState,
	
	compose(
		applyMiddleware(
			thunkMiddleware,
			routerMiddleware(browserHistory)
		),
		DevTools.instrument(),
	),
);

store.subscribe(throttle(() => {	
	const state = store.getState();
	
	saveState({
		routing: state.routing,
		app: {
			authentication: state.app.authentication
		}
	});
	
}, 1000));

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
	<Provider store={store}>
	
		{ /* Tell the Router to use our enhanced history */ }		
		
		<Router history={history}>
			<Route path='/'>
				<IndexRoute component={Login} />
				<Route path='auth/callback' component={OAuthCallback} />
				
				<Route component={Wrapper}>
					<Route path='dashboard/' component={Content} >
						<IndexRoute component={DashboardContent} />
						
						<Route path='users/' component={UserList} />
						<Route path='user/:userId/' component={User} />
						
						<Route path='clients/' component={ClientList} />
						<Route path='client/:clientId/' component={Client} />
						
						<Route path='books/' component={BookList} />
						<Route path='book/:bookId/' component={Book} />
						
						
					</Route>
				</Route>
				
			</Route>
		</Router>
	</Provider>,
	
	document.getElementById('root')
);