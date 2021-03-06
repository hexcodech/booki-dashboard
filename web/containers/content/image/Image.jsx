import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import set from "lodash/set";
import JSONTree from "react-json-tree";

import MdDelete from "react-icons/lib/md/delete";

import { API_URL } from "config.json";

import {
	JSONTreeTheme,
	COLOR_SUCCESS,
	COLOR_FAILURE,
	COLOR_INFO
} from "core/constants/color";

import {
	invalidateImages,
	fetchImagesIfNeeded,
	putImage,
	postImage,
	deleteImage
} from "core/actions/image";

import { fetchUsersIfNeeded } from "core/actions/user";
import { addNotification } from "core/actions/notification";

import Dropzone from "react-dropzone";
import { Table, Tr, Td } from "reactable";
import RefreshButton from "web/components/RefreshButton";
import Actions from "web/components/layout/Actions";
import FormGroups from "web/components/form/FormGroups";

import Card from "web/components/layout/Card";

class Image extends React.Component {
	componentDidMount = () => {
		const { dispatch, accessToken } = this.props;

		dispatch(fetchImagesIfNeeded(accessToken));
		dispatch(fetchUsersIfNeeded(accessToken));
	};

	handleRefreshClick = e => {
		e.preventDefault();

		const { dispatch, accessToken } = this.props;

		dispatch(invalidateImages());
		dispatch(fetchImagesIfNeeded(accessToken));
	};

	handleOnDeleteImage = e => {
		e.preventDefault();
		e.stopPropagation();

		const {
			dispatch,
			images,
			accessToken,
			match: { params: { id: imageId } }
		} = this.props;

		let image = Object.assign(
			{},
			images.filter(image => {
				return image.id == imageId;
			})[0]
		);

		dispatch(deleteImage(image, accessToken)).then(success => {
			if (success) {
				dispatch(
					addNotification({
						title: "Deleted",
						text: "The image was successfully deleted",
						color: COLOR_SUCCESS
					})
				);

				dispatch(push("/image/list"));
			}
		});
	};

	onDrop = (acceptedFiles, rejectedFiles) => {
		const { dispatch, accessToken } = this.props;

		let formData = new FormData();
		formData.append("image", acceptedFiles[0]);

		dispatch(postImage(formData, accessToken)).then(image => {
			dispatch(push("/image/" + image.id + "/"));
		});
	};

	render = () => {
		const {
			images,
			match: { params: { id: imageId } },
			users,
			dispatch,
			errors
		} = this.props;

		let image;

		if (imageId == "new") {
			image = {};
		} else {
			image = images.filter(image => {
				return image.id == imageId;
			})[0];
		}

		if (!image) {
			return null;
		}

		const imageSrcInput = (id, value = "", errors) => {
			return (
				<div className="input-group">
					<div className="input-group-addon">
						<img
							src={imageId !== "new" ? API_URL + image.url : ""}
							width="50"
							height="50"
						/>
					</div>
					<input
						id={id}
						className="form-control"
						type="text"
						disabled={true}
						value={value}
					/>
				</div>
			);
		};

		return (
			<div className="image">

				<Actions>
					{imageId !== "new" &&
						<li>
							<RefreshButton
								date={image.lastUpdated}
								loading={image.isFetching}
								refreshHandler={this.handleRefreshClick}
							/>
						</li>}
					{imageId !== "new" &&
						<li
							className="hint-bottom-middle hint-anim"
							data-hint="Delete image"
						>
							<a href="#" onClick={this.handleOnDeleteImage}>
								<MdDelete />
							</a>
						</li>}
				</Actions>

				<Card>
					<h2>Image form</h2>

					<form className="profile">
						<FormGroups
							object={image}
							errors={errors.image}
							keyPaths={[
								[
									{
										keyPath: "id",
										label: "Image Id",
										inputDisabled: true
									},
									{
										keyPath: "mimeType",
										label: "Mime Type",
										inputDisabled: true
									}
								],
								[
									{
										keyPath: "width",
										label: "Width",
										inputDisabled: true
									},
									{
										keyPath: "height",
										label: "Height",
										inputDisabled: true
									}
								],
								[
									{
										keyPath: "userId",
										label: "User Id",
										inputDisabled: true
									},
									{
										keyPath: "fileId",
										label: "File Id",
										inputDisabled: true
									}
								],
								[
									{
										keyPath: "url",
										label: "URL",
										inputType: imageSrcInput
									}
								]
							]}
							handleOnChange={() => {}}
						/>
						{imageId === "new" &&
							<Dropzone
								className="dropzone"
								activeClassName="dropzone-active"
								rejectClassName="dropzone-reject"
								onDrop={this.onDrop}
								preventDropOnDocument={true}
								maxSize={1024 * 1024 * 2}
								multiple={false}
								accept="image/*"
							>
								<div className="center">Drag the image file here</div>
							</Dropzone>}
					</form>
				</Card>

				{image.thumbnails &&
					<Card>
						<h2>Thumbnails</h2>
						<Table
							itemsPerPage={10}
							sortable={true}
							defaultSort={{ column: "ID", direction: "asc" }}
						>
							{image.thumbnails.map((thumbnail, index) => {
								return (
									<Tr
										key={index}
										data={{
											ID: thumbnail.id,
											URL: thumbnail.url,
											"Thumbnail type": thumbnail.name,
											Width: thumbnail.width,
											Height: thumbnail.height
										}}
									/>
								);
							})}
						</Table>
					</Card>}

				<Card>
					<h2>Raw JSON</h2>
					<JSONTree
						data={image}
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
		images: state.app.images,
		users: state.app.users,
		errors: state.app.validation
	};
};

export default connect(mapStateToProps)(Image);
