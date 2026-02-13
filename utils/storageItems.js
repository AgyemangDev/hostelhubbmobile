
// utils/fetchStorageItems.js
import axios from 'axios';
import API_BASE_URL from './api/api';

export const fetchStorageItems = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/storage-items`);
    return data.items;
  } catch (error) {
    console.error('Error fetching storage items:', error);
    return [];
  }
};