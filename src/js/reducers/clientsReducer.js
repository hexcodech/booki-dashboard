import {combineReducers}	from 'redux'

const clients = (state = [], action) => {
		
	switch(action.type){
		case "INVALIDATE_CLIENTS":
			return state.map((client) => {
				return {
					...client,
					didInvalidate: true
				}
			});
		case "REQUEST_CLIENTS":
			return state.map((client) => {
				return {
					...client,
					isFetching: true,
					didInvalidate: false
				}
			});
		case "FAIL_CLIENTS_REQUEST":
			
			return state.map((client) => {
				return {
					...client,
					isFetching: false,
				}
			});
		case "RECEIVE_CLIENTS":
			
			return action.clients.map((client) => {
				return {
					...client,
					lastUpdated: action.receivedAt,
				
					isFetching: false,
					didInvalidate: false
				}
			});
		case "INVALIDATE_CLIENT":
			return [...state.filter((client) => { //filter updated client out and insert the new one
					return client._id !== action.client._id;
				}), {
					...action.client,
					didInvalidate: true
				}];
		
		case "REQUEST_CLIENT":
		case "PUT_CLIENT":
			return [...state.filter((client) => { //filter updated client out and insert the new one
					return client._id !== action.client._id;
				}), {
					...action.client,
					isFetching: true,
					didInvalidate: false
				}];
				
		case "DELETE_CLIENT":
			return [...state.filter((client) => { //filter updated client out and insert the new one
					return client._id !== action.client._id;
				})];
			
		case "FAIL_CLIENT_REQUEST":
		case "FAIL_CLIENT_PUT":
		
			return [...state.filter((client) => { //filter updated client out and insert the new one
					return client._id !== action.client._id;
				}), {
					...action.client,
					isFetching: false
				}];
				
		case "FAIL_CLIENT_DELETE":
			
			return [...state, {
				...action.client,
				isFetching: false,
				didInvalidate: false
			}];
			
		case "RECEIVE_CLIENT":
			return [...state.filter((client) => { //filter updated client out and insert the new one
					return client._id !== action.client._id;
				}), {
					...action.client,
					isFetching: false,
					didInvalidate: false,
					lastUpdated: action.receivedAt
				}];
				
		case "DELETED_CLIENT":
		
			return state; //we already deleted the client in the "DELETE_CLIENT" event ^^
		
		default:
			return state;
		
	};
};

export default clients;