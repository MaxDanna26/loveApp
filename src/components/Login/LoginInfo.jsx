import { loginWithGoogle, signUp, signIn } from '../../services/auth';
import { FcGoogle } from 'react-icons/fc';
import { Container, LoginButton, Input, Flotante } from './style';
import { useState } from 'react';
import { createUser } from './api';

const LoginInfo = () => {

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (correo, password) => {
    await signIn(correo, password);
  }

  const handleSignUp = async (correo, password) => {
    await signUp(correo, password);
    createUser({ correo });
  }

  return (
    <Flotante>
      <Input type='email'
        value={correo}
        placeholder='Correo'
        onChange={((e) => setCorreo(e.target.value))}>
      </Input>

      <Input type='password'
        value={password}
        placeholder='Contraseña'
        onChange={(e) => setPassword(e.target.value)}>
      </Input>

      <Container $gap='1rem'>
        <Container $direction='row'>
          <LoginButton onClick={() => handleSignUp(correo, password)}>SignUp</LoginButton>
          <LoginButton onClick={() => handleSignIn(correo, password)}>SignIn</LoginButton>
        </Container>
        <LoginButton onClick={loginWithGoogle}><FcGoogle /> oogle Login</LoginButton>
      </Container>
    </Flotante>

  )
}

export default LoginInfo