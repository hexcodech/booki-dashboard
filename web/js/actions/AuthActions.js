import {CLIENT_ID, CLIENT_SECRET, REDIRECT_URI}
						from '../Constants.js';
						
import Utilities		from "../Utilities.js";

//access token
	
const requestAccessToken = (authCode) => {
	return {
		type: "REQUEST_ACCESS_TOKEN",
		authCode
	};
}

const failAccessTokenRequest = (error) => {
	return {
		type: "FAIL_ACCESS_TOKEN_REQUEST",
		error
	}
}

const receiveAccessToken = (accessToken) => {
	return {
		type: "RECEIVE_ACCESS_TOKEN",
		accessToken
	};
}

//yay, thunks for the win!

export const fetchAccessToken = (authCode) => {
	return (dispatch) => {
		//API calls starts
		dispatch(
			requestAccessToken(authCode)
		);
		
		return Utilities.fetchApi("oauth2/token", "POST", {
			clientId		: CLIENT_ID,
			clientSecret	: CLIENT_SECRET,
			code			: authCode,
			grant_type		: "authorization_code"
		}, null, false)
		.then((response) => {
			
			if(response && response.access_token){
				dispatch(
					receiveAccessToken(response.access_token)
				);
				
				return response.access_token.token;
				
			}else{
				throw new Error("No access token in response");
			}
			
			
		}).catch((error) => {
			
			dispatch(
				failAccessTokenRequest(error)
			);
			
			dispatch(push('/'));
		});
		
	};
}



//user

const updateUser = (user, accessToken) => {
	return {
		type: "UPDATE_AUTH_USER",
		user,
		accessToken
	};
}

export const invalidateUser = () => {
	return {
		type: "INVALIDATE_AUTH_USER"
	};
}

const requestUser = (accessToken) => {
	return {
		type: "REQUEST_AUTH_USER",
		accessToken
	};
}

const failUserRequest = (error) => {
	return {
		type: "FAIL_AUTH_USER_REQUEST",
		error
	}
}

const receiveUser = (user, receivedAt) => {
	return {
		type: "RECEIVE_AUTH_USER",
		user,
		receivedAt
	};
}

export const fetchUser = (accessToken) => {
	return (dispatch) => {
		
		dispatch(
			requestUser(accessToken)
		);
		
		return Utilities.fetchApi("user/me", "GET", {}, accessToken)
		.then((user) => {
			
			if(user.permissions.indexOf("admin") !== -1){
				dispatch(
					receiveUser(user, Date.now())
				);
				
			}else{
				throw new Error("The user isn't allowed to access the dashboard");
			}
			
		}).catch((error) => {
			
			dispatch(
				failUserRequest(error)
			);
			
			dispatch(push('/'));
		});
	};
}