
import { Link } from 'react-router-dom';
import { Hotel } from 'lucide-react';

const Logo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center space-x-2 text-hotel-600 transition-opacity hover:opacity-80"
    >
      <Hotel className="h-6 w-6 md:h-8 md:w-8" />
      <span className="text-xl md:text-2xl font-semibold">StayHaven</span>
    </Link>
  );
};

export default Logo;
