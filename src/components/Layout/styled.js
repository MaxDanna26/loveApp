import styled, { createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';


export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #d492ab;
  background: radial-gradient(circle,rgba(212, 146, 171, 1) 34%, rgba(208, 112, 152, 1) 50%, rgba(237, 83, 121, 1) 100%);
  `;

export const Ul = styled.ul`
  display: ${({ $menu }) => ($menu ? 'flex' : 'none')};
  flex-direction: column;
  position: absolute;
  top: 67px;
  left: 0;
  width: 60%;
  height: 100vh;
  border-radius: 5px;
  background-color: white;
  border: 2px solid #ED5379;
  list-style: none;
  padding: 1rem;
  z-index: 10;
  transition: left .5s ease-in-out; 
  text-align: center;
`;

export const Li = styled.li`
  margin: 0.5rem 0;
  padding: 10px;
  font-weight: bold;
  border-radius: 10px;
  border: 1px solid #ED5379;
    &:hover{
    background-color:  #ED5379;
    cursor: pointer;
  &:hover a {
    color: white;
  }
  }
`;

export const Enlace = styled(Link)`
  text-decoration: none;
  color: #ED5379;
  width: 100%;
  &:hover{color:white;}
`;

export const Logout = styled.button`
  background-color: #ED5379;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
`;


export const Burger = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
`;