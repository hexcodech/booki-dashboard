import React
       from 'react';

import {Route}
       from 'react-router-dom';

import Wrapper
      from 'web/containers/layout/Wrapper';
import Book
       from 'web/containers/content/book/Book';
import BookList
       from 'web/containers/content/book/BookList';

const BookRouter = () => {
  return (
    <Wrapper>
      <Route path='/book/list' component={BookList} />
      <Route path='/book/:id' component={Book} />
    </Wrapper>
  );
};


export default BookRouter;
