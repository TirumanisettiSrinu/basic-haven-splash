
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Hotels from './pages/Hotels';
import HotelDetail from './pages/HotelDetail';
import UserDashboard from './pages/UserDashboard';
import ModeratorDashboard from './pages/ModeratorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import AuthGuard from './components/AuthGuard';
import './App.css';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from 'sonner';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotels/:id" element={<HotelDetail />} />
        <Route path="/dashboard" element={
          <AuthGuard>
            <UserDashboard />
          </AuthGuard>
        } />
        <Route path="/moderator" element={
          <AuthGuard>
            <ModeratorDashboard />
          </AuthGuard>
        } />
        <Route path="/worker" element={
          <AuthGuard>
            <WorkerDashboard />
          </AuthGuard>
        } />
        <Route path="/admin" element={
          <AuthGuard>
            <AdminDashboard />
          </AuthGuard>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <Sonner position="top-right" closeButton={true} />
    </BrowserRouter>
  );
}

export default App;
