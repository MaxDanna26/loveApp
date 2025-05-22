import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { logout } from '../../services/auth';
import { Container, Enlace, GlobalStyle, Li, Logout, Burger, Nav, Ul } from './styled';
import { CgMenuLeftAlt, CgMenuMotion } from "react-icons/cg";

const Layout = ({ children }) => {
  const [menu, setMenu] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenu(false);
      }
    };

    if (menu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menu]);

  return (
    <Container>
      <GlobalStyle />
      <Nav>
        <Burger onClick={() => setMenu(!menu)}>
          {(!menu) ? <CgMenuLeftAlt size={35} /> : <CgMenuMotion size={35} />}
        </Burger>
        <Ul ref={menuRef} $menu={menu}>
          <Enlace to="/"><Li>Home</Li></Enlace>
          <Enlace to="/planes"><Li>Planes</Li></Enlace>
          <Enlace to="/cuentas"><Li>Cuentas</Li></Enlace>
          <Enlace to="/expresate"><Li>Exprésate</Li></Enlace>
        </Ul>
        <Logout onClick={logout}>Logout</Logout>
      </Nav>
      <main>{children}</main>
    </Container>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
