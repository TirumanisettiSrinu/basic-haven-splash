
export interface Hotel {
  _id?: string;
  name: string;
  type: string;
  city: string;
  address: string;
  distance: string;
  photos: string[];
  title: string;
  desc: string;
  rating: number;
  rooms: string[];
  cheapestPrice: number;
  featured: boolean;
}

export interface Room {
  _id?: string;
  title: string;
  price: number;
  maxPeople: number;
  desc: string;
  roomNumbers: RoomNumber[];
  isCleaned: boolean;
  isAssigned: boolean;
  bookedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoomNumber {
  number: number;
  unavailableDates: Date[];
}

export interface User {
  _id?: string;
  username: string;
  email: string;
  country: string;
  img?: string;
  city: string;
  phone?: string;
  password?: string;
  isAdmin: boolean;
  isModerator: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Moderator {
  _id?: string;
  userId: string;
  hotelId: string;
  isActive: boolean;
  permissions: {
    canManageWorkers: boolean;
    canManageRooms: boolean;
    canViewBookings: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Worker {
  _id?: string;
  name: string;
  userId: string;
  hotelId: string;
  role: string;
  email: string;
  phone?: string;
  isActive: boolean;
  assignedRooms: {
    roomId: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Booking {
  _id?: string;
  userId: string;
  hotelId: string;
  roomId: string;
  roomNumber: number;
  dateStart: Date;
  dateEnd: Date;
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt?: Date;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface SearchCriteria {
  city: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  priceRange?: [number, number];
}
