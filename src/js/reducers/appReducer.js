import {combineReducers}	from 'redux'

//import reducers
import authentication		from "./authReducer.js";
import dashboard			from "./dashboardReducer.js";

import newUser				from "./newUserReducer.js";
import users				from "./usersReducer.js";

import newClient			from "./newClientReducer.js";
import clients				from "./clientsReducer.js";

import notifications		from "./notificationReducer.js";

export default combineReducers({
	authentication,
	dashboard,
	newUser,
	users,
	newClient,
	clients,
	notifications
});