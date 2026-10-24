import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('moviebook_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }

    const status = error?.response?.status;
    if (status === 400) return Promise.reject(new Error('Invalid request. Please check your input.'));
    if (status === 401) return Promise.reject(new Error('Please sign in to continue.'));
    if (status === 403) return Promise.reject(new Error('You do not have access to this action.'));
    if (status === 404) return Promise.reject(new Error('The requested resource was not found.'));
    if (status === 409) return Promise.reject(new Error('One or more selected seats are no longer available. Please choose different seats.'));
    if (status === 500) return Promise.reject(new Error('Something went wrong on the server. Please try again later.'));

    return Promise.reject(new Error('Unable to complete the request. Please try again.'));
  },
);
