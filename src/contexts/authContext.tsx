'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  isLogin: boolean;
  token: string | null;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isLogin: false,
  token: null,
  logout: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false); // <- Tambahan

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken'); // HARUS authToken ya, sesuai interceptor
    if (storedToken) {
      setToken(storedToken);
    }
    setIsHydrated(true);
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
  };


  if (!isHydrated) return null;

  return (
    <AuthContext.Provider
      value={{
        isLogin: !!token,
        token,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
