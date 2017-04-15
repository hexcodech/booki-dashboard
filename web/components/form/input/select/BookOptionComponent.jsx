import React
       from 'react';
import {connect}
       from 'react-redux';

import CSSModules
       from 'react-css-modules';
import styles
       from './BookComponent.scss';

const BookOptionComponent = ({
	lookedUpBooks = [], option, isFocused, onFocus, onSelect
}) => {

	const handleMouseDown = (event) => {
		event.preventDefault();
		event.stopPropagation();

		onSelect(option, event);
	},
	handleMouseEnter = (event) => {
		onFocus(option, event);
	},
	handleMouseMove = (event) => {
		if(isFocused){return;}
		onFocus(option, event);
	};

  let book = null;

  if(lookedUpBooks && lookedUpBooks.db && lookedUpBooks.external){
    book = [...lookedUpBooks.db, ...lookedUpBooks.external].filter((book) => {
  		return book.isbn13 === option.value;
  	})[0];
  }

	if(book){

		return (

      <div
				styleName='book-option'
				onMouseDown={handleMouseDown}
				onMouseEnter={handleMouseEnter}
				onMouseMove={handleMouseMove}
      >
				<img src={book.thumbnail} width='38' height='57'/>
        <span styleName='description'>
          <span styleName='title'>{book.title}</span>
          {' '}
          <span styleName='page-count'>({book.pageCount} S.)</span>
        </span>
			</div>
		);

	}else{

		return (

      <div
				className='book-select book-option'
				onMouseDown={handleMouseDown}
				onMouseEnter={handleMouseEnter}
				onMouseMove={handleMouseMove}
      >
        {option.label}
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
	CSSModules(BookOptionComponent, styles)
);
