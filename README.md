# Event Booking System

## Project Overview

This is a full-stack event ticket booking application I built for an assignment. The app lets users browse events, reserve seats, and book tickets. I implemented a complete authentication system, event management, seat reservation with a 10-minute time limit, and booking confirmation.

## Features

### Authentication
- User registration with name, email, and password
- User login with email and password
- JWT authentication to protect API routes

### Events
- View all events on the homepage
- View detailed event information including date, venue, and available seats

### Seat Reservation
- Reserve seats for 10 minutes before they expire
- Can't reserve seats that are already reserved or booked
- Shows a countdown timer when seats are reserved

### Booking
- Confirm booking from an existing reservation
- Prevents booking expired reservations
- Shows a success page after booking is complete

## Tech Stack

### Backend:
- Node.js
- Express.js
- MongoDB Atlas (cloud database)
- Mongoose (ODM)
- JWT for authentication

### Frontend:
- React
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Vite as the build tool
- React Hook Form with Zod for validation

## Project Structure

The project is split into two main folders:

- **backend/**: Contains the Express server, all the models, controllers, routes, and middleware
- **frontend/**: The React application with all the components, pages, and API client

## API Endpoints

### Authentication
- `POST /api/auth/register`
  - Body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`

- `POST /api/auth/login`
  - Body: `{ "email": "john@example.com", "password": "password123" }`

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details

### Reservations
- `POST /api/reservations`
  - Requires JWT token in headers: `Authorization: Bearer <token>`
  - Body: `{ "eventId": "<event_id>", "seatNumbers": ["A1", "A2"] }`

### Bookings
- `POST /api/bookings`
  - Requires JWT token in headers: `Authorization: Bearer <token>`
  - Body: `{ "reservationId": "<reservation_id>" }`

## How to Run Backend

1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Set up environment variables in `.env` (already included in the repo):
   - `PORT=5000`
   - `MONGO_URI=mongodb+srv://...` (MongoDB Atlas connection string)
   - `JWT_SECRET=your_jwt_secret_key`
   - `JWT_EXPIRE=30d`
4. Seed the database with sample events and seats: `npm run seed`
5. Start the development server: `npm run dev`

## How to Run Frontend

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Make sure the backend is running on port 5000 (or update `.env` if not)
4. Start the development server: `npm run dev`
5. Open the URL shown in the terminal (usually http://localhost:5173)

## Design Decisions

### Why JWT authentication was used
I chose JWT because it's stateless and works well with mobile apps too. The token is stored in localStorage on the frontend and sent in the Authorization header. It's simple to implement and doesn't require server-side session storage.

### Why seat status is stored in MongoDB
I store seat status directly in MongoDB (as 'available', 'reserved', or 'booked') because it makes checking seat availability straightforward. The Seat model is linked to events, so we can easily query all seats for a specific event.

### How double booking is prevented
I used MongoDB transactions in the reservation and booking controllers. When someone tries to reserve seats, we start a transaction, check if all seats are available, update their status to 'reserved', and create the reservation record. If any step fails, the whole transaction is rolled back. Also, I added a unique index on eventId and seatNumber to prevent duplicate seat entries.

### How reservation expiry is handled
Reservations have an `expiresAt` field set to 10 minutes after creation. I added a node-cron job that runs every minute to clean up expired reservations and set those seats back to 'available'. Also, when trying to book, we check if the reservation is still valid before proceeding.

## Challenges Faced

### Handling seat state synchronization
The biggest issue was making sure the frontend always shows the correct seat status. At first, I had some race conditions where two users could reserve the same seat at almost the same time. Fixed that with MongoDB transactions and proper validation.

### Managing reservation expiry
Getting the reservation expiry right took a bit of work. Initially, I only checked expiry when booking, but realized I needed a cron job to actually clean up expired reservations and free up seats automatically.

### Keeping frontend seat status in sync with backend
I had to think about how often to refresh seat data. Right now, I refetch seat status when the component mounts, but I know it's not perfect. If someone else reserves a seat while you're looking at the page, you won't see it until you refresh.

## Future Improvements

- WebSocket real-time seat updates so everyone sees the latest seat status immediately
- Email confirmations when a booking is made
- Payment integration (Stripe or PayPal)
- User profile page to see past bookings
- Admin panel to add/remove events
- Better error handling and loading states in the frontend
- Unit tests for the backend controllers

## Assumptions

- Users need to create an account to book tickets (guest checkout not implemented)
- All events have exactly 50 seats arranged in 5 rows (A-E) with 10 seats each
- Reservation time is fixed at 10 minutes (not configurable)
- No seat pricing or different seat categories
- Users can only book from their own reservations

## Author

Built by [Your Name]
