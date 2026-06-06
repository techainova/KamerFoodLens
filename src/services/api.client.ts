// src/services/api.client.ts
// Instance Axios principale avec config + intercepteurs

import axios from 'axios';
import { API_CONFIG } from './config';
import { applyInterceptors } from './interceptors';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

applyInterceptors(apiClient);

export default apiClient;
