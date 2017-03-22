import React
       from 'react';
import {connect}
       from 'react-redux';

import Bundle
       from 'web/components/Bundle';

import Wrapper
       from 'web/containers/layout/Wrapper';

import SpinnerWidget
       from 'web/containers/content/dashboard/widgets/SpinnerWidget';

import GeneralStats
       from 'bundle-loader?lazy!web/containers/content/dashboard/widgets/GeneralStats';
import MemoryStats
       from 'bundle-loader?lazy!web/containers/content/dashboard/widgets/MemoryStats';
import CpuStats
       from 'bundle-loader?lazy!web/containers/content/dashboard/widgets/CpuStats';
import UserStats
       from 'bundle-loader?lazy!web/containers/content/dashboard/widgets/UserStats';

import CSSModules
       from 'react-css-modules';
import styles
       from './Dashboard.scss';

const DashboardContent = ({children}) => {

	return (
    <Wrapper>
      <div styleName='dashboard'>
        <Bundle load={GeneralStats}>
          {(Comp) => Comp ? <Comp/> : <SpinnerWidget/>}
        </Bundle>
        <Bundle load={MemoryStats}>
          {(Comp) => Comp ? <Comp/> : <SpinnerWidget/>}
        </Bundle>
        <Bundle load={CpuStats}>
          {(Comp) => Comp ? <Comp/> : <SpinnerWidget/>}
        </Bundle>
        <Bundle load={UserStats}>
          {(Comp) => Comp ? <Comp/> : <SpinnerWidget/>}
        </Bundle>
      </div>
    </Wrapper>
  );
};

export default connect()(CSSModules(DashboardContent, styles));
