import React
       from 'react';
import {connect}
       from 'react-redux';
import {push}
       from 'react-router-redux';
import set
       from 'lodash/set';
import bindAll
       from 'lodash/bindAll';
import JSONTree
       from 'react-json-tree';

import {API_URL}
       from 'config.json';

import {JSONTreeTheme, COLOR_SUCCESS, COLOR_FAILURE, COLOR_INFO}
       from 'core/constants/color';
import {
	invalidateBooks, clearNewBook, updateNewBook, fetchBooksIfNeeded,
	putBook, postBook, deleteBook, lookUpBooks
}      from 'core/actions/book';
import {fetchUsersIfNeeded}
       from 'core/actions/user';
import {addNotification}
       from 'core/actions/notification';


import {arrayInput, selectInput, textAreaInput}
       from 'web/utilities/input-types';

import RefreshButton
       from 'web/components/RefreshButton';
import {Table}
       from 'web/components/layout/Table';
import Actions
       from 'web/components/layout/Actions';
import FormGroups
       from 'web/components/form/FormGroups';

import Card
      from 'web/components/layout/Card';


import BookOptionComponent
       from 'web/components/form/input/select/BookOptionComponent';
import BookValueComponent
       from 'web/components/form/input/select/BookValueComponent';

class Book extends React.Component{

	constructor(props){
		super(props);

		bindAll(this, [
			'componentDidMount', 	'handleRefreshClick', 	'handleOnChange',
			'handleOnAddNewBook', 	'handleOnDeleteBook',	'onBookSelectInput',
			'onBookSelectChange'
		]);
	}

	componentDidMount() {
		const {dispatch, accessToken} = this.props;

		dispatch(fetchBooksIfNeeded(accessToken));
		dispatch(fetchUsersIfNeeded(accessToken));
	}

	handleRefreshClick(e) {
		e.preventDefault();

		const {dispatch, accessToken} = this.props;

		dispatch(invalidateBooks());
		dispatch(fetchBooksIfNeeded(accessToken));
	}

	handleOnChange(id, value){
		const {
			dispatch, accessToken, newBook, books, match: {params: {id: bookId}}
		} = this.props;

		let book;

		if(bookId === 'new'){

			book = Object.assign({}, newBook);

			if(set(book, id, value)){
				dispatch(
					updateNewBook(book)
				);
			}

		}else{

			book = Object.assign({}, books.filter((book) => {
				return book.id == bookId;
			})[0]);

			if(set(book, id, value)){
				dispatch(
					putBook(book, accessToken)
				);
			}

		}
	}

	handleOnAddNewBook(e){
		e.preventDefault();
		e.stopPropagation();

		const {dispatch, accessToken, newBook} = this.props;
		const book = Object.assign({}, newBook);

		dispatch(
			postBook(book, accessToken)
		).then((postedBook) => {

			if(postedBook){

				dispatch(
					addNotification({
						title		: 'Created',
						text		: 'The book was successfully created',
						hideDelay	: 5000,
						icon		: 'check_circle',
						color		: COLOR_SUCCESS,
					})
				);

				dispatch(
					push('/book/' + postedBook.id + '/')
				);

				dispatch(
					clearNewBook()
				);

			}

		});
	}

	handleOnDeleteBook(e){
		e.preventDefault();
		e.stopPropagation();

		const {
			dispatch, books, accessToken, match: {params: {id: bookId}}
		} = this.props;

		let book = Object.assign({}, books.filter((book) => {
			return book.id == bookId;
		})[0]);

		dispatch(
			deleteBook(book, accessToken)
		).then((success) => {
			if(success){

				dispatch(
					addNotification({
						title		: 'Deleted',
						text		: 'The book was successfully deleted',
						icon		: 'check_circle',
						color		: COLOR_SUCCESS,

						actions		: [{
							text: 'Undo',
							color: COLOR_INFO,
							action: (e, notification) => {

								dispatch(
									postBook(book, accessToken)
								).then((postedBook) => {

									if(postedBook){
										dispatch(
											push('/book/' + postedBook.id + '/')
										);
									}

									notification.hide();

								});

							}
						}]
					})
				);

				dispatch(
					push('/book/list')
				);
			}
		});
	}

	onBookSelectInput(isbn, callback){
		const {dispatch, accessToken} = this.props;

		isbn = isbn.replace(/[A-z\-\s]/g, '');

		if(isbn.length === 13){
			dispatch(
				lookUpBooks('isbn', isbn, accessToken)
			).then((books) => {

				callback(null, {
					options: books.map((book)=>{
						return {value: book.isbn13, label: book.isbn13}
					}),
					complete: false
				});
			});
		}else{
			callback(null, {options: [], complete: false});
		}
	}

	onBookSelectChange(isbn){
		//triggered when a lookedup book was selected
		const book = this.props.lookedUpBooks.filter((book) => {
			return book.isbn13 === isbn;
		})[0];

		if(book){
			this.props.dispatch(
				updateNewBook(book)
			);
		}
	}

	render(){

		const {
			newBook, books, users, dispatch, match: {params: {id: bookId}}, errors
		} = this.props;

		let book;

		if(bookId === 'new'){

			book = newBook;

		}else{

			book = books.filter((book) => {
				return book.id === bookId;
			})[0];

		}

		if(!book){return null;}

		let creator = users.filter((user) => {
			return user.id === book.createdBy;
		})[0];


		const userIdInput = (id, value='', handleOnChange) => {

			return (<div className='input-group'>
				<div
					className='input-group-addon'
					onClick={() => {
						dispatch(push('/user/' + creator.id + '/'))}
					}
    >
					<img
						src={creator ? creator.profilePictureUrl : ''}
						width='50'
						height='50'
     />
				</div>
				<input
					id={id}
					className='form-control'
					type='text'
					onChange={(event) => {
						handleOnChange(event.target.id, event.target.value)
					}}
					value={value}
				/>

			</div>);
		};

		return (
			<div className='book'>

				<Actions>
					{bookId !== 'new' &&
            <li>
              <RefreshButton
								date={book.lastUpdated}
								loading={book.isFetching}
								refreshHandler={this.handleRefreshClick}
              />
						</li>
					}
					{bookId === 'new' &&
            <li
							className='hint-bottom-middle hint-anim'
							data-hint='Create book'
            >
							<a href='#' onClick={this.handleOnAddNewBook}>
								<i className='material-icons'>add_circle</i>
							</a>
						</li>
					}
					{bookId !== 'new' &&
            <li
							className='hint-bottom-middle hint-anim'
							data-hint='Delete book'
            >
							<a href='#' onClick={this.handleOnDeleteBook}>
								<i className='material-icons'>delete</i>
							</a>
						</li>
					}
				</Actions>

				<Card>
					<h2>Book form</h2>

					<form className='profile'>
						<FormGroups
							object={book}

              errors={errors.book}

							keyPaths={[
								[
								{keyPath: 'id', label: 'Book Id', inputDisabled: true},
								{
									keyPath: 'isbn13',
									label: 'ISBN 13',
									inputType: selectInput({
										async: true,
										creatable: true,
										loadOptions: this.onBookSelectInput,
										searchPromptText: 'DOSing book apis...',
										minimumInput: 13,
										autoload: false,
										valueComponent: BookValueComponent,
										optionComponent: BookOptionComponent,

										options: (
											book.isbn13 ?
											[{value: book.isbn13, label: book.isbn13}] : undefined
										),
										value: book.isbn13,

										isValidNewOption: (label) => {
											return (label.label &&
												label.label.replace(/[A-z\-\s]/g, '').length === 13);
										},
									}, this.onBookSelectChange)
								},
								],
								[
								{keyPath: 'title', label: 'Title'},
								{keyPath: 'subtitle', label: 'Subtitle'}
								],
								[
								{keyPath: 'language', label: 'Language'},
								{
									keyPath: 'authors',
									label: 'Authors',
									inputType: arrayInput([], true, 'Add new author')
								}
								],
								[
								{keyPath: 'publisher', label: 'Publisher'},
								{keyPath: 'publicationDate', label: 'Publication Date'},
								],
								[
								{keyPath: 'pageCount', label: 'Number of pages'},
								{
                  keyPath: 'createdBy',
                  label: 'Created by',
                  inputType: userIdInput
                },
								],
								[
								{
									keyPath: 'description',
									label: 'Description',
									inputType: textAreaInput('', 'Describe the book', 4, 50)
								},
								]
							]}
							handleOnChange={this.handleOnChange}
      />

					</form>
				</Card>

				<Card>
					<h2>Raw JSON</h2>
					<JSONTree
						data={book}
						theme={JSONTreeTheme}
						invertTheme={false}
						hideRoot={true}
						//sortObjectKeys={true}
					/>
				</Card>
			</div>
		);
	}
};

const mapStateToProps = (state) => {
	return {
		accessToken   : state.app.authentication.accessToken.token,
		newBook       : state.app.newBook,
		books         : state.app.books,
		lookedUpBooks : state.app.lookedUpBooks,
		users			    : state.app.users,
    errors        : state.app.validation
	};
}

export default connect(mapStateToProps)(Book);
