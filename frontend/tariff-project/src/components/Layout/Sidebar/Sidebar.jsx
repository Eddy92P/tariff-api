import React, { Fragment, useContext } from 'react';
import { useState } from 'react';

import SubMenu from './SubMenu';
import AuthContext from '../../../store/auth-context';

import classes from './Sidebar.module.css';

import * as BiIcons from 'react-icons/bi';

import { options } from './Options';

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  const authContext = useContext(AuthContext);
  return (
    <Fragment>
      <div
        style={{ width: sidebar ? '16rem' : '6rem' }}
        className={classes.sidebarNav}
      >
        <span className={classes.displayIcon} onClick={showSidebar}>
          {sidebar ? (
            <BiIcons.BiLeftArrowAlt
              size={22}
              style={{ paddingBottom: '3px' }}
            />
          ) : (
            <BiIcons.BiRightArrowAlt
              size={22}
              style={{ paddingBottom: '3px' }}
            />
          )}
        </span>
        <ul className={classes.listWrapper}>
          {options.map((item, index) => {
            return <SubMenu key={index} item={item} sidebarOpen={sidebar} />;
          })}
        </ul>
      </div>
    </Fragment>
  );
};

export default Sidebar;
