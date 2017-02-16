import {combineReducers}	from 'redux';

const notification = (state = [], action) => {
		
	switch(action.type){
		case 'ADD_NOTIFICATION':
			return [
				...state,
				action.notification
			];
			
		case 'UPDATE_NOTIFICATION':
			
			return [
				...state.filter((notification) => {
					return notification.uuid !== action.notification.uuid;
				}),
				action.notification
			];
			
		case 'REMOVE_NOTIFICATION':
			return state.filter((notification) => {
				return notification.uuid !== action.uuid;
			});
			
		default:
			return state;
		
	};
};

export default notification;