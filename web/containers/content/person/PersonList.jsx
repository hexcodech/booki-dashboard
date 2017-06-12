import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { push } from "react-router-redux";

import { invalidatePeople, fetchPeopleIfNeeded } from "core/actions/person";

import { Table, Tr, Td } from "reactable";
import Card from "web/components/layout/Card";
import Actions from "web/components/layout/Actions";
import RefreshButton from "web/components/RefreshButton";

class PersonList extends React.Component {
	componentDidMount = () => {
		const { dispatch, accessToken } = this.props;

		dispatch(fetchPeopleIfNeeded(accessToken));
	};

	handleRefreshClick = e => {
		e.preventDefault();

		const { dispatch, accessToken } = this.props;

		dispatch(invalidatePeople());
		dispatch(fetchPeopleIfNeeded(accessToken));
	};

	handlePersonRowClick = e => {
		this.props.dispatch(
			push("/person/" + e.currentTarget.getAttribute("data-person-id") + "/")
		);
	};

	render = () => {
		const { people } = this.props;

		return (
			<div className="person-list">
				<Actions>
					<li
						className="hint-bottom-middle hint-anim"
						data-hint="Refresh the person list."
					>
						<RefreshButton refreshHandler={this.handleRefreshClick} />
					</li>
					<li
						className="hint-bottom-middle hint-anim"
						data-hint="Add a new person."
					>
						<Link to={"/person/new/"}>
							<i className="material-icons">add</i>
						</Link>
					</li>
				</Actions>

				<Card>
					<Table
						itemsPerPage={50}
						sortable={true}
						defaultSort={{ column: "ID", direction: "asc" }}
						filterable={["Name", "Verified"]}
					>
						{people.map((person, index) => {
							return (
								<Tr
									key={index}
									onClick={this.handlePersonRowClick}
									data-person-id={person.id}
								>
									<Td column="ID">
										{person.id}
									</Td>
									<Td column="Name">
										{((person.nameTitle ? person.nameTitle : "") +
											" " +
											(person.nameFirst ? person.nameFirst : "") +
											" " +
											(person.nameMiddle ? person.nameMiddle : "") +
											" " +
											(person.nameLast ? person.nameLast : "")).trim()}
									</Td>
									<Td
										column="Verified"
										value={person.verified ? "verified" : "unverified"}
									>
										<span
											className="hint-right-middle hint-anim"
											data-hint={person.verified ? "Verified" : "Unverified"}
										>
											{person.verified
												? <i className="material-icons">
														verified_user
													</i>
												: <i className="material-icons">
														lock_open
													</i>}
										</span>
									</Td>
								</Tr>
							);
						})}
					</Table>
				</Card>
			</div>
		);
	};
}

const mapStateToProps = state => {
	return {
		accessToken: state.app.authentication.accessToken.token,
		people: state.app.people
	};
};

export default connect(mapStateToProps)(PersonList);
