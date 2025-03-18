
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hotelAPI } from '@/services/api';
import { Hotel } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HotelCard from '@/components/HotelCard';
import SearchForm from '@/components/SearchForm';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Hotels = () => {
  const [searchParams, setSearchParams] = useState({
    city: '',
    checkIn: null,
    checkOut: null,
    guests: 1
  });

  const { data: hotels, isLoading, error } = useQuery({
    queryKey: ['hotels'],
    queryFn: hotelAPI.getAllHotels,
  });

  useEffect(() => {
    if (error) {
      toast.error('Failed to fetch hotels. Please try again later.');
    }
  }, [error]);

  const handleSearch = (searchCriteria: any) => {
    setSearchParams(searchCriteria);
    // In a full implementation, this would trigger a filtered search
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
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Available Hotels</h2>
            
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
