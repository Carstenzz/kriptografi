import React, { createContext, useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username) => {
    setUser({ username });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {user ? <Navigate to="/kriptografi" /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
