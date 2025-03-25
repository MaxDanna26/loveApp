import styled, { createGlobalStyle } from "styled-components";
import backgroundImage from '../../assets/corazones.jpg'

export const GlobalStyle = createGlobalStyle`
*{
  box-sizing: border-box;
}
  body{
    overflow-x: hidden;
    background: url(${backgroundImage});
    background-size: cover;
    text-align: center;
    background-repeat: no-repeat;
    background-position: center;
    min-height: 100vh;
    height: 100%;
  }
`;

export const Grid = styled.div`
display: flex;
flex-direction: row;
flex-wrap: wrap;
justify-content: center;
padding: 10px;
gap: 1rem;
`;