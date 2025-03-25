import styled, { createGlobalStyle } from "styled-components";
import { TfiSave } from "react-icons/tfi";

export const GlobalStyle = createGlobalStyle`
*{
  box-sizing: border-box;
}
`;
export const IconStyled = styled(TfiSave).attrs(() => ({
  size: 25,
}))`
  background-color: ${({ $bgColor }) => $bgColor || "transparent"};
  padding: 4px;
  border-radius: 5px;
`;

export const Button = styled.button`
display: flex;
align-items: center;
justify-content: center;
border-radius: 15px;
background-color: ${({ $bg }) => $bg ? $bg : 'transparent'};
color: white;
font-weight: bold;
transition: 0.4s;
cursor: pointer;
&:hover{
  background-color: #0378A6;
  box-shadow: 0px 0px 7px 3px #EBEFF2;
    transform: scale(1.04); 
}
`;

export const Container = styled.div`
display: flex;
flex-direction: ${({ $direction }) => $direction ? $direction : 'column'};
align-items: center;
justify-content: center;
gap: ${({ $gap }) => $gap ? $gap : '.5rem'};
background-color: ${({ $bg }) => $bg ? $bg : 'transparent'};
margin: ${({ $mg }) => $mg ? $mg : '0'};
`;

export const Input = styled.input`
padding: ${({ $pd }) => $pd ? $pd : '8px'};
background-color: #EBEFF2;
border: 0px solid #EBEFF2;
border-radius: 4px;
width: 100%;
text-align: center;
transition: 0.1s;
&:hover{
  box-shadow: 0px 0px 4px 4px #EBEFF2;
  scale: 1.01;
} 
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  display: ${({ $visible }) => ($visible ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
`;

export const Back = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #403B22;
  width: 320px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(143, 138, 138, 0.1);
  position: relative;
`;

export const Relative = styled.div`
  width: 100%;
  text-align: center;
`;

export const CloseButton = styled.button`  
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #EBEFF2;
  transition: 0.2s;

  &:hover {
    color: #A68E46;
    transform: scale(1.1);
  }
`;


