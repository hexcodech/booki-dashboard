import React														from "react";
import ReactDOM														from "react-dom";
import {createStore, combineReducers, applyMiddleware, compose}		from "redux"
import {Provider}													from "react-redux";
import {Router, Route, IndexRoute, browserHistory}					from "react-router";
import {syncHistoryWithStore, routerReducer, routerMiddleware}		from "react-router-redux";
import thunkMiddleware												from "redux-thunk";
import throttle														from "lodash/throttle";

import {loadState, saveState}										from "./LocalStorage.js";

//reducer(s)

import appReducer													from "./reducers/appReducer.js";

//React Components

import Wrapper														from "./containers/Wrapper.jsx";

//Dev

import DevTools														from "./containers/DevTools.jsx";

//Containers


import Login														from "./containers/auth/Login.jsx";
import OAuthCallback												from "./containers/auth/OAuthCallback.jsx";

import Dashboard													from "./containers/Dashboard.jsx";

import Content														from './containers/Content.jsx';
	import DashboardContent											from './containers/content/DashboardContent.jsx';
	
	import UserList													from './containers/content/UserList.jsx';
	import User														from './containers/content/User.jsx';
	
	import ClientList												from './containers/content/ClientList.jsx';
	import Client													from './containers/content/Client.jsx';
	
	import BookList													from './containers/content/BookList.jsx';
	import Book														from './containers/content/Book.jsx';



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
			<Route path="/" component={Wrapper}>
				<IndexRoute component={Login} />
				<Route path="auth/callback" component={OAuthCallback} />
				
				<Route component={Dashboard}>
					<Route path="dashboard/" component={Content} >
						<IndexRoute component={DashboardContent} />
						
						<Route path="users/" component={UserList} />
						<Route path="user/:userId/" component={User} />
						
						<Route path="clients/" component={ClientList} />
						<Route path="client/:clientId/" component={Client} />
						
						<Route path="books/" component={BookList} />
						<Route path="book/:bookId/" component={Book} />
						
						
					</Route>
				</Route>
				
			</Route>
		</Router>
	</Provider>,
	
	document.getElementById('root')
);