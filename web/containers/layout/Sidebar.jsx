import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";

import MdDashboard from "react-icons/md/dashboard";
import MdSupervisorAccount from "react-icons/md/supervisor-account";
import MdBusiness from "react-icons/md/business";
import MdNaturePeople from "react-icons/md/nature-people";
import MdCheckCircle from "react-icons/md/check-circle";
import MdBook from "react-icons/md/book";
import MdList from "react-icons/md/list";
import MdImage from "react-icons/md/image";
import MdLocalOffer from "react-icons/md/local-offer";

import { API_URL } from "config.json";

import SidebarListElement from "web/components/sidebar/SidebarListElement";

import CSSModules from "react-css-modules";
import styles from "./Sidebar.scss";

const Sidebar = ({ user, pathname, dispatch }) => {
	let width =
		window.innerWidth ||
		document.documentElement.clientWidth ||
		document.body.clientWidth;

	let height =
		window.innerHeight ||
		document.documentElement.clientHeight ||
		document.body.clientHeight;

	let bgStyles = {
		background:
			"linear-gradient(" +
				"rgba(255, 173, 57, 1), rgba(255, 173, 57, 0.45)" +
				"), url(" +
				"https://source.unsplash.com/random/" +
				Math.round(width / 3) +
				"x" +
				height +
				"/weekly)"
	};

	return (
		<aside styleName="sidebar" style={bgStyles}>
			<figure
				styleName="profile-picture"
				onClick={() => {
					dispatch(push("/user/" + user.id + "/"));
				}}
			>

				<img
					src={
						API_URL +
						user.thumbnails.filter(thumbnail => {
							return thumbnail.name === "profile-picture-large";
						})[0].url
					}
					height="100"
					width="100"
				/>
				<p styleName="user-name">
					{user.nameDisplay}
				</p>
			</figure>

			<ul styleName="link-list">
				<SidebarListElement
					text="Dashboard"
					icon={<MdDashboard />}
					url="/dashboard/"
					match="/dashboard/"
					pathname={pathname}
				/>
				<SidebarListElement
					text="Users"
					icon={<MdSupervisorAccount />}
					url="/user/list"
					match="/user/"
					pathname={pathname}
				/>
				<SidebarListElement
					text="OAuthClients"
					icon={<MdBusiness />}
					url="/client/list"
					match="/client/"
					pathname={pathname}
				/>
				<SidebarListElement
					text="People"
					icon={<MdNaturePeople />}
					url="/person/list"
					match="/person/"
					pathname={pathname}
				/>
				<SidebarListElement
					text="Conditions"
					icon={<MdCheckCircle />}
					url="/condition/list"
					match="/condition/"
					pathname={pathname}
				/>
				<SidebarListElement
					text="Books"
					icon={<MdBook />}
					url="/book/list"
					match="/book/"
					pathname={pathname}
				/>
				<SidebarListElement
					text="Thumbnail types"
					icon={<MdList />}
					url="/thumbnail-type/list"
					match="/thumbnail-type/"
					pathname={pathname}
				/>
				<SidebarListElement
					text="Images"
					icon={<MdImage />}
					url="/image/list"
					match="/image/"
					pathname={pathname}
				/>
				<SidebarListElement
					text="Offers"
					icon={<MdLocalOffer />}
					url="/offer/list"
					match="/offer/"
					pathname={pathname}
				/>
			</ul>
		</aside>
	);
};

const mapStateToProps = state => {
	return {
		user: state.app.authentication.user,
		pathname: state.router.location.pathname
	};
};

export default connect(mapStateToProps)(CSSModules(Sidebar, styles));
