
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { hotelAPI } from '@/services/api';
import { Hotel } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HotelCard from '@/components/HotelCard';
import SearchForm from '@/components/SearchForm';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Hotels = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [searchParams, setSearchParams] = useState({
    city: queryParams.get('city') || '',
    checkIn: null,
    checkOut: null,
    guests: Number(queryParams.get('guests')) || 1,
    minPrice: Number(queryParams.get('minPrice')) || 0,
    maxPrice: Number(queryParams.get('maxPrice')) || 1000
  });

  const { data: allHotels, isLoading, error } = useQuery({
    queryKey: ['hotels'],
    queryFn: hotelAPI.getAllHotels,
  });

  // Filter hotels based on search criteria (primarily city)
  const hotels = allHotels ? allHotels.filter((hotel: Hotel) => {
    if (searchParams.city && hotel.city) {
      return hotel.city.toLowerCase().includes(searchParams.city.toLowerCase());
    }
    return true;
  }) : [];

  useEffect(() => {
    if (error) {
      toast.error('Failed to fetch hotels. Please try again later.');
    }
    
    // Update search params from URL when location changes
    const city = queryParams.get('city');
    const guests = queryParams.get('guests');
    const minPrice = queryParams.get('minPrice');
    const maxPrice = queryParams.get('maxPrice');
    
    if (city || guests || minPrice || maxPrice) {
      setSearchParams({
        city: city || '',
        checkIn: null,
        checkOut: null,
        guests: Number(guests) || 1,
        minPrice: Number(minPrice) || 0,
        maxPrice: Number(maxPrice) || 1000
      });
    }
  }, [error, location.search, queryParams]);

  const handleSearch = (searchCriteria: any) => {
    setSearchParams(searchCriteria);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-hotel-50 py-12 md:py-16">
          <div className="container-custom">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              Find Your Perfect Stay
            </h1>
            <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
              Browse our curated selection of hotels, resorts, and vacation rentals to find the perfect accommodation for your next trip.
            </p>
            
            {/* Search Form */}
            <div className="max-w-4xl mx-auto bg-white p-4 rounded-lg shadow-md">
              <SearchForm onSearch={handleSearch} />
            </div>
          </div>
        </section>
        
        {/* Hotels List */}
        <section className="py-12 md:py-16">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              {searchParams.city 
                ? `Hotels in ${searchParams.city}` 
                : "Available Hotels"}
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-hotel-500" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">Unable to load hotels</p>
                <p className="text-muted-foreground">
                  There was an error fetching the hotels. Please try again later.
                </p>
              </div>
            ) : hotels && hotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((hotel: Hotel) => (
                  <HotelCard key={hotel._id} hotel={hotel} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl font-medium mb-2">No hotels found</p>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or check back later.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Hotels;
