import debounce			from 'lodash/debounce';
import Utilities		from "../Utilities.js";

import {addErrorNotification}
							from "./NotificationActions.js";


//system

export const invalidateClients = () => {
	return {
		type: "INVALIDATE_CLIENTS"
	};
}

const requestClients = (accessToken) => {
	return {
		type: "REQUEST_CLIENTS",
		accessToken
	};
}

const failClientsRequest = (error) => {
	return {
		type: "FAIL_CLIENTS_REQUEST",
		error
	}
}

const receiveClients = (clients, receivedAt) => {
	return {
		type: "RECEIVE_CLIENTS",
		clients,
		receivedAt
	};
}

const fetchClients = (accessToken) => {
	return (dispatch) => {
		
		dispatch(
			requestClients(accessToken)
		);
		
		return Utilities.fetchApi("oauth2/client", "GET", {filter: {}}, accessToken)
		.then((clients) => {
			
			dispatch(
				receiveClients(clients, Date.now())
			);
			
		}).catch((error) => {
			
			dispatch(
				failClientsRequest(error)
			);
			
			dispatch(
				addErrorNotification(error)
			);
			
		});
	};
}

const shouldFetchClients = (state) => {
	const clients = state.app.clients;
	
	for(let i=0;i<clients.length;i++){
		
		if(clients[i].isFetching){
			return false;
		}
		
		if(clients[i].didInvalidate || clients[i].lastUpdated === 0){
			return true; //if at least one invalidated or wasn't loaded yet, shouldFetchClients is called -> update all
		}
	}
	
	return clients.length === 0;
}

export const fetchClientsIfNeeded = (accessToken) => {
	
	return (dispatch, getState) => {
		if(shouldFetchClients(getState())){
			// Dispatch a thunk from thunk!
			return dispatch(fetchClients(accessToken));
		}else{
			// Let the calling code know there's nothing to wait for.
			return Promise.resolve();
		}
	}
}

export const invalidateClient = (client) => {
	return {
		type: "INVALIDATE_CLIENT",
		client
	};
}

export const clearNewClient = () => {
	return {
		type: "CLEAR_NEW_CLIENT"
	};
}

export const updateNewClient = (client) => {
	return {
		type: "UPDATE_NEW_CLIENT",
		client
	};
}

const putClient_ = (client) => {
	return {
		type: "PUT_CLIENT",
		client
	};
}

const postClient_ = (client) => {
	return {
		type: "POST_CLIENT",
		client
	};
}

const deleteClient_ = (client) => {
	return {
		type: "DELETE_CLIENT",
		client
	};
}

const failClientPut = (error, client) => {
	return {
		type: "FAIL_CLIENT_PUT",
		error,
		client
	};
}

const failClientPost = (error, client) => {
	return {
		type: "FAIL_CLIENT_POST",
		error,
		client
	};
}

const failClientDelete = (error, client) => {
	return {
		type: "FAIL_CLIENT_DELETE",
		error,
		client
	};
}

const requestClient = (client) => {
	return {
		type: "REQUEST_CLIENT",
		client
	};
}

const failClientRequest = (error, client) => {
	return {
		type: "FAIL_CLIENT_REQUEST",
		error,
		client
	};
}

const receiveClient = (client, receivedAt) => {
	return {
		type: "RECEIVE_CLIENT",
		client,
		receivedAt
	};
}

const deletedClient = (client, success) => {
	return {
		type: "DELETED_CLIENT",
		client,
		success
	};
}

const debouncedPut = debounce((dispatch, client, accessToken) => {
	
	return Utilities.fetchApi("oauth2/client/" + client._id, "PUT", {client}, accessToken)
	.then((updatedClient) => {
		
		dispatch(
			receiveClient(updatedClient, Date.now())
		);
		
		return updatedClient;
		
	}).catch((error) => {
		
		dispatch(
			failClientPut(error, client)
		);
		
		dispatch(
			addErrorNotification(error)
		);
		
	});
	
}, 1000);

export const putClient = (client, accessToken) => {
	return (dispatch) => {
		
		dispatch(
			putClient_(client)
		);
		
		debouncedPut(dispatch, client, accessToken);
		
	};
}

export const postClient = (client, accessToken) => {
	return (dispatch) => {
		
		dispatch(
			postClient_(client)
		);
		
		return Utilities.fetchApi("oauth2/client", "POST", {client}, accessToken)
		.then((savedClient) => {
			
			dispatch(
				receiveClient(savedClient, Date.now())
			);
			
			return savedClient;
			
		}).catch((error) => {
			
			dispatch(
				failClientPost(error, client)
			);
			
			dispatch(
				addErrorNotification(error)
			);
			
		});
	};
}

export const deleteClient = (client, accessToken) => {
	return (dispatch) => {
		
		dispatch(
			deleteClient_(client)
		);
		
		return Utilities.fetchApi("oauth2/client/" + client._id, "DELETE", {}, accessToken)
		.then((response) => {
			
			dispatch(
				deletedClient(client, response.success)
			);
			
			if(!response.success){
				failClientDelete("The API couldn't delete the client!", client)
			}
			
			return response.success;
			
		}).catch((error) => {
			
			dispatch(
				failClientDelete(error, client)
			);
			
			dispatch(
				addErrorNotification(error)
			);
			
		});
	};
}

const fetchClient = (client, accessToken) => {
	return (dispatch) => {
		
		dispatch(
			requestClient(client)
		);
		
		return Utilities.fetchApi("oauth2/client/" + client._id, "GET", {}, accessToken)
		.then((refreshedClient) => {
			
			dispatch(
				receiveClient(refreshedClient, Date.now())
			);
			
		}).catch((error) => {
			
			dispatch(
				failClientRequest(error)
			);
			
			dispatch(
				addErrorNotification(error)
			);
			
		});
	};
};

const shouldFetchClient = (state, client) => {
	
	if(client.isFetching){
		return false;
	}else if(!client || !client.lastUpdated || client.lastUpdated === 0){
		return true;
	}else{
		return client.didInvalidate;
	}
}

export const fetchClientIfNeeded = (client, accessToken) => {
	
	return (dispatch, getState) => {
		if(shouldFetchClient(getState(), client)){
			// Dispatch a thunk from thunk!
			return dispatch(fetchClient(client, accessToken));
		}else{
			// Let the calling code know there's nothing to wait for.
			return Promise.resolve();
		}
	}
}