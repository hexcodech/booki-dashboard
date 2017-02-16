import {combineReducers}	from 'redux';

//import reducers
import authentication		from 'reducers/auth';
import dashboard			from 'reducers/dashboard';

import users				from 'reducers/users';
import newUser				from 'reducers/user/new';

import clients				from 'reducers/clients';
import newClient			from 'reducers/client/new';

import books				from 'reducers/books';
import newBook				from 'reducers/book/new';

import lookedUpBooks		from 'reducers/book/looked-up';

import notifications		from 'reducers/notifications';

export default combineReducers({
	authentication,
	dashboard,
	
	newUser,
	users,
	
	newClient,
	clients,
	
	newBook,
	books,
	
	lookedUpBooks,
	
	notifications
});