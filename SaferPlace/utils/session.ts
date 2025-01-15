import AsyncStorage from '@react-native-async-storage/async-storage';

// Save session data
export const saveSession = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Failed to save session:', error);
  }
};

// Retrieve session data
export const getSession = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error('Failed to retrieve session:', error);
    return null;
  }
};

// Clear session data
export const clearSession = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
};
