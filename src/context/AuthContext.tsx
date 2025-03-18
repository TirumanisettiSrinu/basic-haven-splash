
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { User, AuthState } from '@/types';
import { authAPI, checkBackendConnection } from '@/services/api';
import { toast } from 'sonner';

// Define action types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'BACKEND_STATUS'; payload: boolean };

// Initial state
const initialState: AuthState & { backendAvailable: boolean | null } = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  backendAvailable: null,
};

// Create context
const AuthContext = createContext<{
  state: typeof initialState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
}>({
  state: initialState,
  dispatch: () => null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// Reducer function
const authReducer = (state: typeof initialState, action: AuthAction): typeof initialState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
        isAuthenticated: true,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'BACKEND_STATUS':
      return {
        ...state,
        backendAvailable: action.payload,
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check backend connection status
  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await checkBackendConnection();
      dispatch({ type: 'BACKEND_STATUS', payload: isConnected });
      
      if (!isConnected) {
        toast.error(
          'Cannot connect to the backend server. Please ensure it is running at http://localhost:8000',
          { duration: 6000 }
        );
      }
    };
    
    checkConnection();
    // Check connection periodically
    const intervalId = setInterval(checkConnection, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Check if user is logged in when the app loads
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        dispatch({ type: 'LOGIN_START' });
        const user = await authAPI.getCurrentUser();
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error: any) {
        localStorage.removeItem('token');
        dispatch({ 
          type: 'LOGIN_FAILURE', 
          payload: error.message || 'Session expired. Please log in again.' 
        });
      }
    };

    if (state.backendAvailable) {
      verifyUser();
    }
  }, [state.backendAvailable]);

  // Login function
  const login = async (email: string, password: string) => {
    if (!state.backendAvailable) {
      toast.error('Cannot connect to the backend server. Please ensure it is running.');
      return;
    }
    
    dispatch({ type: 'LOGIN_START' });
    try {
      const data = await authAPI.login(email, password);
      dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
      toast.success('Logged in successfully');
    } catch (error: any) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error.message || 'Failed to login' 
      });
      toast.error(error.message || 'Failed to login');
    }
  };

  // Register function
  const register = async (userData: Partial<User>) => {
    if (!state.backendAvailable) {
      toast.error('Cannot connect to the backend server. Please ensure it is running at http://localhost:8000');
      return;
    }
    
    dispatch({ type: 'REGISTER_START' });
    try {
      const data = await authAPI.register(userData);
      dispatch({ type: 'REGISTER_SUCCESS', payload: data.user });
      toast.success('Registered successfully');
    } catch (error: any) {
      dispatch({ 
        type: 'REGISTER_FAILURE', 
        payload: error.message || 'Failed to register' 
      });
      toast.error(error.message || 'Failed to register');
    }
  };

  // Logout function
  const logout = () => {
    authAPI.logout();
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
