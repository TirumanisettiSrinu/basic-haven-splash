
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'sonner';

// Initial state for the auth context
const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

// Create the auth context
const AuthContext = createContext();

// Auth reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
        isAuthenticated: true
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        loading: false,
        error: action.payload,
        isAuthenticated: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
    default:
      return state;
  }
};

// Create the auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for stored auth on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const user = JSON.parse(storedUser);
          
          // For demo purposes, we'll consider the user authenticated if there's a stored user
          dispatch({ 
            type: 'LOGIN_SUCCESS', 
            payload: user 
          });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('user');
      }
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Mock API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, we'll create a mock user based on the credentials
      const user = {
        _id: 'user123',
        username: credentials.username,
        email: `${credentials.username}@example.com`,
        country: 'United States',
        city: 'New York',
        isAdmin: credentials.username === 'admin',
        isModerator: ['admin', 'mod'].includes(credentials.username)
      };
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      toast.success('Login successful');
      
      return user;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Mock API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, we'll create a mock user based on the user data
      const user = {
        _id: 'user' + Date.now(),
        ...userData,
        isAdmin: false,
        isModerator: false
      };
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      toast.success('Registration successful');
      
      return user;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  // Update user function
  const updateUser = (userData) => {
    try {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      dispatch({ type: 'UPDATE_USER', payload: userData });
      toast.success('Profile updated successfully');
      
      return updatedUser;
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
