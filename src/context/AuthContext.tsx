
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { User, AuthState } from '@/types';
import { authAPI, checkBackendConnection, isMockMode, enableMockMode } from '@/services/api';
import { toast } from 'sonner';

// Define action types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User; mockMode?: boolean }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User; mockMode?: boolean }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'BACKEND_STATUS'; payload: boolean };

// Initial state
const initialState: AuthState & { backendAvailable: boolean | null; mockMode: boolean } = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  backendAvailable: null,
  mockMode: false,
};

// Create context
const AuthContext = createContext<{
  state: typeof initialState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  enableMockMode: () => void;
}>({
  state: initialState,
  dispatch: () => null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  enableMockMode: () => {},
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
        mockMode: !!action.mockMode,
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
        mockMode: false,
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
        mockMode: !action.payload,
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [connectionChecked, setConnectionChecked] = useState(false);

  // Check backend connection status
  useEffect(() => {
    const checkConnection = async () => {
      console.log('Checking backend connection...');
      try {
        const isConnected = await checkBackendConnection();
        dispatch({ type: 'BACKEND_STATUS', payload: isConnected });
        
        if (!isConnected) {
          console.log('Backend connection failed, using mock mode');
          toast.warning(
            'Cannot connect to the backend server. Using demo mode with mock data.',
            { duration: 6000 }
          );
        } else {
          console.log('Backend connection successful');
        }
        
        setConnectionChecked(true);
      } catch (error) {
        console.error('Connection check error:', error);
        dispatch({ type: 'BACKEND_STATUS', payload: false });
        setConnectionChecked(true);
      }
    };
    
    checkConnection();
    // Check connection periodically (every 30 seconds)
    const intervalId = setInterval(checkConnection, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Check if user is logged in when the app loads
  useEffect(() => {
    if (!connectionChecked) return;
    
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCheckingAuth(false);
        return;
      }

      try {
        console.log('Verifying user token...');
        dispatch({ type: 'LOGIN_START' });
        const user = await authAPI.getCurrentUser();
        console.log('User verified:', user);
        
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: user,
          mockMode: isMockMode()
        });
        
        if (isMockMode()) {
          toast.info('You are using demo mode with mock data', { duration: 5000 });
        }
      } catch (error: any) {
        console.error('Token verification failed:', error);
        
        if (error.mockMode) {
          console.log('Using mock authentication');
          // If we're in mock mode, don't remove the token
          dispatch({ 
            type: 'LOGIN_FAILURE', 
            payload: 'Using mock authentication. Some features may be limited.'
          });
        } else {
          // Only remove token if not in mock mode and there's a real error
          localStorage.removeItem('token');
          dispatch({ 
            type: 'LOGIN_FAILURE', 
            payload: error.message || 'Session expired. Please log in again.' 
          });
        }
      } finally {
        setCheckingAuth(false);
      }
    };

    verifyUser();
  }, [connectionChecked]);

  // Login function
  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      console.log('Login attempt for:', email);
      const data = await authAPI.login(email, password);
      console.log('Login successful:', data);
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: data.user,
        mockMode: !!data.mockMode 
      });
      
      if (data.mockMode) {
        toast.info('Logged in using demo mode with mock data. Some features may be limited.');
      } else {
        toast.success('Logged in successfully');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      
      // Handle the case where the backend is unavailable but we have mock data
      if (error.mockMode) {
        toast.warning('Using demo mode with mock data. Login with any of the demo accounts.');
        return;
      }
      
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error.message || 'Failed to login' 
      });
      toast.error(error.message || 'Failed to login');
    }
  };

  // Register function
  const register = async (userData: Partial<User>) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      console.log('Registration attempt for:', userData.email);
      const data = await authAPI.register(userData);
      console.log('Registration successful:', data);
      
      dispatch({ 
        type: 'REGISTER_SUCCESS', 
        payload: data.user,
        mockMode: !!data.mockMode 
      });
      
      if (data.mockMode) {
        toast.info('Registered in demo mode with mock data. Some features may be limited.');
      } else {
        toast.success('Registered successfully');
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      // Handle the case where the backend is unavailable but we have mock data
      if (error.mockMode) {
        toast.warning('Using demo mode with mock data');
        return;
      }
      
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
  
  // Function to explicitly enable mock mode
  const handleEnableMockMode = () => {
    enableMockMode();
    dispatch({ type: 'BACKEND_STATUS', payload: false });
    toast.info('Demo mode enabled with mock data');
  };

  // Show loading indicator while checking authentication status
  if (checkingAuth && connectionChecked) {
    // Can return a loading indicator here if needed
    console.log('Checking authentication status...');
  }

  return (
    <AuthContext.Provider value={{ 
      state, 
      dispatch, 
      login, 
      register, 
      logout,
      enableMockMode: handleEnableMockMode
    }}>
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
