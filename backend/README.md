
# StayHaven Backend

This is the backend server for the StayHaven hotel booking application.

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   ```
4. Start the server:
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm run dev
   ```

## API Documentation

### Authentication Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current logged in user (Protected)
- `POST /api/auth/logout` - Logout user

### User Routes

- `GET /api/users` - Get all users (Protected, Admin)
- `GET /api/users/:id` - Get single user (Protected)
- `PUT /api/users/:id` - Update user (Protected, Owner or Admin)
- `DELETE /api/users/:id` - Delete user (Protected, Owner or Admin)

### Hotel Routes

- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/featured` - Get featured hotels
- `GET /api/hotels/:id` - Get single hotel
- `POST /api/hotels/search` - Search hotels
- `POST /api/hotels` - Create new hotel (Protected, Admin)
- `PUT /api/hotels/:id` - Update hotel (Protected, Admin)
- `DELETE /api/hotels/:id` - Delete hotel (Protected, Admin)

### Room Routes

- `GET /api/rooms/hotel/:hotelId` - Get all rooms for a hotel
- `GET /api/rooms/:id` - Get single room
- `GET /api/rooms/availability/:roomId` - Check room availability
- `POST /api/rooms/:hotelId` - Create new room (Protected, Admin)
- `PUT /api/rooms/:id` - Update room (Protected, Admin)
- `DELETE /api/rooms/:id/:hotelId` - Delete room (Protected, Admin)

### Booking Routes

- `GET /api/bookings` - Get all bookings (Protected, Admin or Moderator)
- `GET /api/bookings/hotel/:hotelId` - Get all bookings for a hotel (Protected, Admin or Moderator)
- `GET /api/bookings/user/:userId` - Get all bookings for a user (Protected, Owner or Admin)
- `POST /api/bookings` - Create a booking (Protected)
- `PUT /api/bookings/:id/cancel` - Cancel a booking (Protected, Owner or Admin)

## Demo Accounts

- Regular User
  - Email: user@example.com
  - Password: password123

- Moderator
  - Email: mod@example.com
  - Password: password123

- Admin
  - Email: admin@example.com
  - Password: password123
