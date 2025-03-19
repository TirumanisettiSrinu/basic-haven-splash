
import { Booking, Hotel, Room, User } from '@/types';

export const createMockBookings = (userId: string): Booking[] => {
  return [
    {
      _id: 'b1',
      userId: userId,
      hotelId: 'h1',
      roomId: 'r1',
      roomNumber: 101,
      dateStart: new Date(new Date().setDate(new Date().getDate() + 5)),
      dateEnd: new Date(new Date().setDate(new Date().getDate() + 8)),
      totalPrice: 897,
      status: 'confirmed',
      hotel: {
        _id: 'h1',
        name: 'Grand Plaza Hotel',
        city: 'New York',
        address: '123 Broadway, New York, NY',
        photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945'],
        rating: 4.8,
        type: 'Hotel',
        distance: '0.5 km',
        title: 'Luxury Stay in Downtown',
        desc: 'Elegant accommodations in the heart of the city',
        rooms: [],
        cheapestPrice: 299,
        featured: true
      },
      room: {
        _id: 'r1',
        title: 'Deluxe King Room',
        price: 299,
        maxPeople: 2,
        desc: 'Spacious room with king-sized bed',
        roomNumbers: [{ number: 101, unavailableDates: [] }],
        isCleaned: true,
        isAssigned: false,
        bookedBy: null
      }
    },
    {
      _id: 'b2',
      userId: userId,
      hotelId: 'h2',
      roomId: 'r2',
      roomNumber: 202,
      dateStart: new Date(new Date().setDate(new Date().getDate() - 15)),
      dateEnd: new Date(new Date().setDate(new Date().getDate() - 10)),
      totalPrice: 1745,
      status: 'completed',
      hotel: {
        _id: 'h2',
        name: 'Seaside Resort',
        city: 'Miami',
        address: '555 Ocean Drive, Miami, FL',
        photos: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'],
        rating: 4.6,
        type: 'Resort',
        distance: '2 km',
        title: 'Beach Paradise',
        desc: 'Stunning views of the ocean',
        rooms: [],
        cheapestPrice: 349,
        featured: true
      },
      room: {
        _id: 'r2',
        title: 'Ocean View Suite',
        price: 349,
        maxPeople: 3,
        desc: 'Suite with panoramic ocean views',
        roomNumbers: [{ number: 202, unavailableDates: [] }],
        isCleaned: true,
        isAssigned: false,
        bookedBy: null
      }
    },
    {
      _id: 'b3',
      userId: userId,
      hotelId: 'h3',
      roomId: 'r3',
      roomNumber: 305,
      dateStart: new Date(new Date().setDate(new Date().getDate() - 5)),
      dateEnd: new Date(new Date().setDate(new Date().getDate() + 1)),
      totalPrice: 598,
      status: 'cancelled',
      hotel: {
        _id: 'h3',
        name: 'Mountain Lodge',
        city: 'Denver',
        address: '789 Pine Road, Denver, CO',
        photos: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'],
        rating: 4.3,
        type: 'Cabin',
        distance: '5 km',
        title: 'Cozy Mountain Getaway',
        desc: 'Rustic cabin in the mountains',
        rooms: [],
        cheapestPrice: 199,
        featured: false
      },
      room: {
        _id: 'r3',
        title: 'Standard Room',
        price: 199,
        maxPeople: 2,
        desc: 'Comfortable room with mountain views',
        roomNumbers: [{ number: 305, unavailableDates: [] }],
        isCleaned: true,
        isAssigned: false,
        bookedBy: null
      }
    }
  ];
};

export const mockServices = {
  // Mock version of bookingAPI.getUserBookings
  getUserBookings: async (userId: string): Promise<Booking[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return createMockBookings(userId);
  },
  
  // Mock version of bookingAPI.cancelBooking
  cancelBooking: async (bookingId: string): Promise<Booking> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find the booking from our mock data
    const mockBookings = createMockBookings('any-user-id');
    const booking = mockBookings.find(b => b._id === bookingId);
    
    if (!booking) {
      throw new Error(`Booking with ID ${bookingId} not found`);
    }
    
    // Update the status
    booking.status = 'cancelled';
    
    return booking;
  }
};
