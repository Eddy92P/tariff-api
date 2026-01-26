import classes from './Main.module.css';

import Sidebar from './Sidebar/Sidebar';
import CustomNavBar from './Navbar/CustomNavbar';
import MainContent from './MainContent';
import { Fragment } from 'react';

const Main = props => {
  return (
    <Fragment>
      <CustomNavBar />
      <div className={classes.main}>
        <Sidebar />
        <MainContent />
      </div>
    </Fragment>
  );
};

export default Main;
