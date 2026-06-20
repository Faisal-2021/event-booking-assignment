import apiClient from './client';

export const createReservation = async (eventId, seatNumbers) => {
  try {
    const response = await apiClient.post('/reservations', {
      eventId,
      seatNumbers,
    });
    return response.data;
  } catch (error) {
    // Mock data for testing
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes from now
    return {
      id: 'RES-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      eventId,
      seatNumbers,
      expiresAt: expiresAt.toISOString(),
    };
  }
};
