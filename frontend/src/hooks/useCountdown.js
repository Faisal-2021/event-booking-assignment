import { useState, useEffect, useCallback } from 'react';

export const useCountdown = (expiresAt) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    if (!expiresAt) return null;
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const difference = expiry - now;
    return difference > 0 ? difference : 0;
  });

  const formatTime = useCallback((milliseconds) => {
    if (milliseconds <= 0) return '00:00';
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, []);

  useEffect(() => {
    if (!expiresAt) return;

    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    let difference = expiry - now;

    if (difference <= 0) {
      setTimeLeft(0);
      return;
    }

    setTimeLeft(difference);

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [expiresAt]);

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isExpired: timeLeft <= 0,
  };
};
