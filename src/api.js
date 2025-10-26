import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.travelhug.com', // Replace with your API base URL
    headers: {
    'Content-Type': 'application/json',
    },
});

export default apiClient;