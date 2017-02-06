import React				from 'react';

import {connect}			from 'react-redux';
import {push}				from 'react-router-redux';
import JSONTree				from 'react-json-tree';

import RefreshButton		from '../../components/RefreshButton.jsx';
import FormGroups			from '../../components/FormGroups.jsx';


import Utilities			from '../../Utilities.js';
import {arrayGenerator, checkboxGenerator}
							from '../../FieldGenerators.js';


import {CLIENT_ID, JSONTreeTheme, COLOR_SUCCESS, COLOR_FAILURE, COLOR_INFO}
							from '../../Constants.js';

import {invalidateClients, clearNewClient, updateNewClient, fetchClientsIfNeeded, putClient, postClient, deleteClient}
							from '../../actions/ClientActions.js';
import {fetchUsersIfNeeded}
							from '../../actions/UserActions.js';
							
import {addNotification}
							from '../../actions/NotificationActions.js';

class Client extends React.Component{
	
	constructor(props){
		super(props);
		
		Utilities.bindAll(this, [
			"componentDidMount", 	"handleRefreshClick", 	"handleOnChange",
			"handleOnAddNewClient", 	"handleOnDeleteClient"
		]);
	}
	
	componentDidMount() {
		const {dispatch, accessToken} = this.props;
		
		dispatch(fetchClientsIfNeeded(accessToken));
		dispatch(fetchUsersIfNeeded(accessToken));
	}
	
	handleRefreshClick(e) {
		e.preventDefault();
		
		const {dispatch, accessToken} = this.props;
		
		dispatch(invalidateClients());
		dispatch(fetchClientsIfNeeded(accessToken));
	}
	
	handleOnChange(id, value){
		const {dispatch, accessToken, newClient, clients, params: {clientId} } = this.props;
		
		let client;
		
		if(clientId === "new"){
			
			client = Object.assign({}, newClient);
			
			if(Utilities.updatePropertyByString(client, id, value)){
				dispatch(
					updateNewClient(client)
				);
			}
			
		}else{
			
			client = Object.assign({}, clients.filter((client) => {
				return client._id === clientId;
			})[0]);
			
			if(Utilities.updatePropertyByString(client, id, value)){
				dispatch(
					putClient(client, accessToken)
				);
			}
			
		}
	}
	
	handleOnAddNewClient(e){
		e.preventDefault();
		e.stopPropagation();
		
		const {dispatch, accessToken, newClient} = this.props;
		const client = Object.assign({}, newClient);
		
		dispatch(
			postClient(client, accessToken)
		).then((postedClient) => {
			
			if(postedClient){
				
				dispatch(
					addNotification({
						title		: "Created",
						text		: "The client was successfully created",
						icon		: "check_circle",
						hideDelay	: 5000,
						color		: COLOR_SUCCESS,
					})
				);
				
				dispatch(
					push('/dashboard/client/' + postedClient._id + "/")
				);
				
				dispatch(
					clearNewClient()
				);
				
			}
			
		});
	}
	
	handleOnDeleteClient(e){
		e.preventDefault();
		e.stopPropagation();
		
		//TODO: confirmation window
		
		const {dispatch, clients, accessToken, params: {clientId} } = this.props;
		
		let client = Object.assign({}, clients.filter((client) => {
			return client._id === clientId;
		})[0]);
		
		dispatch(
			deleteClient(client, accessToken)
		).then((success) => {
			if(success){
				
				dispatch(
					addNotification({
						title		: "Deleted",
						text		: "The client was successfully deleted",
						icon		: "check_circle",
						color		: COLOR_SUCCESS,
						
						actions		: [{
							text: "Undo",
							color: COLOR_INFO,
							action: (e, notification) => {
								
								dispatch(
									postClient(client, accessToken)
								).then((postedClient) => {
									
									if(postedClient){
										dispatch(
											push('/dashboard/client/' + postedClient._id + "/")
										);
									}
									
									notification.hide();
									
								});
								
							}	
						}]
					})
				);
				
				dispatch(
					push('/dashboard/clients/')
				);
			}
		});
	}
	
	render(){
		
		const {newClient, clients, params: {clientId}, users, dispatch} = this.props;
		
		let client;
		
		if(clientId === "new"){
			
			client = {};
			
		}else{
			
			let tmp = clients.filter((client) => {
				return client._id === clientId;
			});
			
			if(tmp.length === 1){
				client = tmp[0];
			}else{
				client = null;
			}
		}
		
		if(!client){return null;}
		
		let creator = users.filter((user) => {
			return user._id === client.userId;
		})[0];
		
		let userIdInput = (id, value="", handleOnChange) => {
			
			return <div className="input-group">
				<div className="input-group-addon no-padding clickable" onClick={()=>{dispatch(push("/dashboard/user/" + creator._id + "/"))}}>
					<img className="img-thumbnail" src={creator ? creator.profilePictureUrl : ''} width="50" height="50" />
				</div>
				<input
					id={id}
					className="form-control"
					type="text"
					onChange={(event) => {handleOnChange(event.target.id, event.target.value)}}
					value={value}
				/>
			</div>;
		};
		
		return (
			<div className="client">
			
				<ul className="list-inline list-navigation">
					{clientId !== "new" &&
						<li className="list-inline-item">
							<RefreshButton date={client.lastUpdated} loading={client.isFetching} refreshHandler={this.handleRefreshClick} />
						</li>
					}
					{clientId === "new" &&
						<li className="list-inline-item hint-bottom-middle hint-anim" data-hint="Create client">
							<a className="" href="#" onClick={this.handleOnAddNewClient}>
								<i className="material-icons bottom">add_circle</i>
							</a>
						</li>
					}
					{clientId !== "new" && clientId !== CLIENT_ID &&
						<li className="list-inline-item hint-bottom-middle hint-anim" data-hint="Delete client">
							<a className="" href="#" onClick={this.handleOnDeleteClient}>
								<i className="material-icons bottom">delete</i>
							</a>
						</li>
					}
					{clientId === CLIENT_ID &&
						<li className="list-inline-item hint-bottom-middle hint-anim" data-hint="This is the dashboard client, be careful.">
							<i className="material-icons bottom">warning</i>
						</li>
					}
				</ul>
				
				
				<hr/>
				
				<section>
					<h2>Client form</h2>
					
					<form className="profile">
						<FormGroups
							object={clientId === "new" ? newClient : client}
							keyPaths={[
								[
									{keyPath: "_id",			label: "Client Id", inputDisabled: true},
									{keyPath: "trusted",		label: "Trusted", input: checkboxGenerator()},
								],
								[
									{keyPath: "name",			label: "Name"},
									{keyPath: "redirectUris",	label: "Redirect URIs", input: arrayGenerator([], true, "Add new redirect uri")}
								],
								[
									{keyPath: "userId",			label: "Owner Id", input: userIdInput},
								]
							]}
							handleOnChange={this.handleOnChange}
						/>
						
					</form>
				</section>
				
				<section className="json-tree">
					<h2>Raw JSON</h2>
					<JSONTree
						data={clientId === "new" ? newClient : client}
						theme={JSONTreeTheme}
						invertTheme={false}
						hideRoot={true}
						sortObjectKeys={true}
					/>
				</section>
			</div>
		);
	}
};

const mapStateToProps = (state) => {
	return {
		accessToken	: state.app.authentication.accessToken.token,
		newClient	: state.app.newClient,
		clients		: state.app.clients,
		users		: state.app.users
	};
}

export default connect(mapStateToProps)(Client);