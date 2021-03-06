import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import set from "lodash/set";
import debounce from "lodash/debounce";
import JSONTree from "react-json-tree";

import MdDelete from "react-icons/lib/md/delete";
import MdAddCircle from "react-icons/lib/md/add-circle";
import MdWarning from "react-icons/lib/md/warning";

import { CLIENT_ID } from "config.json";

import {
	JSONTreeTheme,
	COLOR_SUCCESS,
	COLOR_FAILURE,
	COLOR_INFO
} from "core/constants/color";

import {
	invalidateClients,
	clearNewClient,
	updateNewClient,
	fetchClientsIfNeeded,
	updateClient,
	putClient,
	postClient,
	deleteClient
} from "core/actions/client";

import { fetchUsersIfNeeded } from "core/actions/user";
import { addNotification } from "core/actions/notification";

import {
	selectInput,
	arrayInput,
	checkboxInput
} from "web/utilities/input-types";

import RefreshButton from "web/components/RefreshButton";
import Actions from "web/components/layout/Actions";
import FormGroups from "web/components/form/FormGroups";

import Card from "web/components/layout/Card";

class Client extends React.Component {
	componentDidMount = () => {
		const { dispatch, accessToken } = this.props;

		dispatch(fetchClientsIfNeeded(accessToken));
		dispatch(fetchUsersIfNeeded(accessToken));
	};

	handleRefreshClick = e => {
		e.preventDefault();

		const { dispatch, accessToken } = this.props;

		dispatch(invalidateClients());
		dispatch(fetchClientsIfNeeded(accessToken));
	};

	handleOnChange = (id, value) => {
		const {
			dispatch,
			accessToken,
			newClient,
			clients,
			match: { params: { id: clientId } }
		} = this.props;

		let client;

		if (clientId == "new") {
			client = Object.assign({}, newClient);

			if (set(client, id, value)) {
				dispatch(updateNewClient(client));
			}
		} else {
			client = Object.assign(
				{},
				clients.filter(client => {
					return client.id == clientId;
				})[0]
			);

			if (set(client, id, value)) {
				dispatch(updateClient(client, accessToken));
				this.debouncedPut(client, accessToken);
			}
		}
	};

	debouncedPut = debounce((client, accessToken) => {
		this.props.dispatch(putClient(client, accessToken));
	}, 300);

	handleOnAddNewClient = e => {
		e.preventDefault();
		e.stopPropagation();

		const { dispatch, accessToken, newClient } = this.props;
		const client = Object.assign({}, newClient);

		dispatch(postClient(client, accessToken)).then(postedClient => {
			if (postedClient) {
				dispatch(
					addNotification({
						title: "Created",
						text:
							"The client was successfully created. Now you should save the secret.",
						color: COLOR_SUCCESS
					})
				);

				dispatch(push("/client/" + postedClient.id + "/"));

				dispatch(clearNewClient());
			}
		});
	};

	handleOnDeleteClient = e => {
		e.preventDefault();
		e.stopPropagation();

		const {
			dispatch,
			clients,
			accessToken,
			match: { params: { id: clientId } }
		} = this.props;

		let client = Object.assign(
			{},
			clients.filter(client => {
				return client.id == clientId;
			})[0]
		);

		dispatch(deleteClient(client, accessToken)).then(success => {
			if (success) {
				dispatch(
					addNotification({
						title: "Deleted",
						text: "The client was successfully deleted",
						color: COLOR_SUCCESS,

						actions: [
							{
								text: "Undo",
								color: COLOR_INFO,
								action: (e, notification) => {
									dispatch(
										postClient(client, accessToken)
									).then(postedClient => {
										if (postedClient) {
											dispatch(push("/client/" + postedClient.id + "/"));
										}

										notification.hide();
									});
								}
							}
						]
					})
				);

				dispatch(push("/client/list"));
			}
		});
	};

	render = () => {
		const {
			newClient,
			clients,
			match: { params: { id: clientId } },
			users,
			dispatch,
			errors
		} = this.props;

		let client;

		if (clientId == "new") {
			client = newClient;
		} else {
			client = clients.filter(client => {
				return client.id == clientId;
			})[0];
		}

		if (!client) {
			return null;
		}

		return (
			<div className="client">

				<Actions>
					{clientId !== "new" &&
						<li>
							<RefreshButton
								date={client.lastUpdated}
								loading={client.isFetching}
								refreshHandler={this.handleRefreshClick}
							/>
						</li>}
					{clientId == "new" &&
						<li
							className="hint-bottom-middle hint-anim"
							data-hint="Create client"
						>
							<a href="#" onClick={this.handleOnAddNewClient}>
								<MdAddCircle />
							</a>
						</li>}
					{clientId !== "new" &&
						clientId !== CLIENT_ID &&
						<li
							className="hint-bottom-middle hint-anim"
							data-hint="Delete client"
						>
							<a href="#" onClick={this.handleOnDeleteClient}>
								<MdDelete />
							</a>
						</li>}
					{clientId == CLIENT_ID &&
						<li
							className="hint-bottom-middle hint-anim"
							data-hint="This is the dashboard client, be careful."
						>
							<MdWarning />
						</li>}
				</Actions>

				<Card>
					<h2>Client form</h2>

					<form className="profile">
						<FormGroups
							object={client}
							errors={errors.client}
							keyPaths={[
								[
									{
										keyPath: "id",
										label: "Client Id",
										inputDisabled: true
									},
									{
										keyPath: "trusted",
										label: "Trusted",
										inputType: checkboxInput(false)
									}
								],
								[
									{
										keyPath: "name",
										label: "Name"
									},
									{
										keyPath: "redirectUris",
										label: "Redirect URIs",
										inputType: arrayInput([], true, "Add new redirect uri")
									}
								],
								[
									{
										keyPath: "userId",
										label: "Owner Id",
										inputType: selectInput(
											{
												searchPromptText: "Searching for users...",
												options: users.map(user => {
													return {
														...user,
														value: user.id,
														label:
															user.nameDisplay +
																" (" +
																[
																	user.nameTitle,
																	user.nameFirst,
																	user.nameMiddle,
																	user.nameLast
																]
																	.join(" ")
																	.trim() +
																")"
													};
												}),
												value: client.userId
											},
											null,
											user => {
												return user && user.id ? user.id : "";
											}
										)
									}
								]
							]}
							handleOnChange={this.handleOnChange}
						/>

					</form>
				</Card>

				{client &&
					client.secret &&
					<Card>
						<div className="col-12 col-md-2">
							<label htmlFor="secret">Secret</label>
						</div>
						<div className="col-12 col-md-10">
							<input
								className="form-control"
								type="text"
								disabled="disabled"
								id="secret"
								value={client.secret}
							/>
						</div>
					</Card>}

				<Card>
					<h2>Raw JSON</h2>
					<JSONTree
						data={client}
						theme={JSONTreeTheme}
						invertTheme={false}
						hideRoot={true}
						//sortObjectKeys={true}
					/>
				</Card>
			</div>
		);
	};
}

const mapStateToProps = state => {
	return {
		accessToken: state.app.authentication.accessToken.token,
		newClient: state.app.newClient,
		clients: state.app.clients,
		users: state.app.users,
		errors: state.app.validation
	};
};

export default connect(mapStateToProps)(Client);
