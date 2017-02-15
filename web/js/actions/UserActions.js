import debounce			from 'lodash/debounce';
import Utilities		from "../Utilities.js";

import {addErrorNotification}
							from "./NotificationActions.js";


//system

export const invalidateUsers = () => {
	return {
		type: "INVALIDATE_USERS"
	};
}

const requestUsers = (accessToken) => {
	return {
		type: "REQUEST_USERS",
		accessToken
	};
}

const failUsersRequest = (error) => {
	return {
		type: "FAIL_USERS_REQUEST",
		error
	}
}

const receiveUsers = (users, receivedAt) => {
	return {
		type: "RECEIVE_USERS",
		users,
		receivedAt
	};
}

const fetchUsers = (accessToken) => {
	return (dispatch) => {
		
		dispatch(
			requestUsers(accessToken)
		);
		
		return Utilities.fetchApi("user", "GET", {filter: {}}, accessToken)
		.then((users) => {
			
			dispatch(
				receiveUsers(users, Date.now())
			);
			
		}).catch((error) => {
			
			dispatch(
				failUsersRequest(error)
			);
			
			dispatch(
				addErrorNotification(error)
			);
			
		});
	};
}

const shouldFetchUsers = (state) => {
	const users = state.app.users;
	
	for(let i=0;i<users.length;i++){
		
		if(users[i].isFetching){
			return false;
		}
		
		if(users[i].didInvalidate || users[i].lastUpdated === 0){
			return true; //if at least one invalidated and shouldFetchUsers is called -> update all
		}
	}
	
	return users.length === 0;
}

export const fetchUsersIfNeeded = (accessToken) => {
	
	return (dispatch, getState) => {
		if(shouldFetchUsers(getState())){
			// Dispatch a thunk from thunk!
			return dispatch(fetchUsers(accessToken));
		}else{
			// Let the calling code know there's nothing to wait for.
			return Promise.resolve();
		}
	}
}

export const invalidateUser = (user) => {
	return {
		type: "INVALIDATE_USER",
		user
	};
}

export const clearNewUser = () => {
	return {
		type: "CLEAR_NEW_USER"
	};
}

export const updateNewUser = (user) => {
	return {
		type: "UPDATE_NEW_USER",
		user
	};
}


const requestUser = (user) => {
	return {
		type: "REQUEST_USER",
		user
	};
}

const failUserRequest = (error, user) => {
	return {
		type: "FAIL_USER_REQUEST",
		error,
		user
	};
}

const receiveUser = (user, receivedAt) => {
	return {
		type: "RECEIVE_USER",
		user,
		receivedAt
	};
}


const fetchUser = (user, accessToken) => {
	return (dispatch) => {
		
		dispatch(
			requestUser(user)
		);
		
		return Utilities.fetchApi("user/" + user._id, "GET", {}, accessToken)
		.then((refreshedUser) => {
			
			dispatch(
				receiveUser(refreshedUser, Date.now())
			);
			
		}).catch((error) => {
			
			dispatch(
				failUsersRequest(error)
			);
			
			dispatch(
				addErrorNotification(error)
			);
			
		});
	};
};

const shouldFetchUser = (state, user) => {
	
	if(user.isFetching){
		return false;
	}else if(!user || !user.lastUpdated || user.lastUpdated === 0){
		return true;
	}else{
		return user.didInvalidate;
	}
}

export const fetchUserIfNeeded = (user, accessToken) => {
	
	return (dispatch, getState) => {
		if(shouldFetchUser(getState(), user)){
			// Dispatch a thunk from thunk!
			return dispatch(fetchUser(user, accessToken));
		}else{
			// Let the calling code know there's nothing to wait for.
			return Promise.resolve();
		}
	}
}

const putUser_ = (user) => {
	return {
		type: "PUT_USER",
		user
	};
}

const failUserPut = (error, user) => {
	return {
		type: "FAIL_USER_PUT",
		error,
		user
	};
}

const debouncedPut = debounce((dispatch, user, accessToken) => {
	
	return Utilities.fetchApi("user/" + user._id, "PUT", {user}, accessToken)
	.then((updatedUser) => {
		
		dispatch(
			receiveUser(updatedUser, Date.now())
		);
		
		return updatedUser;
		
	}).catch((error) => {
		
		dispatch(
			failUserPut(error, user)
		);
		
		dispatch(
			addErrorNotification(error)
		);
		
	});
	
}, 1000);

export const putUser = (user, accessToken) => {
	return (dispatch) => {
		
		dispatch(
			putUser_(user)
		);
		
		debouncedPut(dispatch, user, accessToken);
		
	};
}

const postUser_ = (user) => {
	return {
		type: "POST_USER",
		user
	};
}

const failUserPost = (error, user) => {
	return {
		type: "FAIL_USER_POST",
		error,
		user
	};
}

export const postUser = (user, accessToken) => {
	return (dispatch) => {
		
		dispatch(
			postUser_(user)
		);
		
		return Utilities.fetchApi("user", "POST", {user}, accessToken)
		.then((savedUser) => {
			
			dispatch(
				receiveUser(savedUser, Date.now())
			);
			
			return savedUser;
			
		}).catch((error) => {
			
			dispatch(
				failUserPost(error, user)
			);
			
			dispatch(
				addErrorNotification(error)
			);
			
		});
	};
}

const deleteUser_ = (user) => {
	return {
		type: "DELETE_USER",
		user
	};
}

const failUserDelete = (error, user) => {
	return {
		type: "FAIL_USER_DELETE",
		error,
		user
	};
}

const deletedUser = (user, success) => {
	return {
		type: "DELETED_USER",
		user,
		success
	};
}

export const deleteUser = (user, accessToken) => {
	return (dispatch) => {
		
		dispatch(
			deleteUser_(user)
		);
		
		return Utilities.fetchApi("user/" + user._id, "DELETE", {}, accessToken)
		.then((response) => {
			
			dispatch(
				deletedUser(user, response.success)
			);
			
			if(!response.success){
				failUserDelete("The API couldn't delete the user!", user)
			}
			
			return response.success;
			
		}).catch((error) => {
			
			dispatch(
				failUserDelete(error, user)
			);
			
			dispatch(
				addErrorNotification(error)
			);
			
		});
	};
}