import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object') {
          setUser(parsedUser);
          setToken(storedToken);
          console.log('Loaded user from localStorage:', parsedUser);
        } else {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          console.log('Invalid user data in localStorage, cleared');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = (userData, authToken) => {
    console.log('Attempting login with userData:', userData, 'and token:', authToken);
    if (userData && authToken && typeof userData === 'object') {
      setUser(userData);
      setToken(authToken);
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', authToken);
      console.log('Login successful, stored in localStorage:', { user: userData, token: authToken });
    } else {
      console.log('Login failed: Invalid userData or authToken', { userData, authToken });
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    navigate('/login');
    console.log('Logged out, localStorage cleared');
  };

  const isAuthenticated = () => {
    return !!token;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;