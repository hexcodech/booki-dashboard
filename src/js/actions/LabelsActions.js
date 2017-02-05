import Utilities		from "../Utilities.js";


//system

export const invalidateLabels = () => {
	return {
		type: "INVALIDATE_LABELS"
	};
}

const requestLabels = (accessToken) => {
	return {
		type: "REQUEST_LABELS",
		accessToken
	};
}

const failLabelsRequest = (error) => {
	return {
		type: "FAIL_LABELS_REQUEST",
		error
	}
}

const receiveLabels = (labels, receivedAt) => {
	return {
		type: "RECEIVE_LABELS",
		labels,
		receivedAt
	};
}

const fetchLabels = (accessToken) => {
	return (dispatch) => {
		
		dispatch(
			requestLabels(accessToken)
		);
		
		return Utilities.fetchApi("label", "GET", {}, accessToken)
		.then((labels) => {
			
			dispatch(
				receiveLabels(labels, Date.now())
			);
			
		}).catch((error) => {
			
			dispatch(
				failLabelsRequest(error)
			);
			
			dispatch(push('/'));
		});
	};
}

const shouldFetchLabels = (state) => {
	const labels = state.app.labels;
	
	if(labels.isFetching){
		return false;
	}else if(labels.lastUpdated === 0){
		return true;
	}else{
		return labels.didInvalidate;
	}
}

export const fetchLabelsIfNeeded = (accessToken) => {
	
	return (dispatch, getState) => {
		if(shouldFetchLabels(getState())){
			// Dispatch a thunk from thunk!
			return dispatch(fetchLabels(accessToken));
		}else{
			// Let the calling code know there's nothing to wait for.
			return Promise.resolve();
		}
	}
}