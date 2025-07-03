import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on app load
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (empId, password) => {
    setIsLoading(true);
    try {
      // This will be replaced with actual API call to backend
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ empId, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        setIsLoading(false);
        return userData;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      // For demo purposes, allow any login to succeed with a generic user
      // This ensures the demo can proceed without backend
      const demoUser = { 
        empId: empId, 
        name: `User ${empId}`, 
        role: empId === 'W001' ? 'Admin' : empId === 'W002' ? 'Scheduler' : 'Worker' 
      };
      setUser(demoUser);
      localStorage.setItem('currentUser', JSON.stringify(demoUser));
      setIsLoading(false);
      return demoUser;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

