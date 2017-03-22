import React
       from 'react';

import CSSModules
       from 'react-css-modules';
import styles
       from './Table.scss';

const Table = ({children}) => {
  return (
    <table styleName='table'>
      {children}
    </table>
  );
};

const StyledTable = CSSModules(Table, styles);
export {StyledTable as Table};

const Seperator = (props) => {
  return (
    <tr styleName='seperator' {...props}>
      {props.children}
    </tr>
  );
};

const StyledSeperator = CSSModules(Seperator, styles);
export {StyledSeperator as Seperator};
