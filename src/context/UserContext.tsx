'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface UserContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  username: string | null;
  setUsername: (value: string | null) => void;
  userEmail: string | null;
  setUserEmail: (value: string | null) => void;
  userImage: string | null;
  setUserImage: (value: string | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const checkLoginStatus = () => {
      if (status === 'authenticated' && session) {
        setIsLoggedIn(true);
        setUsername(session.user?.name || null);
        setUserEmail(session.user?.email || null);
        setUserImage(session.user?.image || null);
      } else {
        // Check for local storage token as fallback
        const token = localStorage.getItem('userToken');
        if (token) {
          setIsLoggedIn(true);
          // You might want to fetch user details from your API here
          // For now, we'll just set a placeholder username
          setUsername('Local User');
        } else {
          setIsLoggedIn(false);
          setUsername(null);
          setUserEmail(null);
          setUserImage(null);
        }
      }
    };

    checkLoginStatus();
  }, [session, status]);

  const logout = () => {
    localStorage.removeItem('userToken');
    setIsLoggedIn(false);
    setUsername(null);
    setUserEmail(null);
    setUserImage(null);
  };

  return (
    <UserContext.Provider 
      value={{ 
        isLoggedIn, 
        setIsLoggedIn, 
        username, 
        setUsername,
        userEmail,
        setUserEmail,
        userImage,
        setUserImage,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};