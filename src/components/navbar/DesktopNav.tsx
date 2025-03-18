
import NavLink from './NavLink';

const DesktopNav = () => {
  return (
    <nav className="hidden md:flex items-center space-x-8">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/hotels">Hotels</NavLink>
      <NavLink to="/pricing">Pricing</NavLink>
      <NavLink to="/about">About</NavLink>
    </nav>
  );
};

export default DesktopNav;
