import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { push } from "react-router-redux";

import MdAdd from "react-icons/lib/md/add";

import { invalidateImages, fetchImagesIfNeeded } from "core/actions/image";

import { Table, Tr, Td } from "reactable";
import RefreshButton from "web/components/RefreshButton";
import Actions from "web/components/layout/Actions";
import Card from "web/components/layout/Card";

class ImageList extends React.Component {
	componentDidMount = () => {
		const { dispatch, accessToken } = this.props;

		dispatch(fetchImagesIfNeeded(accessToken));
	};

	handleRefreshClick = e => {
		e.preventDefault();

		const { dispatch, accessToken } = this.props;

		dispatch(invalidateImages());
		dispatch(fetchImagesIfNeeded(accessToken));
	};

	handleImageRowClick = e => {
		this.props.dispatch(
			push("/image/" + e.currentTarget.getAttribute("data-image-id") + "/")
		);
	};

	render = () => {
		const { images } = this.props;

		return (
			<div className="image-list">
				<Actions>
					<li
						className="hint-bottom-middle hint-anim"
						data-hint="Refresh the image list."
					>
						<RefreshButton refreshHandler={this.handleRefreshClick} />
					</li>
					<li
						className="hint-bottom-middle hint-anim"
						data-hint="Add a new image."
					>
						<Link to={"/image/new/"}>
							<MdAdd />
						</Link>
					</li>
				</Actions>

				<Card>
					<Table
						itemsPerPage={50}
						sortable={true}
						defaultSort={{ column: "ID", direction: "asc" }}
					>
						{images.map((image, index) => {
							return (
								<Tr
									key={index}
									onClick={this.handleImageRowClick}
									data-image-id={image.id}
									className="clickable"
									data={{ ID: image.id, URL: image.url }}
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
		images: state.app.images
	};
};

export default connect(mapStateToProps)(ImageList);
