import axios from 'axios';

const API_KEY_SESSION_KEY = 'anthropic_api_key';

const client = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const apiKey = sessionStorage.getItem(API_KEY_SESSION_KEY);
  if (apiKey) {
    config.headers['X-Anthropic-Api-Key'] = apiKey;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  },
);

export default client;
