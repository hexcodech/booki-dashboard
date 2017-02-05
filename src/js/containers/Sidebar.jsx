import React				from 'react';
import {connect}			from 'react-redux';

import SidebarElement		from '../components/SidebarElement.jsx';

const Sidebar = ({children, name, profilePictureUrl}) => {
	
	let width	= window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	let height	= window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	
	let bgStyles = {
		background: 'linear-gradient(rgba(255, 173, 57, 1), rgba(255, 173, 57, 0.45)),' + 
		'url(https://source.unsplash.com/random/' + Math.round(width/3) + 'x' + height + ')',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center center',
		backgroundSize: 'cover'
	};
	
	return (
		<aside className="sidebar bg-primary" style={bgStyles}>
			<figure className="profile-picture">
				<img src={profilePictureUrl} className="mx-auto d-block" height="100" width="100" />
				<p className="text-center user-name">
					{name.display}
				</p>
			</figure>
			<ul className="list-group">
				<SidebarElement text="Dashboard" icon="dashboard" url="/dashboard/" />
				<SidebarElement text="Users" icon="supervisor_account" url="/dashboard/users/" />
				<SidebarElement text="OAuthClients" icon="business" url="/dashboard/oauth-clients/" />
			</ul>
		</aside>
	);
};

const mapStateToProps = (state) => {
	return {
		name				: state.app.authentication.user.name,
		profilePictureUrl	: state.app.authentication.user.profilePictureUrl
	};
};

export default connect(mapStateToProps)(Sidebar);