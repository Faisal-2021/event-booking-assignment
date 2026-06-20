import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Events from '../pages/Events';
import EventDetails from '../pages/EventDetails';
import BookingSuccess from '../pages/BookingSuccess';
import ProtectedRoute from '../components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <Navigate to="/events" replace />,
  },
  {
    path: '/events',
    element: (
      <ProtectedRoute>
        <Events />
      </ProtectedRoute>
    ),
  },
  {
    path: '/events/:id',
    element: (
      <ProtectedRoute>
        <EventDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/booking-success',
    element: (
      <ProtectedRoute>
        <BookingSuccess />
      </ProtectedRoute>
    ),
  },
]);

export default router;
