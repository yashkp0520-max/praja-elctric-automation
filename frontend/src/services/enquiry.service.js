import axios from 'axios';

const API_URL = 'https://praja-elctric-automation-backend.onrender.com/api/enquiries';

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
