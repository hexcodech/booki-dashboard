import React
       from 'react';

import {Route}
       from 'react-router-dom';

import Wrapper
      from 'web/containers/layout/Wrapper';
import User
       from 'web/containers/content/user/User';
import UserList
       from 'web/containers/content/user/UserList';

const UserRouter = () => {
  return (
    <Wrapper>
      <Route path='/users' component={UserList} />
      <Route path='/user/:id' component={User} />
    </Wrapper>
  );
};


export default UserRouter;
