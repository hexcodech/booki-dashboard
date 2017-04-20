import React
       from 'react';
import {connect}
       from 'react-redux';

import CSSModules
       from 'react-css-modules';
import styles
       from './BookComponent.scss';

const BookValueComponent = ({value: book}) => {
  return (
    <div styleName='book-value'>
      <img src={book.thumbnail} width='38' height='57'/>
      <span styleName='description'>
        <span styleName='title'>{book.title}</span>
      </span>
    </div>
  );
};

const mapStateToProps = (state) => {
	return {
		lookedUpBooks	: state.app.lookedUpBooks,
	};
};

export default CSSModules(BookValueComponent, styles);
