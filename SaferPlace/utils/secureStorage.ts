import * as SecureStore from 'expo-secure-store';
import { UserInfo } from '@/scripts/interfaces';

export const saveToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync("jwtToken", token);
};

export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync("jwtToken");
};

export const deleteToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync("jwtToken");
};



export const saveUserInfo = async (userInfo: UserInfo): Promise<void> => {
  await SecureStore.setItemAsync("userInfo", JSON.stringify(userInfo));
};

export const getUserInfo = async (): Promise<UserInfo | null> => {
  const userInfo = await SecureStore.getItemAsync("userInfo");
  return userInfo ? JSON.parse(userInfo) : null;
};

export const deleteUserInfo = async (): Promise<void> => {
  await SecureStore.deleteItemAsync("userInfo");
};
