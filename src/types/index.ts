
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
  hotelId?: string; // Reference to the hotel this room belongs to
  hotel?: Hotel; // The actual hotel object for UI convenience
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
  assignedHotels?: string[];
  user?: User; // The actual user object for UI convenience
  hotel?: Hotel; // The actual hotel object for UI convenience
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
  user?: User; // The actual user object for UI convenience
  hotel?: Hotel; // The actual hotel object for UI convenience
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
  status: 'active' | 'cancelled' | 'completed' | 'confirmed';
  createdAt?: Date;
  updatedAt?: Date;
  receipt?: {
    issueDate: Date;
    receiptNumber: string;
  };
  // Add hotel and room objects for convenience in UI
  hotel?: Hotel;
  room?: Room;
  user?: User;
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
