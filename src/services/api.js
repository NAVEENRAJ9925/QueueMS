import axios from 'axios';
import { auth } from './firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return config;
  }
});

// Business API calls
export const getBusinessQueues = async (businessId) => {
  try {
    const response = await api.get(`/queues/${businessId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching business queues:', error);
    throw error;
  }
};

export const createQueue = async (queueData) => {
  try {
    const response = await api.post('/queues/create', queueData);
    return response.data;
  } catch (error) {
    console.error('Error creating queue:', error);
    throw error;
  }
};

export const updateQueue = async (queueId, updateData) => {
  try {
    const response = await api.put(`/queues/${queueId}/update`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating queue:', error);
    throw error;
  }
};

export const removeUserFromQueue = async (queueId, userId) => {
  try {
    const response = await api.delete(`/queues/${queueId}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing user from queue:', error);
    throw error;
  }
};

// User API calls
export const getAllQueues = async () => {
  try {
    const response = await api.get('/queues/available');
    return response.data;
  } catch (error) {
    console.error('Error fetching available queues:', error);
    throw error;
  }
};

export const getUserJoinedQueues = async (userId) => {
  try {
    const response = await api.get(`/queues/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user queues:', error);
    throw error;
  }
};

export const joinQueue = async (queueId, userData) => {
  try {
    const response = await api.post(`/queues/${queueId}/join`, userData);
    return response.data;
  } catch (error) {
    console.error('Error joining queue:', error);
    throw error;
  }
};

export const leaveQueue = async (queueId, userId) => {
  try {
    const response = await api.post(`/queues/${queueId}/leave/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error leaving queue:', error);
    throw error;
  }
};

export const getQueueDetails = async (queueId) => {
  try {
    const response = await api.get(`/queues/details/${queueId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching queue details:', error);
    throw error;
  }
};

export const getUserPositionInQueue = async (queueId, userId) => {
  try {
    const response = await api.get(`/queues/${queueId}/position/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user position:', error);
    throw error;
  }
};