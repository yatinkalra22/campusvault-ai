import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 30000,
});

// Attach fresh Cognito JWT on every request
api.interceptors.request.use(async (config) => {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Not authenticated — let request proceed without token
  }
  return config;
});

export default api;
