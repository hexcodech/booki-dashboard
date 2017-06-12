import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { push } from "react-router-redux";

import { invalidateClients, fetchClientsIfNeeded } from "core/actions/client";

import { Table, Tr, Td } from "reactable";
import Card from "web/components/layout/Card";
import Actions from "web/components/layout/Actions";
import RefreshButton from "web/components/RefreshButton";

class ClientList extends React.Component {
	componentDidMount = () => {
		const { dispatch, accessToken } = this.props;

		dispatch(fetchClientsIfNeeded(accessToken));
	};

	handleRefreshClick = e => {
		e.preventDefault();

		const { dispatch, accessToken } = this.props;

		dispatch(invalidateClients());
		dispatch(fetchClientsIfNeeded(accessToken));
	};

	handleClientRowClick = e => {
		this.props.dispatch(
			push("/client/" + e.currentTarget.getAttribute("data-client-id") + "/")
		);
	};

	render = () => {
		const { clients } = this.props;

		return (
			<div className="client-list">
				<Actions>
					<li
						className="hint-bottom-middle hint-anim"
						data-hint="Refresh the client list."
					>
						<RefreshButton refreshHandler={this.handleRefreshClick} />
					</li>
					<li
						className="hint-bottom-middle hint-anim"
						data-hint="Add a new client."
					>
						<Link to={"/client/new/"}>
							<i className="material-icons">add</i>
						</Link>
					</li>
				</Actions>

				<Card>
					<Table
						itemsPerPage={50}
						sortable={true}
						defaultSort={{ column: "ID", direction: "asc" }}
						filterable={["Name", "Trusted"]}
					>
						{clients.map((client, index) => {
							return (
								<Tr
									key={index}
									onClick={this.handleClientRowClick}
									data-client-id={client.id}
								>
									<Td column="ID">
										{client.id}
									</Td>
									<Td column="Name">
										{client.name}
									</Td>
									<Td
										column="Trusted"
										value={client.trusted ? "trusted" : "untrusted"}
									>
										<span
											className="hint-right-middle hint-anim"
											data-hint={client.trusted ? "Trusted" : "Not trusted"}
										>
											{client.trusted
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
		clients: state.app.clients
	};
};

export default connect(mapStateToProps)(ClientList);
