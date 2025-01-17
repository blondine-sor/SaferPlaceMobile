import React, { createContext, useState, useContext } from 'react';
import apiClient from '../utils/apiClient';
import { deleteToken, saveToken, saveUserInfo } from '../utils/secureStorage';
import { UserInfo, Contacts, EmergencyContact} from '@/scripts/interfaces';



  
  interface AuthContextProps {
    isAuthenticated: boolean;
    userInfo: UserInfo | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    contactsInfo: Contacts | null;
  }
  
  const AuthContext = createContext<AuthContextProps | undefined>(undefined);
  
  export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [contactsInfo, setContactsInfo] = useState<Contacts | null>(null);
  
    const login = async (email: string, password: string) => {
        try {
          const response = await apiClient.post('/login', { email, password });
          console.log('Login successful:', response.data.user,response.data.contacts);
          const { access_token, expires, user, contacts } = response.data;
      
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
          const contactInfo = contacts.map((contact: EmergencyContact) => ({
            id: contact.id,
            user_id: contact.user_id,
            name: contact.name,
            phone: contact.phone,
            niveau: contact.niveau,
          }));
          setContactsInfo(contactInfo);
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
        setContactsInfo(null);
      } catch (error) {
        console.error('Logout failed', error);
      }
    };
  
    return (
      <AuthContext.Provider value={{ isAuthenticated, userInfo, login, logout, contactsInfo }}>
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
  