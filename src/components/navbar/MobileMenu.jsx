
import { Link } from 'react-router-dom';
import { Home, Search, Calendar, Settings, User, LogOut } from 'lucide-react';
import NavLink from './NavLink';

const MobileMenu = ({ isAuthenticated, logout }) => {
  return (
    <div className="md:hidden bg-white/80 backdrop-blur-md">
      <div className="container py-4 flex flex-col space-y-4 animate-fade-in-down">
        <NavLink to="/" mobileView icon={<Home className="h-4 w-4 mr-3 text-hotel-500" />}>
          Home
        </NavLink>
        <NavLink to="/hotels" mobileView icon={<Search className="h-4 w-4 mr-3 text-hotel-500" />}>
          Hotels
        </NavLink>
        <NavLink to="/pricing" mobileView icon={<Calendar className="h-4 w-4 mr-3 text-hotel-500" />}>
          Pricing
        </NavLink>
        <NavLink to="/about" mobileView icon={<Settings className="h-4 w-4 mr-3 text-hotel-500" />}>
          About
        </NavLink>

        <div className="pt-2 border-t border-gray-200">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center p-2 rounded-md hover:bg-hotel-50"
              >
                <User className="h-4 w-4 mr-3 text-hotel-500" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center p-2 rounded-md hover:bg-hotel-50 text-left"
              >
                <LogOut className="h-4 w-4 mr-3 text-hotel-500" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block p-2 rounded-md hover:bg-hotel-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block p-2 mt-2 text-center rounded-md bg-hotel-500 text-white hover:bg-hotel-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
