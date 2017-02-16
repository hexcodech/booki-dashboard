import {combineReducers}	from 'redux';

const newBook = (state = {}, action) => {
		
	switch(action.type){
		case 'CLEAR_NEW_BOOK':
			return {};
		case 'UPDATE_NEW_BOOK':
			return {...state, ...action.book};
		case 'POST_BOOK':
			return {
				...state,
				isFetching: true,
				didInvalidate: false
			};
		case 'FAIL_BOOK_POST':
			
			return {
				...state,
				isFetching: false,
				didInvalidate: false
			};
			
		default:
			return state;
		
	};
};

export default newBook;