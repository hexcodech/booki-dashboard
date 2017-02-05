import {combineReducers}	from 'redux'

const users = (state = [], action) => {
		
	switch(action.type){
		case "INVALIDATE_USERS":
			return state.map((user) => {
				return {
					...user,
					didInvalidate: true
				}
			});
		case "REQUEST_USERS":
			return state.map((user) => {
				return {
					...user,
					isFetching: true,
					didInvalidate: false
				}
			});
		case "FAIL_USERS_REQUEST":
			
			console.log(action.error);
			
			return state.map((user) => {
				return {
					...user,
					isFetching: false,
				}
			});
		case "RECEIVE_USERS":
			
			return action.users.map((user) => {
				return {
					...user,
					lastUpdated: action.receivedAt,
				
					isFetching: false,
					didInvalidate: false
				}
			});
		case "INVALIDATE_USER":
			return [...state.filter((user) => { //filter updated user out and insert the new one
					return user._id !== action.user._id;
				}), {
					...action.user,
					didInvalidate: true
				}];
		
		case "REQUEST_USER":
		case "PUT_USER":
			return [...state.filter((user) => { //filter updated user out and insert the new one
					return user._id !== action.user._id;
				}), {
					...action.user,
					isFetching: true,
					didInvalidate: false
				}];
				
		case "DELETE_USER":
			return [...state.filter((user) => { //filter updated user out and insert the new one
					return user._id !== action.user._id;
				})];
			
		case "FAIL_USER_REQUEST":
		case "FAIL_USER_PUT":
			
			console.log(action.error);
		
			return [...state.filter((user) => { //filter updated user out and insert the new one
					return user._id !== action.user._id;
				}), {
					...action.user,
					isFetching: false
				}];
				
		case "FAIL_USER_DELETE":
			
			return [...state, {
				...action.user,
				isFetching: false,
				didInvalidate: false
			}];
			
		case "RECEIVE_USER":
			return [...state.filter((user) => { //filter updated user out and insert the new one
					return user._id !== action.user._id;
				}), {
					...action.user,
					isFetching: false,
					didInvalidate: false,
					lastUpdated: action.receivedAt
				}];
				
		case "DELETED_USER":
		
			return state; //we already deleted the user in the "DELETE_USER" event ^^
		
		default:
			return state;
		
	};
};

export default users;