import React, { useEffect, useState, createContext, useContext } from 'react';
interface AuthContextType {
  isAuthenticated: boolean;
  rememberMe: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<boolean>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  useEffect(() => {
    // Check if user was remembered
    const remembered = localStorage.getItem('sigsesa_remember') === 'true';
    const authToken = localStorage.getItem('sigsesa_auth');
    if (remembered && authToken) {
      setIsAuthenticated(true);
      setRememberMe(true);
    }
  }, []);
  const login = async (email: string, password: string, remember: boolean): Promise<boolean> => {
    // Mock authentication - check demo credentials
    if (email === 'admin@sigsesa.gt' && password === 'Demo123*') {
      setIsAuthenticated(true);
      setRememberMe(remember);
      if (remember) {
        localStorage.setItem('sigsesa_remember', 'true');
        localStorage.setItem('sigsesa_auth', 'mock-token');
      } else {
        sessionStorage.setItem('sigsesa_auth', 'mock-token');
      }
      return true;
    }
    return false;
  };
  const logout = () => {
    setIsAuthenticated(false);
    setRememberMe(false);
    localStorage.removeItem('sigsesa_remember');
    localStorage.removeItem('sigsesa_auth');
    sessionStorage.removeItem('sigsesa_auth');
  };
  return <AuthContext.Provider value={{
    isAuthenticated,
    rememberMe,
    login,
    logout
  }}>
      {children}
    </AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}