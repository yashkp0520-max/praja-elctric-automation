import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const authService = {
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  },
  
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  },

  getMe: async (token) => {
    const response = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  },

  verifyOtp: async (email, otp) => {
    const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
    return response.data;
  },

  resetPassword: async (email, otp, newPassword) => {
    const response = await axios.post(`${API_URL}/reset-password`, { email, otp, newPassword });
    return response.data;
  }
};

