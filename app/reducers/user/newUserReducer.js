import {combineReducers}	from 'redux';

const newUser = (state = {}, action) => {
		
	switch(action.type){
		case 'CLEAR_NEW_USER':
			return {};
		case 'UPDATE_NEW_USER':
			return {...state, ...action.user};
		case 'POST_USER':
			return {
				...state,
				isFetching: true,
				didInvalidate: false
			};
		case 'FAIL_USER_POST':
			
			return {
				...state,
				isFetching: false,
				didInvalidate: false
			};
			
		default:
			return state;
		
	};
};

export default newUser;