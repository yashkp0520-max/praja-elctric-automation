import axios from 'axios';

const API_URL = 'https://praja-elctric-automation-backend.onrender.com/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const adminService = {
  // Dashboard stats
  getStats: async () => {
    const response = await axios.get(`${API_URL}/admin/stats`, { headers: getAuthHeader() });
    return response.data;
  },

  // Products
  getAllProducts: async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await axios.post(`${API_URL}/admin/products`, productData, { headers: getAuthHeader() });
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await axios.put(`${API_URL}/admin/products/${id}`, productData, { headers: getAuthHeader() });
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await axios.delete(`${API_URL}/admin/products/${id}`, { headers: getAuthHeader() });
    return response.data;
  },

  // Feedbacks
  getAllFeedbacks: async () => {
    const response = await axios.get(`${API_URL}/feedback`);
    return response.data;
  },

  deleteFeedback: async (id) => {
    const response = await axios.delete(`${API_URL}/feedback/${id}`);
    return response.data;
  },

  // Enquiries
  getAllEnquiries: async () => {
    const response = await axios.get(`${API_URL}/admin/enquiries`, { headers: getAuthHeader() });
    return response.data;
  },

  updateEnquiryStatus: async (id, status) => {
    const response = await axios.put(`${API_URL}/admin/enquiries/${id}`, { status }, { headers: getAuthHeader() });
    return response.data;
  },

  deleteEnquiry: async (id) => {
    const response = await axios.delete(`${API_URL}/admin/enquiries/${id}`, { headers: getAuthHeader() });
    return response.data;
  },

  // Users
  getAllUsers: async () => {
    const response = await axios.get(`${API_URL}/admin/users`, { headers: getAuthHeader() });
    return response.data;
  },
};
