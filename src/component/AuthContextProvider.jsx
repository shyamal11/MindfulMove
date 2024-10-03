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
      // Send a POST request to your server endpoint
      const response = await axios.post(process.env.REACT_APP_MONGODB_REGISTER_URL, {
        username,
        password
      });
  
      console.log('Registration response:', response);
      // Optionally, you can automatically log the user in after registration
      await login(username, password);
    } catch (error) {
      // Simplified error handling
      const errorMessage = error.response?.data?.error || 'An error occurred. Please try again later.';
      throw new Error(errorMessage);
    }
  };

  const login = async (username, password) => {
    try {
        const response = await axios.post(process.env.REACT_APP_MONGODB_LOGIN_URL, { username, password });

        console.log('response', response)

        const { token, userId, username: loggedInUsername } = response.data;

        setUser({ userId, username: loggedInUsername, token });

        if (redirectAfterLogin) {
            window.open('/questionnaires', '_blank');
            setRedirectAfterLogin(false);
        }
    } catch (error) {
       throw new Error(error.response?.data?.error || 'Login failed. Please try again later.');
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
