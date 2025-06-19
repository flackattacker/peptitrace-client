import api from './api';
import { AxiosError } from 'axios';

// Description: Login user functionality
// Endpoint: POST /api/users/login
// Request: { email: string, password: string }
// Response: { accessToken: string, refreshToken: string }
export const login = async (email: string, password: string) => {
  console.log("API login called with email:", email);
  try {
    console.log("Making POST request to /api/users/login");
    const response = await api.post('/api/users/login', { email, password });
    console.log("Login API response status:", response.status);
    console.log("Login API response data:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    console.error('Login API error response:', error?.response?.data);
    console.error('Login API error status:', error?.response?.status);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Register user functionality
// Endpoint: POST /api/users/register
// Request: { email: string, password: string }
// Response: { email: string }
export const register = async (email: string, password: string) => {
  console.log("API register called with email:", email);
  try {
    console.log("Making POST request to /api/users/register");
    const response = await api.post('/api/users/register', {email, password});
    console.log("Register API response status:", response.status);
    console.log("Register API response data:", response.data);
    return response.data;
  } catch (error) {
    console.error('Register API error:', error);
    if (error instanceof AxiosError) {
      console.error('Register API error response:', error.response?.data);
      console.error('Register API error status:', error.response?.status);
    }
    throw error;
  }
};

// Description: Logout
// Endpoint: POST /api/users/logout
// Request: {}
// Response: { success: boolean, message: string }
export const logout = async () => {
  console.log("API logout called");
  try {
    console.log("Making POST request to /api/users/logout");
    const response = await api.post('/api/users/logout');
    console.log("Logout API response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Logout API error:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};