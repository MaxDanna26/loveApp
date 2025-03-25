import styled, { createGlobalStyle } from "styled-components";
import { Link } from "react-router-dom";
import Barriecito from '../../assets/Fonts/Barriecito-Regular.ttf'

export const GlobalStyle = createGlobalStyle`
@font-face {
  font-family: 'Barriecito';
  src: url(${Barriecito});
}
`;

export const Container = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
`;

export const Nav = styled.nav`
display: flex;
flex-direction: row;
justify-content: space-between;
`;

export const Ul = styled.ul`
display: flex;
gap: 1rem;
`;

export const Li = styled.li`
list-style: none;
background-color: #D91818;
border-radius: 5px;
padding: 10px;
transition: .5s ease;
&:hover{
  scale: 1.1;
}
`;

export const Enlace = styled(Link)`
text-decoration: none;
color: black;
font-weight: bold;
color: white;
font-family: 'Barriecito';
`;

export const Logout = styled.button`
padding: 8px;
background-color: #735B2F;
color: #EBEFF2;
font-weight: bold;
text-align: center;
cursor: pointer;
`;