import PropTypes from 'prop-types'
import { logout } from '../../services/auth';
import { Container, Enlace, GlobalStyle, Li, Logout, Nav, Ul } from './styled';


const Layout = ({ children }) => {
  return (
    <Container>
      <GlobalStyle />
      <Nav>
        <Ul>
          <Li>
            <Enlace to="/">Home</Enlace>
          </Li>
          <Li>
            <Enlace to="/planes" >Planes</Enlace>
          </Li>
          <Li>
            <Enlace>Cuentas</Enlace>
          </Li>
          <Li>
            <Enlace>Expresate</Enlace>
          </Li>
        </Ul>
        <Logout onClick={logout} >Logout</Logout>
      </Nav>

      <main>{children}</main>
    </Container>
  )
}

export default Layout;

Layout.propTypes = {
  children: PropTypes.node,
}