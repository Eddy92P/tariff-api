import { Link } from 'react-router-dom';

import classes from './SubMenu.module.css';

import Image from 'react-bootstrap/Image';

const SubMenu = props => {
  return (
    <Link to={props.item.path} style={{ textDecoration: 'none' }}>
      <li className={classes.sidebarLink}>
        <span>{props.item.icon}</span>
        <span
          style={{ visibility: !props.sidebarOpen && 'hidden' }}
          className={classes.sidebarLabel}
        >
          {props.item.title}
        </span>
      </li>
    </Link>
  );
};

export default SubMenu;
