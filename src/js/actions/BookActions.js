import debounce			from 'lodash/debounce';
import Utilities		from "../Utilities.js";

import {addErrorNotification}
							from "./NotificationActions.js";

export const invalidateBooks = () => {
	return {
		type: "INVALIDATE_BOOKS"
	};
}

const requestBooks = (accessToken) => {
	return {
		type: "REQUEST_BOOKS",
		accessToken
	};
}

const failBooksRequest = (error) => {
	return {
		type: "FAIL_BOOKS_REQUEST",
		error
	}
}

const receiveBooks = (books, receivedAt) => {
	return {
		type: "RECEIVE_BOOKS",
		books,
		receivedAt
	};
}

const fetchBooks = (accessToken) => {
	return (dispatch) => {
		
		dispatch(
			requestBooks(accessToken)
		);
		
		return Utilities.fetchApi("book", "GET", {filter: {}}, accessToken)
		.then((books) => {
			
			dispatch(
				receiveBooks(books, Date.now())
			);
			
		}).catch((error) => {
			
			dispatch(
				failBooksRequest(error)
			);
			
			dispatch(
				addErrorNotification(error)
			);
			
		});
	};
}

const shouldFetchBooks = (state) => {
	const books = state.app.books;
	
	for(let i=0;i<books.length;i++){
		
		if(books[i].isFetching){
			return false;
		}
		
		if(books[i].didInvalidate || books[i].lastUpdated === 0){
			return true; //if at least one invalidated or wasn't loaded yet, shouldFetchBooks is called -> update all
		}
	}
	
	return books.length === 0;
}

export const fetchBooksIfNeeded = (accessToken) => {
	
	return (dispatch, getState) => {
		if(shouldFetchBooks(getState())){
			// Dispatch a thunk from thunk!
			return dispatch(fetchBooks(accessToken));
		}else{
			// Let the calling code know there's nothing to wait for.
			return Promise.resolve();
		}
	}
}

export const invalidateBook = (book) => {
	return {
		type: "INVALIDATE_BOOK",
		book
	};
}

export const clearNewBook = () => {
	return {
		type: "CLEAR_NEW_BOOK"
	};
}

export const updateNewBook = (book) => {
	return {
		type: "UPDATE_NEW_BOOK",
		book
	};
}

const requestBook = (book) => {
	return {
		type: "REQUEST_BOOK",
		book
	};
}

const failBookRequest = (error, book) => {
	return {
		type: "FAIL_BOOK_REQUEST",
		error,
		book
	};
}

const receiveBook = (book, receivedAt) => {
	return {
		type: "RECEIVE_BOOK",
		book,
		receivedAt
	};
}

const fetchBook = (book, accessToken) => {
	return (dispatch) => {
		
		dispatch(
			requestBook(book)
		);
		
		return Utilities.fetchApi("book/" + book._id, "GET", {}, accessToken)
		.then((refreshedBook) => {
			
			dispatch(
				receiveBook(refreshedBook, Date.now())
			);
			
		}).catch((error) => {
			
			dispatch(
				failBookRequest(error)
			);
			
			dispatch(
				addErrorNotification(error)
			);
			
		});
	};
};

const shouldFetchBook = (state, book) => {
	
	if(book.isFetching){
		return false;
	}else if(!book || !book.lastUpdated || book.lastUpdated === 0){
		return true;
	}else{
		return book.didInvalidate;
	}
}

export const fetchBookIfNeeded = (book, accessToken) => {
	
	return (dispatch, getState) => {
		if(shouldFetchBook(getState(), book)){
			// Dispatch a thunk from thunk!
			return dispatch(fetchBook(book, accessToken));
		}else{
			// Let the calling code know there's nothing to wait for.
			return Promise.resolve();
		}
	}
}


const putBook_ = (book) => {
	return {
		type: "PUT_BOOK",
		book
	};
}

const failBookPut = (error, book) => {
	return {
		type: "FAIL_BOOK_PUT",
		error,
		book
	};
}

const debouncedPut = debounce((dispatch, book, accessToken) => {
	
	return Utilities.fetchApi("book/" + book._id, "PUT", {book}, accessToken)
	.then((updatedBook) => {
		
		dispatch(
			receiveBook(updatedBook, Date.now())
		);
		
		return updatedBook;
		
	}).catch((error) => {
		
		dispatch(
			failBookPut(error, book)
		);
		
		dispatch(
			addErrorNotification(error)
		);
		
	});
	
}, 1000);

export const putBook = (book, accessToken) => {
	return (dispatch) => {
		
		dispatch(
			putBook_(book)
		);
		
		debouncedPut(dispatch, book, accessToken);
		
	};
}

const postBook_ = (book) => {
	return {
		type: "POST_BOOK",
		book
	};
}

const failBookPost = (error, book) => {
	return {
		type: "FAIL_BOOK_POST",
		error,
		book
	};
}

export const postBook = (book, accessToken) => {
	return (dispatch) => {
		
		dispatch(
			postBook_(book)
		);
		
		return Utilities.fetchApi("book", "POST", {book}, accessToken)
		.then((savedBook) => {
			
			dispatch(
				receiveBook(savedBook, Date.now())
			);
			
			return savedBook;
			
		}).catch((error) => {
			
			dispatch(
				failBookPost(error, book)
			);
			
			dispatch(
				addErrorNotification(error)
			);
			
		});
	};
}

const deleteBook_ = (book) => {
	return {
		type: "DELETE_BOOK",
		book
	};
}

const deletedBook = (book, success) => {
	return {
		type: "DELETED_BOOK",
		book,
		success
	};
}

const failBookDelete = (error, book) => {
	return {
		type: "FAIL_BOOK_DELETE",
		error,
		book
	};
}

export const deleteBook = (book, accessToken) => {
	return (dispatch) => {
		
		dispatch(
			deleteBook_(book)
		);
		
		return Utilities.fetchApi("book/" + book._id, "DELETE", {}, accessToken)
		.then((response) => {
			
			dispatch(
				deletedBook(book, response.success)
			);
			
			if(!response.success){
				failBookDelete("The API couldn't delete the book!", book)
			}
			
			return response.success;
			
		}).catch((error) => {
			
			dispatch(
				failBookDelete(error, book)
			);
			
			dispatch(
				addErrorNotification(error)
			);
			
		});
	};
}

const lookUpBooks_ = () => {
	return {
		type: "LOOKUP_BOOKS"
	};
};

const failBookLookup = (error) => {
	return {
		type: "FAIL_BOOK_LOOKUP",
		error
	};
};

const lookedUpBooks = (books) => {
	return {
		type: "LOOKED_UP_BOOKS",
		books
	};
};


export const lookUpBooks = (field, value, accessToken) => {
	return (dispatch, getState) => {
		
		dispatch(
			lookUpBooks_()
		);
		
		//http specs don't allow bodies in get requests, where can i get my day back?
		return Utilities.fetchApi("book/lookup?" + field + "=" + value, "GET", {}, accessToken)
		.then((books) => {
			
			dispatch(
				lookedUpBooks(books)
			);
			
			return books;
			
		}).catch((error) => {
			
			dispatch(
				failBookLookup(error)
			);
			
			dispatch(
				addErrorNotification(error)
			);
			
		});
	};
};