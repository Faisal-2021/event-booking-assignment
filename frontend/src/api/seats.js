import apiClient from './client';

export const getSeats = async (eventId) => {
  const response = await apiClient.get(`/events/${eventId}/seats`);
  return response.data;
};
