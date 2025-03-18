
import { Link, useLocation } from 'react-router-dom';
import React from 'react';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  mobileView?: boolean;
  icon?: React.ReactNode;
}

const NavLink = ({ to, children, mobileView = false, icon, className = '' }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
    (to !== '/' && location.pathname.startsWith(to));
    
  if (mobileView) {
    return (
      <Link
        to={to}
        className="flex items-center p-2 rounded-md hover:bg-hotel-50"
      >
        {icon}
        <span>{children}</span>
      </Link>
    );
  }
  
  return (
    <Link 
      to={to} 
      className={`text-sm font-medium btn-transition hover:text-hotel-500 ${
        isActive ? 'text-hotel-500' : 'text-foreground'
      } ${className}`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
