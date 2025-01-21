import axios from 'axios';
import { getToken } from './secureStorage';

const apiClient = axios.create({
  baseURL: 'https://saferplaceserver.onrender.com/',
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
