import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(false);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'logout') {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('logout');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const register = async (username, password) => {
    try {
      await axios.post('http://localhost:5000/register', { username, password });
      await login(username, password);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 400) {
          throw new Error('Username already exists');
        } else {
          throw new Error('Registration failed. Please try again later.');
        }
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response from server. Please try again later.');
      } else {
        // Something else happened in making the request that triggered an error
        throw new Error( error.message);
      }
    }
  };
  

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      const { token, username: userUsername, userId } = response.data;
      setUser({ userId, username: userUsername, token });

      if (redirectAfterLogin) {
        window.open('/questionnaires', '_blank');
        setRedirectAfterLogin(false);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.setItem('logout', Date.now());
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, setRedirectAfterLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
