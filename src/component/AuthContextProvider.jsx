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
      await axios.post('https://data.mongodb-api.com/app/data-sicwcur/endpoint/data/v1/action/insertOne', {
        dataSource: "Cluster0",
        database: "test",
        collection: "users",
        document: {
          username,
          password
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.MONGODB_API_KEY // Use environment variable
        }
      });
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
        throw new Error(error.message);
      }
    }
  };


  const login = async (username, password) => {
    try {
      const response = await axios.post('https://data.mongodb-api.com/app/data-sicwcur/endpoint/data/v1/action/findOne',
        {
          dataSource: "Cluster0",
          database: "test",
          collection: "users",
          filter: { username },
          projection: { username: 1, password: 1, __v: 1 } },
       {

          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.DATA_API_KEY // Use environment variable
          }
        });

      const user = response.data.document;

      if (user && user.password === password) {
        const jwtSecret = 'aa00335ebc227bb226d97c7a1d2ba94e3a5f643353a6c17da3608c3483ad8eac67f4702a922b8fe618733e5745dfa295bc22fcb8fb19da20f2b35ac537ca6388'; // Ensure this matches your server's secret
        const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
        setUser({ userId: user._id, username: user.username, token });

        if (redirectAfterLogin) {
          window.open('/questionnaires', '_blank');
          setRedirectAfterLogin(false);
        }
      } else {
        throw new Error('Invalid username or password');
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
