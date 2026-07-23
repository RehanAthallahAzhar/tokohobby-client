import React, { createContext, useState, useEffect, useMemo } from 'react'; 
import { accountApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = () => {

    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    } catch (error) {
        console.error("Gagal parse user dari localStorage", error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
    } finally {
        setIsLoading(false);
    }
    };

    verifyAuth();
  }, []);

  const login = async (username, password) => {
    const response = await accountApi.post('/login', {
      username,
      password,
    });

    const { data } = response.data;
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('authUser', JSON.stringify(data)); 

    setToken(data.token);
    setUser(data); 
    
    return response.data;
  };

  const register = async (name, username, email, password, role, adminToken) => {
    const response = await accountApi.post('/register', {
    name,
    username,
    email,
    password,
    role,
    token: adminToken,
    });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setUser(null);
    setToken(null);
    navigate('/login');
  };

    const authContextValue = useMemo(() => ({
        isAuthenticated: !!token, 
        user, 
        token, 
        isLoading,
        login, 
        register, 
        logout 
    }), [token, user, isLoading]);

  return (
    <AuthContext.Provider 
      value={authContextValue}
    >
    {children}
    </AuthContext.Provider>
  );
};
