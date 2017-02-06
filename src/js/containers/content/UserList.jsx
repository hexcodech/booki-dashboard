import React				from 'react';

import {connect}			from 'react-redux';

import {Link}				from 'react-router';

import {push}				from 'react-router-redux';

import RefreshButton		from '../../components/RefreshButton.jsx';

import Utilities			from '../../Utilities.js';

import {invalidateUsers, fetchUsersIfNeeded}	
							from '../../actions/UserActions.js';

class UserList extends React.Component{
	
	constructor(props){
		super(props);
		
		Utilities.bindAll(this, ["componentDidMount", "handleRefreshClick", "handleUserRowClick"]);
	}
	
	componentDidMount() {
		const {dispatch, accessToken} = this.props;
		
		dispatch(fetchUsersIfNeeded(accessToken));
	}
	
	handleRefreshClick(e) {
		e.preventDefault();
		
		const {dispatch, accessToken} = this.props;
		
		dispatch(invalidateUsers());
		dispatch(fetchUsersIfNeeded(accessToken));
	}
	
	handleUserRowClick(e){
		this.props.dispatch(
			push('/dashboard/user/' + e.currentTarget.getAttribute("data-user-id") + "/")
		);
	}
	
	render(){
		
		const {users} = this.props;
		
		return (
			<div className="user-list">
				<ul className="list-inline list-navigation">
					<li className="list-inline-item hint-bottom-middle hint-anim" data-hint="Refresh the user list.">
						<RefreshButton refreshHandler={this.handleRefreshClick} />
					</li>
					<li className="list-inline-item hint-bottom-middle hint-anim" data-hint="Add a new user.">
						<Link to={"/dashboard/user/new/"} className="max-block">
							<i className="material-icons bottom">add</i>
						</Link>
					</li>
				</ul>
				
				<hr/>
				
				<table className="styled clickable-rows">
					<thead>
						<tr>
							<th>ID</th>
							<th>First name</th>
							<th>Last name</th>
							<th>Email</th>
							<th>Locale</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user, index) => {
							return <tr key={index} onClick={this.handleUserRowClick} data-user-id={user._id}>
								<td>{user._id}</td>
								<td>{user.name.first}</td>
								<td>{user.name.last}</td>
								<td>{user.email.verified}</td>
								<td>
									<span className="rel hint-right-middle hint-anim" data-hint={user.locale}>
										<img
											height="20"
											width="20"
											src={"/img/language-flags/" + user.locale + ".svg"}
										/>
									</span>
								</td>
							</tr>;
						})}
					</tbody>
				</table>
			</div>
		);
	}
};

const mapStateToProps = (state) => {
	return {
		accessToken	: state.app.authentication.accessToken.token,
		users		: state.app.users
	};
}

export default connect(mapStateToProps)(UserList);