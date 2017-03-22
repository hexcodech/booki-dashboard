import React
       from 'react';
import {connect}
       from 'react-redux';
import {push}
       from 'react-router-redux';

import SidebarListElement
       from 'web/components/sidebar/SidebarListElement';

import CSSModules
       from 'react-css-modules';
import styles
       from './Sidebar.scss';

const Sidebar = ({user, dispatch}) => {

	let width	= window.innerWidth ||
	            document.documentElement.clientWidth ||
							document.body.clientWidth;

	let height	= window.innerHeight ||
	              document.documentElement.clientHeight ||
								document.body.clientHeight;

	let bgStyles = {
		background: 'linear-gradient(' +
			'rgba(255, 173, 57, 1), rgba(255, 173, 57, 0.45)' +
		'), url(' +
			'https://source.unsplash.com/random/' + Math.round(width/3)+'x'+height +
		')'
	};

	return (
		<aside styleName='sidebar' style={bgStyles}>
			<figure
				styleName='profile-picture'
				onClick={() => {
					dispatch(
						push('/user/' + user.id + '/')
					)
        }}>

				<img src={user.profilePictureUrl} height='100' width='100'/>
				<p styleName='user-name'>
					{user.nameDisplay}
				</p>
			</figure>

			<ul styleName='link-list'>
				<SidebarListElement
					text='Dashboard'
					icon='dashboard'
					url='/dashboard/'
    />
				<SidebarListElement
					text='Users'
					icon='supervisor_account'
					url='/users/'
    />
				<SidebarListElement
					text='OAuthClients'
					icon='business'
					url='/clients/'
    />
				<SidebarListElement
					text='Books'
					icon='book'
					url='/books/'
				/>
			</ul>
		</aside>
	);
};

const mapStateToProps = (state) => {
	return {
		user: state.app.authentication.user
	};
};

export default connect(mapStateToProps)(CSSModules(Sidebar, styles));
