import React				from 'react';
import {connect}			from 'react-redux';

import RefreshButton		from 'components/RefreshButton.jsx';

import Utilities			from 'utilities/Utilities.js';

import {invalidateUsers, fetchUsersIfNeeded}	
							from 'actions/UserActions.js';

class UserWidget extends React.Component{
	
	constructor(props){
		super(props);
		
		Utilities.bindAll(this, ["componentDidMount", "handleRefreshClick"]);
	}
	
	componentDidMount() {
		const {dispatch, accessToken} = this.props;
		
		//dispatch(fetchUsersIfNeeded(accessToken));
	}
	
	handleRefreshClick(e) {
		e.preventDefault();
		
		const {dispatch, accessToken} = this.props;
		
		dispatch(invalidateUsers());
		dispatch(fetchUsersIfNeeded(accessToken));
	}
	
	render(){
		const {users} = this.props;
		
		const newUsers = users.filter((user) => {
			return new Date(user.created).getTime() >= (Date.now() - 1000 * 60 * 60 * 24 * 7);
		});
		
		return (
			<div className="card dynamic">
				<div className="card-block">
					<p>{users.length} Users registered</p>
					<small>
						{newUsers.length} within the last week
					</small>
				</div>
				<div className="card-footer text-muted">
					<RefreshButton refreshHandler={this.handleRefreshClick} />
				</div>
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

export default connect(mapStateToProps)(UserWidget);