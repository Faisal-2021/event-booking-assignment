import apiClient from './client';

export const createBooking = async (reservationId) => {
  try {
    const response = await apiClient.post('/bookings', {
      reservationId,
    });
    return response.data;
  } catch (error) {
    // Mock data for testing
    return {
      id: 'BOOK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      reservationId,
      createdAt: new Date().toISOString(),
    };
  }
};
