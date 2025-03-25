import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
*{
  box-sizing: border-box;
  margin: 0;
}
`;
export const Flotante = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
text-align: center;
position: relative;
gap: .5rem;
`;

export const Container = styled.div`
display: flex;
flex-direction: ${({ $direction }) => $direction ? $direction : 'column'};
justify-content: center;
align-items: center;
gap: ${({ $gap }) => $gap ? $gap : '0.5rem'};
text-align: center;
`;

export const Main = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow-x: hidden; 
`;

export const Input = styled.input`
padding: 10px;
text-align: center;
border-radius: 10px;
`;

export const LoginButton = styled.button`
width: 100%;
background-color: white;
color: black;
border: 1px solid black;
border-radius: 10px;
padding: 15px;
text-align: initial;
&:hover{
  cursor: pointer;
}
`;

export const Video = styled.video`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

