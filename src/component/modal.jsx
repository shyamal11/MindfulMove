import React, { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { AuthContext } from './AuthContextProvider';
import modalStart from '../assets/img/modalImg.png';
import { FiUser, FiLock } from 'react-icons/fi';
import './modal.css';

Modal.setAppElement('#root');

// Styled Components
const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 30%, #c3cfe2 100%);
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  height: 420px;
`;

const CloseDiv = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  font-size: 1.5rem;
  color: #ff6b6b;

  &:hover {
    transform: rotate(90deg);
    transition: transform 0.3s;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 15px;
`;

const Input = styled.input`
  padding: 15px 40px;
  border: 2px solid #007bff;
  border-radius: 30px;
  font-size: 1rem;
  width: 100%;
  transition: border-color 0.3s, box-shadow 0.3s;
  background: #ffffff;

  &:focus {
    border-color: #0056b3;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    outline: none;
  }
`;

const Icon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #007bff;
`;

const Button = styled.button`
  padding: 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background: #0056b3;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ToggleLink = styled.span`
  color: #007bff;
  cursor: pointer;
  margin-top: 15px;
  font-size: 0.9rem;
  text-decoration: underline;

  &:hover {
    color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 5px;
  font-size: 0.9rem;
`;

const ImageWrapper = styled.div`
   width: 70%;
    height: auto;
    max-height: 40px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 40px;
`;

const AuthModal = ({ isOpen, onRequestClose }) => {
  const { register, login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setUsername('');
    setPassword('');
    setError('');
  }, [isOpen, isLogin]);

  useEffect(() => {
    setIsLogin(true);
  }, [isOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      onRequestClose();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Invalid username or password. Please try again.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(username, password);
      onRequestClose();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError('Username already exists.');
        } else if (error.response.status === 401) {
          setError('Invalid username or password. Please try again.');
        } else {
          setError('Registration failed. Please try again later.');
        }
      } else if (error.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError(error.message);
      }
    }
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setUsername('');
    setPassword('');
    setError('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Auth Modal"
      className="auth-modal"
      overlayClassName="auth-modal-overlay"
    >
      <ModalWrapper>
        <CloseDiv onClick={onRequestClose}>&times;</CloseDiv>
     <ImageWrapper>
          <img src={modalStart} alt="Modal Visual" />
          </ImageWrapper>
        
        <Form onSubmit={isLogin ? handleLogin : handleRegister}>
          <InputWrapper>
            
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </InputWrapper>
          <InputWrapper>
           
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputWrapper>
          <Button type="submit">{isLogin ? 'Login' : 'Register'}</Button>
        </Form>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ToggleLink onClick={handleToggle}>
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </ToggleLink>
      </ModalWrapper>
    </Modal>
  );
};

export default AuthModal;
