import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hotelAPI } from '@/services/api';
import { Hotel } from '@/types';
import { Hotel as HotelIcon, Search, MapPin, Star, Calendar, CreditCard } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchForm from '@/components/SearchForm';
import HotelCard from '@/components/HotelCard';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  const [featuredHotels, setFeaturedHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedHotels = async () => {
      try {
        // For demo purposes, use getAllHotels and filter on client
        const response = await hotelAPI.getAllHotels();
        setFeaturedHotels(
          response.slice(0, 6).map((hotel: any) => ({
            ...hotel,
            // Using temporary image data since we don't have a real API
            photos: [
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
              'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
              'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
            ]
          }))
        );
      } catch (error) {
        console.error('Error fetching hotels:', error);
        // Use mock data for demo
        setFeaturedHotels([
          {
            _id: '1',
            name: 'Grand Plaza Hotel',
            type: 'Hotel',
            city: 'New York',
            address: '123 Broadway, New York, NY',
            distance: '500m from center',
            photos: [
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
            ],
            title: 'Experience Luxury in the Heart of Manhattan',
            desc: 'Enjoy panoramic views of the city skyline from our rooftop pool and bar.',
            rating: 4.8,
            rooms: ['101', '102', '103'],
            cheapestPrice: 299,
            featured: true
          },
          {
            _id: '2',
            name: 'Seaside Resort',
            type: 'Resort',
            city: 'Miami',
            address: '555 Ocean Drive, Miami, FL',
            distance: '100m from beach',
            photos: [
              'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
            ],
            title: 'Beachfront Paradise with Private Access',
            desc: 'Wake up to the sound of waves in our luxurious beachfront resort with private beach access.',
            rating: 4.6,
            rooms: ['201', '202', '203'],
            cheapestPrice: 349,
            featured: true
          },
          {
            _id: '3',
            name: 'Mountain View Lodge',
            type: 'Lodge',
            city: 'Aspen',
            address: '789 Mountain Rd, Aspen, CO',
            distance: '2km from ski lifts',
            photos: [
              'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
            ],
            title: 'Cozy Retreat in the Mountains',
            desc: 'Relax by the fireplace after a day on the slopes in our rustic mountain lodge.',
            rating: 4.7,
            rooms: ['301', '302', '303'],
            cheapestPrice: 279,
            featured: true
          },
          {
            _id: '4',
            name: 'Urban Boutique Hotel',
            type: 'Boutique',
            city: 'San Francisco',
            address: '456 Market St, San Francisco, CA',
            distance: '300m from center',
            photos: [
              'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
            ],
            title: 'Stylish Stay in the Heart of San Francisco',
            desc: 'Experience our designer boutique hotel with unique art pieces and locally sourced amenities.',
            rating: 4.5,
            rooms: ['401', '402', '403'],
            cheapestPrice: 249,
            featured: true
          },
          {
            _id: '5',
            name: 'Desert Oasis Resort',
            type: 'Resort',
            city: 'Phoenix',
            address: '789 Desert Blvd, Phoenix, AZ',
            distance: '5km from center',
            photos: [
              'https://images.unsplash.com/photo-1586611292717-f828b167408c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
            ],
            title: 'Luxury Desert Retreat with Spa',
            desc: 'Escape to our desert oasis featuring a world-class spa and golf course.',
            rating: 4.9,
            rooms: ['501', '502', '503'],
            cheapestPrice: 329,
            featured: true
          },
          {
            _id: '6',
            name: 'Historic Downtown Inn',
            type: 'Inn',
            city: 'Charleston',
            address: '123 King St, Charleston, SC',
            distance: '200m from center',
            photos: [
              'https://images.unsplash.com/photo-1529290130-4ca3753253ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1476&q=80'
            ],
            title: 'Charming Inn in Historic District',
            desc: 'Stay in our beautifully restored 19th century building with period furnishings.',
            rating: 4.7,
            rooms: ['601', '602', '603'],
            cheapestPrice: 219,
            featured: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedHotels();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-r from-hotel-50 to-blue-50">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-10 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-4 text-balance">
              Find Your Perfect Stay with StayHaven
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Discover luxury accommodations tailored to your preferences
            </p>
            <div className="bg-white shadow-lg rounded-lg p-5 mx-auto max-w-4xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <SearchForm />
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">Why Choose StayHaven</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the perfect blend of comfort, luxury, and convenience with our handpicked selection of accommodations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg border border-border hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-hotel-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-hotel-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Easy Booking</h3>
              <p className="text-muted-foreground">
                Simple and intuitive booking process that lets you secure your stay in minutes
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg border border-border hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-hotel-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-hotel-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Prime Locations</h3>
              <p className="text-muted-foreground">
                Carefully selected properties in prime locations close to attractions and conveniences
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg border border-border hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-hotel-100 rounded-full flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-hotel-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Verified Quality</h3>
              <p className="text-muted-foreground">
                All properties are personally vetted to ensure they meet our high standards of quality
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Hotels Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-semibold mb-4">Featured Properties</h2>
              <p className="text-muted-foreground max-w-2xl">
                Explore our handpicked selection of stunning accommodations in popular destinations
              </p>
            </div>
            <Button 
              onClick={() => navigate('/hotels')}
              variant="outline" 
              className="mt-4 md:mt-0"
            >
              View All Hotels
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div 
                  key={item} 
                  className="rounded-lg overflow-hidden border border-border"
                >
                  <div className="aspect-[16/9] bg-muted animate-pulse"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
                    <div className="pt-3 flex items-center justify-between">
                      <div className="h-6 bg-muted rounded w-1/3 animate-pulse"></div>
                      <div className="h-6 bg-muted rounded w-1/4 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredHotels.map((hotel, index) => (
                <HotelCard 
                  key={hotel._id} 
                  hotel={hotel} 
                  featured={true} 
                  className={`animate-fade-in-up`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Booking your perfect stay is simple and straightforward with our easy process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative text-center p-6">
              <div className="w-16 h-16 bg-hotel-500 text-white rounded-full flex items-center justify-center text-2xl font-semibold mx-auto mb-6">1</div>
              <Search className="h-8 w-8 text-hotel-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Search</h3>
              <p className="text-muted-foreground">
                Find the perfect accommodation by searching based on your preferences and needs
              </p>
              
              {/* Connector Line (visible on larger screens) */}
              <div className="hidden md:block absolute top-1/4 left-full w-full h-0.5 bg-hotel-200 -translate-x-1/2 z-0"></div>
            </div>
            
            {/* Step 2 */}
            <div className="relative text-center p-6">
              <div className="w-16 h-16 bg-hotel-500 text-white rounded-full flex items-center justify-center text-2xl font-semibold mx-auto mb-6">2</div>
              <Calendar className="h-8 w-8 text-hotel-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Book</h3>
              <p className="text-muted-foreground">
                Select your dates and room preferences, then complete your booking in minutes
              </p>
              
              {/* Connector Line (visible on larger screens) */}
              <div className="hidden md:block absolute top-1/4 left-full w-full h-0.5 bg-hotel-200 -translate-x-1/2 z-0"></div>
            </div>
            
            {/* Step 3 */}
            <div className="relative text-center p-6">
              <div className="w-16 h-16 bg-hotel-500 text-white rounded-full flex items-center justify-center text-2xl font-semibold mx-auto mb-6">3</div>
              <CreditCard className="h-8 w-8 text-hotel-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Enjoy</h3>
              <p className="text-muted-foreground">
                Receive instant confirmation and get ready to enjoy your perfect stay
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-hotel-600 text-white">
        <div className="container-custom text-center">
          <HotelIcon className="h-12 w-12 mx-auto mb-6 text-white/80" />
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Ready to Find Your Perfect Stay?</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Join thousands of satisfied travelers who found their ideal accommodations with StayHaven
          </p>
          <Button 
            onClick={() => navigate('/hotels')}
            size="lg"
            className="bg-white text-hotel-600 hover:bg-white/90"
          >
            Browse Hotels
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
