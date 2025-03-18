import axios from 'axios';
import { Hotel, Room, User, Booking, SearchCriteria, Worker, Moderator } from '@/types';

// Create an axios instance with the base URL
const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add a request interceptor to add the authorization token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to handle API errors
const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  if (error.code === 'ERR_NETWORK') {
    console.error('Network error: Cannot connect to the backend server');
    return { 
      error: true,
      message: 'Cannot connect to the server. Please ensure the backend server is running at ' + API_URL
    };
  }
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Response error:', error.response.data);
    return { 
      error: true,
      message: error.response.data?.message || 'Server error',
      status: error.response.status
    };
  } else if (error.request) {
    // The request was made but no response was received
    console.error('Request error:', error.request);
    return { 
      error: true,
      message: 'No response from server. Please try again later.',
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error message:', error.message);
    return { 
      error: true,
      message: error.message || 'An unknown error occurred',
    };
  }
};

// Authentication with redirect to homepage on logout
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email });
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        return response.data;
      } else {
        throw new Error('Invalid response format: missing token');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw handleApiError(error);
    }
  },
  
  register: async (userData: Partial<User>) => {
    try {
      console.log('Attempting registration with:', { ...userData, password: '***' });
      const response = await api.post('/auth/register', userData);
      console.log('Register response:', response.data);
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        return response.data;
      } else {
        throw new Error('Invalid response format: missing token');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw handleApiError(error);
    }
  },
  
  logout: () => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    // Redirect to homepage when logging out
    window.location.href = '/';
  },
  
  getCurrentUser: async () => {
    try {
      console.log('Fetching current user');
      const response = await api.get('/auth/me');
      console.log('Current user response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw handleApiError(error);
    }
  },
};

// Workers API
export const workerAPI = {
  getAllWorkers: async () => {
    try {
      const response = await api.get('/workers');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getWorkerById: async (id: string) => {
    try {
      const response = await api.get(`/workers/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  createWorker: async (workerData: Partial<Worker>) => {
    try {
      const response = await api.post('/workers', workerData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  updateWorker: async (id: string, workerData: Partial<Worker>) => {
    try {
      const response = await api.put(`/workers/${id}`, workerData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  deleteWorker: async (id: string) => {
    try {
      const response = await api.delete(`/workers/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  markRoomAsCleaned: async (workerId: string, roomId: string) => {
    try {
      const response = await api.put(`/workers/${workerId}/rooms/${roomId}/clean`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Moderators
export const moderatorAPI = {
  getAllModerators: async () => {
    try {
      const response = await api.get('/moderators');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getModeratorById: async (id: string) => {
    try {
      const response = await api.get(`/moderators/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  createModerator: async (moderatorData: any) => {
    try {
      const response = await api.post('/moderators', moderatorData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  updateModerator: async (id: string, moderatorData: any) => {
    try {
      const response = await api.put(`/moderators/${id}`, moderatorData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  deleteModerator: async (id: string) => {
    try {
      const response = await api.delete(`/moderators/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Hotels with enhanced search and price filtering
export const hotelAPI = {
  getAllHotels: async () => {
    try {
      const response = await api.get('/hotels');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getHotelById: async (id: string) => {
    try {
      const response = await api.get(`/hotels/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  searchHotels: async (criteria: SearchCriteria) => {
    try {
      const response = await api.post('/hotels/search', criteria);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getFeaturedHotels: async () => {
    try {
      const response = await api.get('/hotels/featured');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  createHotel: async (hotelData: Partial<Hotel>) => {
    try {
      const response = await api.post('/hotels', hotelData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  updateHotel: async (id: string, hotelData: Partial<Hotel>) => {
    try {
      const response = await api.put(`/hotels/${id}`, hotelData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  deleteHotel: async (id: string) => {
    try {
      const response = await api.delete(`/hotels/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Rooms with enhanced booking functionality
export const roomAPI = {
  getRoomsForHotel: async (hotelId: string) => {
    try {
      const response = await api.get(`/rooms/hotel/${hotelId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getRoomById: async (id: string) => {
    try {
      const response = await api.get(`/rooms/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  createRoom: async (hotelId: string, roomData: Partial<Room>) => {
    try {
      const response = await api.post(`/rooms/${hotelId}`, roomData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  updateRoom: async (id: string, roomData: Partial<Room>) => {
    try {
      const response = await api.put(`/rooms/${id}`, roomData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  deleteRoom: async (id: string, hotelId: string) => {
    try {
      const response = await api.delete(`/rooms/${id}/${hotelId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  checkRoomAvailability: async (roomId: string, dateStart: Date, dateEnd: Date) => {
    try {
      const response = await api.get(`/rooms/availability/${roomId}`, {
        params: { dateStart, dateEnd },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  toggleRoomCleaningStatus: async (roomId: string, isCleaned: boolean) => {
    try {
      const response = await api.put(`/rooms/${roomId}`, { 
        isCleaned,
        needsCleaning: !isCleaned
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Bookings with cancellation functionality
export const bookingAPI = {
  getUserBookings: async (userId: string) => {
    try {
      const response = await api.get(`/bookings/user/${userId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  createBooking: async (bookingData: Partial<Booking>) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  cancelBooking: async (id: string) => {
    try {
      const response = await api.put(`/bookings/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getAllBookings: async (hotelId?: string) => {
    try {
      const url = hotelId ? `/bookings/hotel/${hotelId}` : '/bookings';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getBookingReceipt: async (id: string) => {
    try {
      const response = await api.get(`/bookings/${id}/receipt`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  updateBooking: async (id: string, bookingData: Partial<Booking>) => {
    try {
      const response = await api.put(`/bookings/${id}`, bookingData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  deleteBooking: async (id: string) => {
    try {
      const response = await api.delete(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getBookingById: async (id: string) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Users
export const userAPI = {
  getUserById: async (id: string) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  updateUser: async (id: string, userData: Partial<User>) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  deleteUser: async (id: string) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  createUser: async (userData: Partial<User>) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Check if the backend is available
export const checkBackendConnection = async () => {
  try {
    await api.get('/health-check', { timeout: 3000 });
    return true;
  } catch (error) {
    console.error('Backend connection check failed:', error);
    return false;
  }
};

export default api;

