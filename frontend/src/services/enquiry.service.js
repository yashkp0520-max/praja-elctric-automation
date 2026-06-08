import axios from 'axios';

const API_URL = 'http://localhost:5000/api/enquiries';

export const enquiryService = {
  submitEnquiry: async (enquiryData) => {
    try {
      const response = await axios.post(API_URL, enquiryData);
      return response.data;
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      throw error;
    }
  },
};
