import styled from "styled-components";

export const Title = styled.h1`
text-align: center;
margin: 0;
font-weight: bold;
color: white;
`;

export const Magic = styled.div`
width: 100%;
  margin: 0.4rem;
`;

export const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
`;

export const Like = styled.button`
border: none;
background-color: transparent;
cursor: pointer;
transition: 0.5s ease;

&:hover{
 scale: 1.3;
}
`;

export const Button = styled.button`
padding: 0.5rem 1rem;
  background-color: #D94D1A;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: 4px;
  &:hover {
    background-color: #b73e15;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: ${({ $direction }) => $direction ? $direction : 'row'} ;
  justify-content: center;
  align-items: center;
  width: 90%;
  gap: 0.4rem;
  margin: 0.2rem;
  background-color: ${({ $bgColor }) => $bgColor || "transparent"};
  padding: .5rem;
  border-radius: 6px;
  text-align: center;
`;

export const Main = styled.div`
  width: 90%;
  margin: 1rem auto;
  background-color: #D94D1A;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 8px;
`;

export const Inputs = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
  
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(6, 6, 6, 0.48);
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
  padding: 10px;
  border-radius: 12px;
  position: relative;
  -webkit-box-shadow: 1px 1px 106px -21px rgba(250,247,250,1);
  -moz-box-shadow: 1px 1px 106px -21px rgba(250,247,250,1);
  box-shadow: 1px 1px 106px -21px rgba(250,247,250,1);
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
