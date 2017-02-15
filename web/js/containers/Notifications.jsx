import React		from 'react';
import {connect}	from 'react-redux';
import TimeAgo		from 'react-timeago';

import Notification	from 'components/notifications/Notification.jsx';

import {addNotification}
					from "actions/NotificationActions.js";

const onMouseEnter = (color) => {
	return (e) => {
		e.target.setAttribute("style", "color: " + color);
	};
}

const onMouseLeave = (e) => {
	e.target.removeAttribute("style");
}

const onMouseClick = (action, notification) => {
	return (e) => {
		action.action(e, notification);
	};
}

const Notifications = ({notifications, dispatch}) => {
	
	return (
		<div className="notifications">
			{notifications.sort((a, b) => {
				return b.timestamp - a.timestamp
			}).map((notification, index) => {
				
				return ;
			})}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		notifications	: state.app.notifications
	};
}

export default connect(mapStateToProps)(Notifications);