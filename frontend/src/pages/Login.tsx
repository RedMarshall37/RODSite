import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context';
import axios from 'axios';

export default function Auth() {
  const { setIsAuth, setIsAdmin, setCurrentUserID } = React.useContext(AuthContext);
  const [loginValue, setLogin] = React.useState('');
  const [passwordValue, setPassword] = React.useState('');
  const [registerNickname, setRegisterNickname] = React.useState('');
  const [registerPassword, setRegisterPassword] = React.useState('');
  const [registerEmail, setRegisterEmail] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isLoginMode, setIsLoginMode] = React.useState(true);
  const navigate = useNavigate();

  const handleLoginClick = async () => {

    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        Nickname: loginValue,
        Password: passwordValue
      });

      const data = response.data;
      console.log(response);
      const [header, payload, signature] = data.token.split('.');

      const decodedPayload = JSON.parse(atob(payload));

      setIsAuth(data.token);
      setCurrentUserID(decodedPayload.id);
      setIsAdmin(decodedPayload.isAdmin);
      localStorage.setItem('auth', data.token);
      localStorage.setItem('currentUserID', decodedPayload.id);
      localStorage.setItem('isAdmin', decodedPayload.isAdmin);
      console.log(`Мой ID:${decodedPayload.id}`);
      navigate('/FAQ');
    } catch (error) {
      console.error('Error during login:', error);
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        setErrorMessage('Неправильный логин или пароль');
      } else {
        setErrorMessage('Произошла ошибка. Попробуйте еще раз.');
      }
    }
  };

  const handleRegisterClick = async () => {
    try {
      const response = await axios.post('http://localhost:5000/auth/registration', {
        Nickname: registerNickname,
        Password: registerPassword,
        Email: registerEmail
      });

      if (response.data) {
        setLogin(registerNickname);
        setPassword(registerPassword);
        console.log(loginValue);
        console.log(passwordValue);
        setIsLoginMode(true);
        handleLoginClick();
      } else {
        setErrorMessage('Произошла ошибка. Попробуйте еще раз.');
      }
    } catch (error) {
      console.log(error);
      console.error('Error during registration:', error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400 && error.response.data.message === 'Nickname already exists') {
          setErrorMessage('Пользователь с таким именем уже существует.');
        } else if (error.response.status === 400 && error.response.data.message === 'Email already exists') {
          setErrorMessage('Пользователь с такой почтой уже существует.');
        } else {
          setErrorMessage('Произошла ошибка. Попробуйте еще раз.');
        }
      } else {
        setErrorMessage('Произошла ошибка. Попробуйте еще раз.');
      }
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => setIsLoginMode(true)}>Login</button>
        <button onClick={() => setIsLoginMode(false)}>Register</button>
      </div>
      {isLoginMode ? (
        <div>
          <input
            onChange={e => {
              setLogin(e.target.value);
              console.log('Login value:', e.target.value);
            }}
            type="text"
            value={loginValue}
            placeholder="Nickname"
            required
          />
          <input
            onChange={e => {
              setPassword(e.target.value);
              console.log('Password value:', e.target.value);
            }}
            type="password"
            value={passwordValue}
            placeholder="Password"
            required
          />
          <button onClick={handleLoginClick}>
            LOG IN
          </button>
        </div>
      ) : (
        <div>
          <input
            onChange={e => {
              setRegisterNickname(e.target.value);
              console.log('Register nickname:', e.target.value);
            }}
            type="text"
            value={registerNickname}
            placeholder="Nickname"
            required
          />
          <input
            onChange={e => {
              setRegisterPassword(e.target.value);
              console.log('Register password:', e.target.value);
            }}
            type="password"
            value={registerPassword}
            placeholder="Password"
            required
          />
          <input
            onChange={e => {
              setRegisterEmail(e.target.value);
              console.log('Register email:', e.target.value);
            }}
            type="email"
            value={registerEmail}
            placeholder="Email"
            required
          />
          <button onClick={handleRegisterClick}>
            REGISTER
          </button>
        </div>
      )}
      {errorMessage && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {errorMessage}
        </div>
      )}
    </div>
  );
}
