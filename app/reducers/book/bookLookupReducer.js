import {combineReducers}	from 'redux';

const lookedUpBooks = (state = [], action) => {
		
	switch(action.type){
		
		case 'LOOKUP_BOOKS':
			return [];
			
		case 'FAIL_BOOK_LOOKUP':
			return [];
		
		case 'LOOKED_UP_BOOKS':
			return action.books;
		
		default:
			return state;
		
	};
};

export default lookedUpBooks;