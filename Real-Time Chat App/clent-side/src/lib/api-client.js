import axios from 'axios';
import { HOST } from "@/utils/constants";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const apiClient = axios.create({
  baseURL: HOST,
  withCredentials: true,
  timeout: 10000,
});

// Retry failed requests
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    
    if (!config || !response || config._retry) {
      return Promise.reject(error);
    }

    if (response.status === 401) {
      config._retry = true;
      try {
        // Try to refresh session
        await axios.get(`${HOST}/api/auth/refresh`, { withCredentials: true });
        // Retry original request
        return apiClient(config);
      } catch (e) {
        console.error('Session refresh failed');
        return Promise.reject(error);
      }
    }
  })