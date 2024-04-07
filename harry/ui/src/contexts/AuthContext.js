import React, { createContext, useContext, useSelector } from 'react';

// Create the context
const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
    const {user} = useSelector((state) => state.auth);


  return (
    <AuthContext.Provider value={{ user}}>
      {children}
    </AuthContext.Provider>
  );
};

// Create the hook
export const useAuth = () => useContext(AuthContext);