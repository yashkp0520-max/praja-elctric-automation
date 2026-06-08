import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products';

export const productService = {
  getAllProducts: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      // Return empty array if backend is down or fails
      return [];
    }
  },

  getProductById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }
};
