import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { push } from "react-router-redux";

import MdAdd from "react-icons/lib/md/add";

import {
	invalidateConditions,
	fetchConditionsIfNeeded
} from "core/actions/condition";

import { Table, Tr, Td } from "reactable";
import Card from "web/components/layout/Card";
import Actions from "web/components/layout/Actions";
import RefreshButton from "web/components/RefreshButton";

class ConditionList extends React.Component {
	componentDidMount = () => {
		const { dispatch, accessToken } = this.props;

		dispatch(fetchConditionsIfNeeded(accessToken));
	};

	handleRefreshClick = e => {
		e.preventDefault();

		const { dispatch, accessToken } = this.props;

		dispatch(invalidateConditions());
		dispatch(fetchConditionsIfNeeded(accessToken));
	};

	handleConditionRowClick = e => {
		this.props.dispatch(
			push(
				"/condition/" + e.currentTarget.getAttribute("data-condition-id") + "/"
			)
		);
	};

	render = () => {
		const { conditions } = this.props;

		return (
			<div className="condition-list">
				<Actions>
					<li
						className="hint-bottom-middle hint-anim"
						data-hint="Refresh the condition list."
					>
						<RefreshButton refreshHandler={this.handleRefreshClick} />
					</li>
					<li
						className="hint-bottom-middle hint-anim"
						data-hint="Add a new condition."
					>
						<Link to={"/condition/new/"}>
							<MdAdd />
						</Link>
					</li>
				</Actions>

				<Card
					itemsPerPage={50}
					sortable={true}
					defaultSort={{ column: "ID", direction: "asc" }}
					filterable={["Key"]}
				>
					<Table
						itemsPerPage={50}
						sortable={true}
						defaultSort={{ column: "ID", direction: "asc" }}
						filterable={["Key", "Price Factor"]}
					>
						{conditions.map((condition, index) => {
							return (
								<Tr
									key={index}
									onClick={this.handleConditionRowClick}
									data-condition-id={condition.id}
									className="clickable"
									data={{
										ID: condition.id,
										Key: condition.key,
										"Price Factor": condition.priceFactor
									}}
								/>
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
		conditions: state.app.conditions
	};
};

export default connect(mapStateToProps)(ConditionList);
