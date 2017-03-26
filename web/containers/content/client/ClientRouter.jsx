import React
       from 'react';

import {Route}
       from 'react-router-dom';

import Wrapper
      from 'web/containers/layout/Wrapper';
import Client
       from 'web/containers/content/client/Client';
import ClientList
       from 'web/containers/content/client/ClientList';

const ClientRouter = () => {
  return (
    <Wrapper>
      <Route path='/client/list' component={ClientList} />
      <Route path='/client/:id' component={Client} />
    </Wrapper>
  );
};


export default ClientRouter;
