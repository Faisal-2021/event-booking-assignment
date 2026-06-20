import apiClient from './client';

export const getEvents = async () => {
  const response = await apiClient.get('/events');
  return response.data;
};

export const getEventById = async (id) => {
  const response = await apiClient.get(`/events/${id}`);
  return response.data;
};
