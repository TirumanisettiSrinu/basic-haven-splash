import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ModeratorDashboard from "./pages/ModeratorDashboard";
import NotFound from "./pages/NotFound";
import Hotels from "./pages/Hotels";
import HotelDetail from "./pages/HotelDetail";
import Pricing from "./pages/Pricing";
import About from "./pages/About";

// Import missing but needed modules
import axios from "axios";
import React from 'react';

// Create a query client - move inside the component to fix hooks error
const App = () => {
  // Create a query client inside the component
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  // Mock API for development
  const setupMockAPI = () => {
    axios.interceptors.request.use(
      async (config) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock successful response based on endpoint
        console.log("API Request:", config.url);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  };

  // Initialize mock API in development environment
  React.useEffect(() => {
    setupMockAPI();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/moderator" element={<ModeratorDashboard />} />
              
              {/* Hotel routes */}
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotels/:id" element={<HotelDetail />} />
              
              {/* Other routes */}
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
