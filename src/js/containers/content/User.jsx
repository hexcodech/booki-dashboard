import React				from 'react';

import {connect}			from 'react-redux';
import {push}				from 'react-router-redux';
import JSONTree				from 'react-json-tree';

import RefreshButton		from '../../components/RefreshButton.jsx';
import FormGroups			from '../../components/FormGroups.jsx';

import FlagOptionComponent	from '../../components/FlagOptionComponent.jsx';
import FlagValueComponent	from '../../components/FlagValueComponent.jsx';


import Utilities			from '../../Utilities.js';
import {selectGenerator, arrayGenerator}
							from '../../FieldGenerators.js';


import {JSONTreeTheme, PERMISSIONS, LANGUAGES, COLOR_SUCCESS, COLOR_FAILURE, COLOR_INFO}
							from '../../Constants.js';

import {invalidateUsers, clearNewUser, updateNewUser, fetchUsersIfNeeded, putUser, postUser, deleteUser}
							from '../../actions/UserActions.js';
							
import {addNotification}
							from '../../actions/NotificationActions.js';
							
import {fetchClientsIfNeeded}
							from '../../actions/ClientActions.js';

class User extends React.Component{
	
	constructor(props){
		super(props);
		
		Utilities.bindAll(this, [
			"componentDidMount", 	"handleRefreshClick", 	"handleOnChange",
			"handleOnAddNewUser", 	"handleOnDeleteUser",	"onClientRowClick"
		]);
	}
	
	componentDidMount() {
		const {dispatch, accessToken} = this.props;
		
		dispatch(fetchUsersIfNeeded(accessToken));
		dispatch(fetchClientsIfNeeded(accessToken));
	}
	
	handleRefreshClick(e) {
		e.preventDefault();
		
		const {dispatch, accessToken} = this.props;
		
		dispatch(invalidateUsers());
		dispatch(fetchUsersIfNeeded(accessToken));
	}
	
	handleOnChange(id, value){
		const {dispatch, accessToken, newUser, users, params: {userId} } = this.props;
		
		let user;
		
		if(userId === "new"){
			
			user = Object.assign({}, newUser);
			
			if(Utilities.updatePropertyByString(user, id, value)){
				dispatch(
					updateNewUser(user)
				);
			}
			
		}else{
			
			user = Object.assign({}, users.filter((user) => {
				return user._id === userId;
			})[0]);
			
			if(Utilities.updatePropertyByString(user, id, value)){
				dispatch(
					putUser(user, accessToken)
				);
			}
			
		}
	}
	
	handleOnAddNewUser(e){
		e.preventDefault();
		e.stopPropagation();
		
		const {dispatch, accessToken, newUser} = this.props;
		const user = Object.assign({}, newUser);
		
		dispatch(
			postUser(user, accessToken)
		).then((postedUser) => {
			
			if(postedUser){
				
				dispatch(
					addNotification({
						title		: "Created",
						text		: "The user was successfully created",
						icon		: "check_circle",
						hideDelay	: 5000,
						color		: COLOR_SUCCESS,
					})
				);
				
				dispatch(
					push('/dashboard/user/' + postedUser._id + "/")
				);
				
				dispatch(
					clearNewUser()
				);
				
			}
			
		});
	}
	
	handleOnDeleteUser(e){
		e.preventDefault();
		e.stopPropagation();
		
		//TODO: confirmation window
		
		const {dispatch, users, accessToken, params: {userId} } = this.props;
		
		let user = Object.assign({}, users.filter((user) => {
			return user._id === userId;
		})[0]);
		
		dispatch(
			deleteUser(user, accessToken)
		).then((success) => {
			if(success){
				
				dispatch(
					addNotification({
						title		: "Deleted",
						text		: "The user was successfully deleted",
						icon		: "check_circle",
						/*hideDelay	: 10000,*/
						color		: COLOR_SUCCESS,
						
						actions		: [{
							text: "Undo",
							color: COLOR_INFO,
							action: (e, notification) => {
								
								dispatch(
									postUser(user, accessToken)
								).then((postedUser) => {
									
									if(postedUser){
										dispatch(
											push('/dashboard/user/' + postedUser._id + "/")
										);
									}
									
									notification.hide();
									
								});
								
							}	
						}]
					})
				);
				
				dispatch(
					push('/dashboard/users/')
				);
			}
		});
	}
	
	onClientRowClick(e){
		this.props.dispatch(
			push('/dashboard/client/' + e.currentTarget.getAttribute("data-client-id") + "/")
		);
	}
	
	render(){
		
		const {
			newUser, users, params: {userId}, currentUser,
			clients
		} = this.props;
		
		let user;
		
		if(userId === "new"){
			
			user = {};
			
		}else{
			
			let tmp = users.filter((user) => {
				return user._id === userId;
			});
			
			if(tmp.length === 1){
				user = tmp[0];
			}else{
				user = null;
			}
		}
		
		if(!user){return null;}
		
		let porfilePictureUrlInput = (id, value="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&s=512", handleOnChange) => {
			
			return <div className="input-group">
				<div className="input-group-addon no-padding">
					<img className="img-thumbnail" src={value} width="50" height="50" />
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
			<div className="user">
			
				<ul className="list-inline list-navigation">
					{userId !== "new" &&
						<li className="list-inline-item">
							<RefreshButton date={user.lastUpdated} loading={user.isFetching} refreshHandler={this.handleRefreshClick} />
						</li>
					}
					{userId === "new" &&
						<li className="list-inline-item hint-bottom-middle hint-anim" data-hint="Create user">
							<a className="" href="#" onClick={this.handleOnAddNewUser}>
								<i className="material-icons bottom">person_add</i>
							</a>
						</li>
					}
					{userId !== "new" && userId !== currentUser._id &&
						<li className="list-inline-item hint-bottom-middle hint-anim" data-hint="Delete user">
							<a className="" href="#" onClick={this.handleOnDeleteUser}>
								<i className="material-icons bottom">delete</i>
							</a>
						</li>
					}
					{userId === currentUser._id &&
						<li className="list-inline-item hint-bottom-middle hint-anim" data-hint="This is your account, be careful.">
							<i className="material-icons bottom">account_circle</i>
						</li>
					}
				</ul>
				
				
				<hr/>
				
				<section>
					<h2>User form</h2>
					
					<form className="profile">
						<FormGroups
							object={userId === "new" ? newUser : user}
							keyPaths={[
								[
									{keyPath: "_id",	label: "User Id", inputDisabled: true},
									{keyPath: "locale", label: "Locale", input: selectGenerator(LANGUAGES, FlagOptionComponent, FlagValueComponent)}
								],
								[
									{keyPath: "name.first", label: "First name"},
									{keyPath: "name.last",	label: "Last name"}
								],
								[
									{keyPath: "name.display", label: "Display name"}
								],
								[
									{keyPath: "email.verified",		label: "Verified email"},
									{keyPath: "email.unverified",	label: "Unverified email"}
								],
								[
									{keyPath: "email.verificationCode", label: "Email verification code"}
								],
								[
									{keyPath: "password.resetCode", label: "Password reset code"}
								],
								[
									{keyPath: "profilePictureUrl",	label: "Profile picture url", input: porfilePictureUrlInput},
									{keyPath: "permissions",		label: "Permissions", input: arrayGenerator(PERMISSIONS, true, "Add new permission")}
								],
							]}
							handleOnChange={this.handleOnChange}
						/>
						
					</form>
				</section>
				
				<section>
					<h2>OAuth clients</h2>
					<table className="client-list styled clickable-rows">
						<thead>
							<tr><th>Name</th><th>Trusted</th></tr>
						</thead>
						<tbody>
							{clients.map((client) => {
								return <tr onClick={this.onClientRowClick} key={client._id} data-client-id={client._id}>
									<td>{client.name}</td>
									<td><span className="rel hint-right-middle hint-anim" data-hint={client.trusted ? "Trusted" : "Untrusted"}>{
											client.trusted ?
												<i className="material-icons bottom trusted">verified_user</i> :
												<i className="material-icons bottom untrusted">lock_open</i>
										}</span>
									</td>
								</tr>;
							})}
						</tbody>
					</table>
				</section>
				
				<section className="json-tree">
					<h2>Raw JSON</h2>
					<JSONTree
						data={userId === "new" ? newUser : user}
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
		newUser		: state.app.newUser,
		users		: state.app.users,
		clients		: state.app.clients,
		currentUser	: state.app.authentication.user
	};
}

export default connect(mapStateToProps)(User);