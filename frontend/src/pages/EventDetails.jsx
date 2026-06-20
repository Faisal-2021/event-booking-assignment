import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getEventById } from '../api/events';
import { getSeats } from '../api/seats';
import { createReservation } from '../api/reservations';
import { createBooking } from '../api/bookings';
import { useCountdown } from '../hooks/useCountdown';
import { EventDetailsSkeleton } from '../components/Skeleton';

const rows = ['A', 'B', 'C', 'D', 'E'];
const seatsPerRow = 10;

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  const [event, setEvent] = useState(null);
  const [apiSeats, setApiSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSeatsLoading, setIsSeatsLoading] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservation, setReservation] = useState(null);
  const { formattedTime, isExpired } = useCountdown(reservation?.expiresAt);

  // Fetch event details
  const fetchEvent = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getEventById(id);
      setEvent(data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch event';
      addToast(errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [id, addToast]);

  // Fetch seats
  const fetchSeats = useCallback(async () => {
    setIsSeatsLoading(true);
    try {
      const data = await getSeats(id);
      setApiSeats(data);
    } catch (err) {
      console.error('Failed to fetch seats:', err);
      setApiSeats([]);
    } finally {
      setIsSeatsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    queueMicrotask(fetchEvent);
  }, [fetchEvent]);

  useEffect(() => {
    if (event) {
      queueMicrotask(fetchSeats);
    }
  }, [event, fetchSeats]);

  // Build complete seat grid
  const getAllSeats = () => {
    const allSeats = [];
    rows.forEach(row => {
      for (let num = 1; num <= seatsPerRow; num++) {
        const seatNumber = `${row}${num}`;
        const apiSeat = apiSeats.find(s => s.seatNumber === seatNumber);
        allSeats.push({
          _id: apiSeat?._id || `temp-${seatNumber}`,
          seatNumber,
          row,
          number: num,
          status: apiSeat?.status || 'available'
        });
      }
    });
    return allSeats;
  };

  const toggleSeat = (seat) => {
    if (seat.status !== 'available') return;
    setSelectedSeats((prev) => {
      const isSelected = prev.some((s) => s.seatNumber === seat.seatNumber);
      if (isSelected) {
        return prev.filter((s) => s.seatNumber !== seat.seatNumber);
      } else {
        return [...prev, seat];
      }
    });
  };

  const getSeatColor = (seat) => {
    const isSelected = selectedSeats.some((s) => s.seatNumber === seat.seatNumber);
    if (isSelected) return 'bg-blue-500 text-white border-blue-600';
    switch (seat.status) {
      case 'available':
        return 'bg-green-500 text-white border-green-600';
      case 'reserved':
        return 'bg-yellow-500 text-white border-yellow-600';
      case 'booked':
        return 'bg-red-500 text-white border-red-600';
      default:
        return 'bg-gray-200 border-gray-300';
    }
  };

  const handleReserve = async () => {
    setIsReserving(true);
    try {
      const data = await createReservation(id, selectedSeats.map((s) => s.seatNumber));
      setReservation(data);
      addToast('Seats reserved successfully!', 'success');
      await fetchSeats();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Reservation failed';
      addToast(errorMsg, 'error');
    } finally {
      setIsReserving(false);
    }
  };

  // Handle timer expiry
  useEffect(() => {
    if (reservation && isExpired) {
      const timeoutId = setTimeout(() => {
        setReservation(null);
        addToast('Reservation expired. Please try again.', 'warning');
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [reservation, isExpired, addToast]);

  const handleBooking = async () => {
    if (!reservation) return;
    setIsBooking(true);
    try {
      const bookingData = await createBooking(reservation._id || reservation.id);
      await fetchSeats();
      navigate('/booking-success', {
        state: {
          event,
          reservation,
          booking: bookingData,
        },
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Booking failed';
      addToast(errorMsg, 'error');
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return <EventDetailsSkeleton />;
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <nav className="bg-white shadow-sm border-b sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link to="/events" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                ← Back to Events
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-gray-700 hidden sm:block">Hello, {user?.name}</span>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
        <div className="p-8 flex items-center justify-center">
          <div className="text-gray-500 text-lg">Event not found</div>
        </div>
      </div>
    );
  }

  const allSeats = getAllSeats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/events" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              ← Back to Events
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 hidden sm:block">Hello, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">{event.name}</h1>
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <div className="space-y-2">
              <p className="text-gray-600 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <strong className="text-gray-700">Venue:</strong> {event.venue}
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <strong className="text-gray-700">Date:</strong> {event.dateTime && !isNaN(new Date(event.dateTime)) ? new Date(event.dateTime).toLocaleString() : 'TBD'}
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <strong className="text-gray-700">Total Seats:</strong> {event.totalSeats}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Seat Selection</h2>
            <div className="flex flex-wrap gap-4 mb-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded border border-green-600"></div>
                <span className="text-gray-700">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-500 rounded border border-yellow-600"></div>
                <span className="text-gray-700">Reserved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-500 rounded border border-red-600"></div>
                <span className="text-gray-700">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded border border-blue-600"></div>
                <span className="text-gray-700">Selected</span>
              </div>
            </div>
            {isSeatsLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-gray-500 flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  Loading seats...
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 overflow-x-auto pb-2">
                {rows.map((row) => (
                  <div key={row} className="flex gap-2">
                    <div className="w-10 flex items-center justify-center font-bold text-gray-700">{row}</div>
                    {allSeats
                      .filter(seat => seat.row === row)
                      .sort((a, b) => a.number - b.number)
                      .map((seat) => (
                        <button
                          key={seat.seatNumber}
                          onClick={() => toggleSeat(seat)}
                          disabled={seat.status !== 'available'}
                          className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-all duration-200 ${getSeatColor(seat)} ${
                            seat.status === 'available' ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'
                          }`}
                        >
                          {seat.number}
                        </button>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {reservation ? (
            <div className={`rounded-2xl shadow-md p-6 mb-6 ${isExpired ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isExpired ? 'text-red-800' : 'text-green-800'}`}>
                {isExpired ? 'Reservation Expired!' : 'Reservation Successful!'}
              </h2>
              <div className={`space-y-2 ${isExpired ? 'text-red-800' : 'text-green-800'}`}>
                {!isExpired && (
                  <p className="text-xl font-semibold">
                    <strong>Time Remaining:</strong> <span className="font-mono text-2xl">{formattedTime}</span>
                  </p>
                )}
                <p><strong>Reservation ID:</strong> {reservation._id || reservation.id}</p>
                <p><strong>Reserved Seats:</strong> {reservation.seatNumbers.join(', ')}</p>
                <p><strong>Expires At:</strong> {new Date(reservation.expiresAt).toLocaleString()}</p>
              </div>
              {!isExpired && (
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleBooking}
                    disabled={isBooking}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    {isBooking ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Booking...
                      </div>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                  <Link
                    to="/events"
                    className="inline-block bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 text-center transition-colors"
                  >
                    Back to Events
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-xl text-gray-800">
                  <strong>Selected Seats:</strong> {selectedSeats.length}
                </div>
                <button
                  onClick={handleReserve}
                  disabled={selectedSeats.length === 0 || isReserving || isSeatsLoading}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {isReserving ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Reserving...
                    </div>
                  ) : (
                    'Reserve Seats'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
