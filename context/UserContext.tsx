import React, { createContext, useContext, useState } from 'react';

type User = {
  username: string;
  email: string;
} | null;

type UserContextType = {
  user: User;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbx3ni2QBgx9LAzRyVqdXAjAXkPNPBIAajTrHVyTwZbV0F26Q3odyre6tpkGSyToTsG--A/exec?path=/api/auth/login';

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();

      let result;
      try {
        result = JSON.parse(text);
      } catch (jsonError) {
        console.error('No se pudo parsear JSON:', text);
        return false;
      }

      if (result.status === 200 && result.data) {
        setUser({
          username: result.data.alias,
          email: email,
        });
        return true;
      } else {
        console.warn('Login fallido:', result.message);
        return false;
      }
    } catch (err) {
      console.error('Error al hacer login:', err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error('useUser debe usarse dentro de un UserProvider');
  return context;
};
