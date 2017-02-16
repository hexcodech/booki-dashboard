import {combineReducers}	from 'redux';

//import reducers
import authentication		from 'reducers/auth/authReducer.js';
import dashboard			from 'reducers/dashboard/dashboardReducer.js';

import newUser				from 'reducers/user/newUserReducer.js';
import users				from 'reducers/user/usersReducer.js';

import newClient			from 'reducers/client/newClientReducer.js';
import clients				from 'reducers/client/clientsReducer.js';

import newBook				from 'reducers/book/newBookReducer.js';
import books				from 'reducers/book/booksReducer.js';

import lookedUpBooks		from 'reducers/book/bookLookupReducer.js';

import notifications		from 'reducers/notification/notificationReducer.js';

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