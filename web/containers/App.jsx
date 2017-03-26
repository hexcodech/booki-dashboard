import React
       from 'react';
import {createStore, combineReducers, applyMiddleware, compose}
       from 'redux';
import {Provider}
       from 'react-redux';

import {Route}
       from 'react-router-dom';
import createHistory
       from 'history/createBrowserHistory'
import {ConnectedRouter, routerReducer, routerMiddleware}
       from 'react-router-redux';

import thunkMiddleware
       from 'redux-thunk';
import throttle
       from 'lodash/throttle';

import {loadState, saveState}
      from 'core/utilities/local-storage';

//reducer(s)

import appReducer        from 'app/reducers/app';

//Containers

import DevTools          from 'web/containers/dev/DevTools';

import Login             from 'web/components/auth/Login';
import OAuthCallback     from 'web/components/auth/OAuthCallback';

import Content           from 'web/containers/content/Content';
import Dashboard         from 'web/containers/content/dashboard/Dashboard';

import UserRouter        from 'web/containers/content/user/UserRouter';
import ClientRouter      from 'web/containers/content/client/ClientRouter';
import BookRouter        from 'web/containers/content/book/BookRouter';


const presistedState = loadState();
const history        = createHistory();

const store = createStore(
	combineReducers({
		app             : appReducer,
		router          : routerReducer
	}),

	presistedState,

	compose(
		applyMiddleware(
			thunkMiddleware,
			routerMiddleware(history)
		),
		DevTools.instrument(),
	),
);

//storing some keys of the application state in the localstorage
store.subscribe(throttle(() => {
	const state = store.getState();

	saveState({
		router: state.router,
		app: {
			authentication  : state.app.authentication,
			//notifications   : state.app.notifications //functions can't be stored
		}
	});

}, 1000));

const App = () => {
	return (
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<div className='routing'>
					<Route exact path='/' component={Login} />
					<Route path='/auth/callback' component={OAuthCallback} />

          <Route path='/dashboard' component={Dashboard} />
          <Route path='/user' component={UserRouter} />
          <Route path='/client' component={ClientRouter}/>
          <Route path='/book' component={BookRouter}/>

				</div>
			</ConnectedRouter>
		</Provider>
	);
};

export default App;
