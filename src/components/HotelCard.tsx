
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hotel } from '@/types';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HotelCardProps {
  hotel: Hotel;
  className?: string;
  featured?: boolean;
}

const HotelCard = ({ hotel, className, featured = false }: HotelCardProps) => {
  const [isLoading, setIsLoading] = useState(true);

  // Function to handle image loading
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div 
      className={cn(
        "group rounded-lg overflow-hidden border border-border hover:shadow-md transition-all duration-300 bg-white hover:shadow-lg hover-lift",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse"></div>
        )}
        
        <img
          src={hotel.photos[0] || '/placeholder.svg'}
          alt={hotel.name}
          className={cn(
            "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={handleImageLoad}
        />
        
        {featured && (
          <Badge className="absolute top-3 left-3 bg-hotel-500 hover:bg-hotel-600">
            Featured
          </Badge>
        )}

        {hotel.rating > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
            <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
            <span>{hotel.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Name */}
        <h3 className="font-semibold text-lg text-foreground line-clamp-1">{hotel.name}</h3>
        
        {/* Location */}
        <div className="flex items-center text-muted-foreground text-sm">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="line-clamp-1">{hotel.city}</span>
        </div>
        
        {/* Description - Optional */}
        {!featured && (
          <p className="text-muted-foreground text-sm line-clamp-2 mt-2">
            {hotel.desc}
          </p>
        )}
        
        {/* Price and Button */}
        <div className="pt-3 flex items-center justify-between">
          <div>
            <span className="font-medium text-lg">${hotel.cheapestPrice}</span>
            <span className="text-muted-foreground text-sm"> / night</span>
          </div>
          
          <Link to={`/hotels/${hotel._id}`}>
            <Button variant="ghost" size="sm" className="text-hotel-500 hover:text-hotel-600 hover:bg-hotel-50 p-0 h-auto">
              View details
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
