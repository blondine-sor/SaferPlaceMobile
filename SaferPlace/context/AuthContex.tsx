import React, { createContext, useState, useContext } from 'react';
import apiClient from '../utils/apiClient';
import { deleteToken, saveToken, saveUserInfo } from '../utils/secureStorage';
import { UserInfo } from '@/scripts/interfaces';



  
  interface AuthContextProps {
    isAuthenticated: boolean;
    userInfo: UserInfo | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
  }
  
  const AuthContext = createContext<AuthContextProps | undefined>(undefined);
  
  export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  
    const login = async (email: string, password: string) => {
        try {
          const response = await apiClient.post('/login', { email, password });
          console.log('Login successful:', response.data.user);
          const { access_token, expires, user } = response.data;
      
          // Save token
          await saveToken(access_token);
      
          // Save user information
          const userInfo = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            authorization: user.authorization,
            isActive: user.is_active,
          };
          await saveUserInfo(userInfo);
      
          setUserInfo(userInfo);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Login failed', error);
        }
      };
      
  
    const logout = async () => {
      try {
        await deleteToken();
        setUserInfo(null);
        setIsAuthenticated(false);
      } catch (error) {
        console.error('Logout failed', error);
      }
    };
  
    return (
      <AuthContext.Provider value={{ isAuthenticated, userInfo, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };
  