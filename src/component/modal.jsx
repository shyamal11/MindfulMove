import React, { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { AuthContext } from './AuthContextProvider';
import modalImg from '../assets/img/modalImg.png';
import './modal.css';

Modal.setAppElement('#root');

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative; /* To position the close button absolutely */
`;

const CloseDiv = styled.div`
   position: absolute;
  top: -20px;
  right: -10px;
  cursor: pointer;
  transition: transform 0.2s;
  font-size: 1.5rem;

  &:hover {
      transform: rotate(90deg);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: #0056b3;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 5px;
  font-size: 0.9rem;
`;

const AuthModal = ({ isOpen, onRequestClose }) => {
  const { register, login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Reset form fields and error message when modal opens or switches between login/register
  useEffect(() => {
    setUsername('');
    setPassword('');
    setError('');
  }, [isOpen, isLogin]);

  // Reset to login form when modal opens
  useEffect(() => {
    setIsLogin(true);
  }, [isOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      // Close the modal on successful login
      onRequestClose();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Invalid username or password. Please try again.'); // Handle 401 Unauthorized error
      } else {
        setError('An error occurred. Please try again later.'); // Handle other errors
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(username, password);
      // Close the modal on successful registration
      onRequestClose();
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 400) {
          setError('Username already exists. ');
        } else if (error.response.status === 401) {
          setError('Invalid username or password. Please try again.');
        } else {
          setError('Registration failed. Please try again later.');
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from server. Please try again later.');
      } else {
        // Something else happened in making the request that triggered an error
        setError(error.message);
      }
    }
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setUsername(''); // Reset username field
    setPassword(''); // Reset password field
    setError(''); // Clear any existing errors
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
        <img src={modalImg} alt="Modal Image" className="modal-image" />
        <h4 className="modal-h4">
          {isLogin ? 'Login' : 'Register'}
        </h4>
        <Form onSubmit={isLogin ? handleLogin : handleRegister}>
          <div className="inputdata">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit">{isLogin ? 'Login' : 'Register'}</Button>
        </Form>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ToggleButton onClick={handleToggle}>
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </ToggleButton>
      </ModalWrapper>
    </Modal>
  );
};

export default AuthModal;
