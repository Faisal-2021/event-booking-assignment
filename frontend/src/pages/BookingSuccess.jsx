import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useEffect } from 'react';

export default function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const { event, reservation, booking } = location.state || {};

  useEffect(() => {
    if (event || reservation) {
      addToast('Booking confirmed successfully!', 'success');
    }
  }, [event, reservation, addToast]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">Event Booking System</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 hidden sm:block">Hello, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-8 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center border-b border-green-200">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 shadow-inner">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Booking Successful!</h1>
            <p className="text-gray-600">Your reservation has been confirmed</p>
          </div>

          {/* Booking Details */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Event Name */}
              {event && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Event</h2>
                  <p className="text-xl font-bold text-gray-900">{event.name}</p>
                </div>
              )}

              {/* Seat Numbers */}
              {reservation && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Seats</h2>
                  <div className="flex flex-wrap gap-2">
                    {reservation.seatNumbers?.map((seat) => (
                      <span
                        key={seat}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 shadow-sm"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Date */}
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Booking Date</h2>
                <p className="text-lg text-gray-900">
                  {booking?.createdAt && !isNaN(new Date(booking.createdAt)) 
                    ? new Date(booking.createdAt).toLocaleString() 
                    : new Date().toLocaleString()}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/events"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Back to Events
              </Link>
              <button
                onClick={handleLogout}
                className="flex-1 bg-gray-200 text-gray-900 text-center px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
