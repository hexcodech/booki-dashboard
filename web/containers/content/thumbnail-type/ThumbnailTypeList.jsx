import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { push } from "react-router-redux";

import MdAdd from "react-icons/lib/md/add";

import {
	invalidateThumbnailTypes,
	fetchThumbnailTypesIfNeeded
} from "core/actions/thumbnail-type";

import { Table, Tr, Td } from "reactable";
import Card from "web/components/layout/Card";
import Actions from "web/components/layout/Actions";
import RefreshButton from "web/components/RefreshButton";

class ThumbnailTypeList extends React.Component {
	componentDidMount = () => {
		const { dispatch, accessToken } = this.props;

		dispatch(fetchThumbnailTypesIfNeeded(accessToken));
	};

	handleRefreshClick = e => {
		e.preventDefault();

		const { dispatch, accessToken } = this.props;

		dispatch(invalidateThumbnailTypes());
		dispatch(fetchThumbnailTypesIfNeeded(accessToken));
	};

	handleThumbnailTypeRowClick = e => {
		this.props.dispatch(
			push(
				"/thumbnail-type/" +
					e.currentTarget.getAttribute("data-thumbnail-type-id") +
					"/"
			)
		);
	};

	render = () => {
		const { thumbnailTypes } = this.props;

		return (
			<div className="thumbnailType-list">
				<Actions>
					<li
						className="hint-bottom-middle hint-anim"
						data-hint="Refresh the thumbnailType list."
					>
						<RefreshButton refreshHandler={this.handleRefreshClick} />
					</li>
					<li
						className="hint-bottom-middle hint-anim"
						data-hint="Add a new thumbnailType."
					>
						<Link to={"/thumbnail-type/new/"}>
							<MdAdd />
						</Link>
					</li>
				</Actions>

				<Card>
					<Table
						itemsPerPage={50}
						sortable={true}
						defaultSort={{ column: "ID", direction: "asc" }}
						filterable={["Name"]}
					>
						{thumbnailTypes.map((thumbnailType, index) => {
							return (
								<Tr
									key={index}
									onClick={this.handleThumbnailTypeRowClick}
									data-thumbnail-type-id={thumbnailType.id}
									data={{
										ID: thumbnailType.id,
										Name: thumbnailType.name,
										Width: thumbnailType.width,
										Height: thumbnailType.height
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
		thumbnailTypes: state.app.thumbnailTypes
	};
};

export default connect(mapStateToProps)(ThumbnailTypeList);
