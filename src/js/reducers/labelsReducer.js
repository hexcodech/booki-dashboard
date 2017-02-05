import {combineReducers}	from 'redux'

const labels = (state = {
	lastUpdated: 0,
	didInvalidate: true,
	isFetching: false
}, action) => {
		
	switch(action.type){
		case "INVALIDATE_LABELS":
			return {
				...state,
				didInvalidate: true
			};
		case "REQUEST_LABELS":
			return {
				...state,
				isFetching: true,
				didInvalidate: false
			};
		case "FAIL_LABELS_REQUEST":
			
			console.log(action.error);
			
			return {
				...state,
				isFetching: false
			};
			
		case "RECEIVE_LABELS":
		
			return {
				...state,
				...action.labels,
				
				lastUpdated: action.receivedAt,
				didInvalidate: false,
				isFetching: false
			};
				
		default:
			return state;
		
	};
};

export default labels;