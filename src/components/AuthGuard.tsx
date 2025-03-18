
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireModerator?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAdmin = false,
  requireModerator = false 
}) => {
  const { state } = useAuth();
  const { isAuthenticated, user } = state;
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to access this page");
    } else if (requireAdmin && !user?.isAdmin) {
      toast.error("You don't have admin privileges to access this page");
    } else if (requireModerator && !user?.isModerator && !user?.isAdmin) {
      toast.error("You don't have moderator privileges to access this page");
    }
  }, [isAuthenticated, requireAdmin, requireModerator, user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireModerator && !user?.isModerator && !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
