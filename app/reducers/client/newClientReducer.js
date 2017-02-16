import {combineReducers}	from 'redux';

const newClient = (state = {}, action) => {
		
	switch(action.type){
		case 'CLEAR_NEW_CLIENT':
			return {};
		case 'UPDATE_NEW_CLIENT':
			return {...state, ...action.client};
		case 'POST_CLIENT':
			return {
				...state,
				isFetching: true,
				didInvalidate: false
			};
		case 'FAIL_CLIENT_POST':
			
			return {
				...state,
				isFetching: false,
				didInvalidate: false
			};
			
		default:
			return state;
		
	};
};

export default newClient;