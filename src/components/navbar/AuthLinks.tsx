
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogOut, ShieldCheck, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AuthLinksProps {
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthLinks = ({ isAuthenticated, logout }: AuthLinksProps) => {
  const { state } = useAuth();
  const { user } = state;
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to homepage after logout
  };
  
  if (isAuthenticated) {
    return (
      <>
        {user?.isAdmin && (
          <Link to="/admin">
            <Button variant="outline" size="sm" className="btn-transition hover:text-hotel-500">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Admin
            </Button>
          </Link>
        )}
        
        {user?.isModerator && !user?.isAdmin && (
          <Link to="/moderator">
            <Button variant="outline" size="sm" className="btn-transition hover:text-hotel-500">
              <Shield className="h-4 w-4 mr-2" />
              Moderator
            </Button>
          </Link>
        )}
        
        <Link to="/dashboard">
          <Button variant="outline" size="sm" className="btn-transition hover:text-hotel-500">
            <User className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </Link>
        
        <Button variant="ghost" size="sm" onClick={handleLogout} className="btn-transition">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </>
    );
  }
  
  return (
    <>
      <Link to="/login">
        <Button variant="ghost" size="sm" className="btn-transition">
          Login
        </Button>
      </Link>
      <Link to="/register">
        <Button variant="default" size="sm" className="bg-hotel-500 hover:bg-hotel-600 btn-transition">
          Sign Up
        </Button>
      </Link>
    </>
  );
};

export default AuthLinks;
