import { useContext } from 'react';

import AuthContext from '../../../store/auth-context';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

import classes from './CustomNavbar.module.css';

import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'react-bootstrap/Image';

import * as MdIcons from 'react-icons/md';
import * as AiIcons from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

function CustomNavBar() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    authContext.logout();
    navigate('/');
  };

  const userName = authContext.name;

  return (
    <Navbar collapseOnSelect bg="light" expand="xl" className={classes.navBar}>
      <Container fluid>
        <Navbar.Brand>
          <Image src="/cap.png" width={35} height={35} />
          <span style={{ padding: '0.3rem' }}> SISCAP</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="justify-content-end flex-grow-1 pe-3">
            <Nav.Link href="#action1">
              <MdIcons.MdOutlineHelpOutline size={25} />
            </Nav.Link>
            <Nav.Link href="#action2">
              <AiIcons.AiOutlineBell size={25} />
            </Nav.Link>
            <Image
              style={{ marginTop: '10px', marginLeft: '15px' }}
              src="/user.png"
              width={25}
              height={25}
            />
            <NavDropdown
              className={classes.dropdown}
              title={userName}
              id="nav-dropdown"
              drop="down"
            >
              <NavDropdown.Item href="#" onClick={logoutHandler}>
                <MdIcons.MdOutlineExitToApp /> Cerrar Sesión
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavBar;
