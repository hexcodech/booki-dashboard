import React
       from 'react';
import {connect}
       from 'react-redux';

import CSSModules
       from 'react-css-modules';
import styles
       from './BookComponent.scss';

const BookValueComponent = ({lookedUpBooks = [], value = {}}) => {

  let book = null;

  if(lookedUpBooks && lookedUpBooks.db && lookedUpBooks.external){
    book = [...lookedUpBooks.db, ...lookedUpBooks.external].filter((book) => {
  		return book.isbn13 === value.value;
  	})[0];
  }

	if(book){
		return (
			<div styleName='book-value'>
				<img src={book.thumbnail} width='38' height='57'/>
        <span styleName='description'>
          <span styleName='title'>{book.title}</span>
        </span>
			</div>
		);
	}else{
		return (
			<div styleName='book-value'>
				{value.value}
			</div>
		);
	}


};

const mapStateToProps = (state) => {
	return {
		lookedUpBooks	: state.app.lookedUpBooks,
	};
};

export default connect(mapStateToProps)(
	CSSModules(BookValueComponent, styles)
);
