import {NOTIFICATION_ANIMATION_DURATION, COLOR_FAILURE} from "../Constants.js"

const addNotification_ = (notification) => {
	return {
		type: "ADD_NOTIFICATION",
		notification
	};
}

export const updateNotification = (notification) => {
	return {
		type: "UPDATE_NOTIFICATION",
		notification
	};
}

const removeNotification_ = (uuid) => {
	return {
		type: "REMOVE_NOTIFICATION",
		uuid
	}
}

export const addNotification = (notification = {hideDelay: 2500}) => {
	return (dispatch) => {
		
		if(!notification.uuid){
			notification.uuid = Date.now() + "/" + Math.random();
		}
		notification.timestamp = Date.now();
		
		//default actions
		if(!notification.actions){
			notification.actions = [];
		}
		
		notification.hide = () => {
			dispatch(
				updateNotification({
					...notification,
					fadeOut: true
				})
			);
			
			//Removal
			
			setTimeout(() => {
				dispatch(
					removeNotification_(notification.uuid)
				);
			}, NOTIFICATION_ANIMATION_DURATION);
		}
		
		if(notification.hideAction !== false){
			
			notification.actions.unshift({
				text: "Hide",
				color: COLOR_FAILURE,
				action: (e, notification) => {
					notification.hide();
				}
			});
			
		}
		
		dispatch(
			addNotification_({
				...notification,
				fadeIn: true
			})
		);
		
		//set timeout
		
		if(notification.hideDelay){
			
			notification.hideDelay = Math.max(notification.hideDelay, 2500);
			
			//FadeIn
			
			setTimeout(() => {
				dispatch(
					updateNotification({
						...notification,
						fadeIn: false
					})
				);
				
			}, NOTIFICATION_ANIMATION_DURATION);
			
			//FadeOut
			
			setTimeout(() => {
				dispatch(
					updateNotification({
						...notification,
						fadeOut: true
					})
				);
				
			}, notification.hideDelay - NOTIFICATION_ANIMATION_DURATION);
			
			//Removal
			
			setTimeout(() => {
				dispatch(
					removeNotification_(notification.uuid)
				);
			}, notification.hideDelay);
			
		}

		
		
	};
}