import React		from 'react';
import {connect}	from 'react-redux';

import TimeAgo		from 'react-timeago';

import {addNotification}
					from "../actions/NotificationActions.js";

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
				
				return <div
					key={notification.uuid}
					className={"notification" + (notification.fadeIn ? " fade-in" : "") + (notification.fadeOut ? " fade-out" : "")}
					style={{borderTopColor: notification.color}}
				>
					<div className="row">
						<div className="col-2 icon">
							<i className="material-icons bottom v-center">{notification.icon}</i>
						</div>
						<div className="col-7">
							<h6>{notification.title}</h6>
							<p>
								{notification.text}
							</p>
							{
								notification.hideDelay &&
								<small>
									{"Will hide in "}
									<TimeAgo
										date={notification.timestamp + notification.hideDelay}
										formatter={(value, unit) => {
											return value + " " + unit + (value > 1 ? "s" : "");
										}}
									/>
								</small>
							}
						</div>
						<div className="col-3 actions">
							<div className={(notification.actions.length === 1 ? " v-center" : "")}>
								{notification.actions.map((action, index) => {
									return <button
										key={index}
										onMouseEnter={onMouseEnter(action.color)}
										onMouseLeave={onMouseLeave}
										onClick={onMouseClick(action, notification)}
									>
											{action.text}
									</button>;
								})}
							</div>
						</div>
					</div>
				</div>;
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