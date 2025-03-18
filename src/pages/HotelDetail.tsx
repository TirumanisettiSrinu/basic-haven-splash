
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { hotelAPI, roomAPI } from '@/services/api';
import { Hotel, Room } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RoomCard from '@/components/RoomCard';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Star, MapPin, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const HotelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('rooms');
  
  // Fetch hotel details
  const { 
    data: hotel, 
    isLoading: hotelLoading, 
    error: hotelError 
  } = useQuery({
    queryKey: ['hotel', id],
    queryFn: () => hotelAPI.getHotelById(id!),
    enabled: !!id,
  });
  
  // Fetch rooms for this hotel
  const { 
    data: rooms, 
    isLoading: roomsLoading, 
    error: roomsError 
  } = useQuery({
    queryKey: ['rooms', id],
    queryFn: () => roomAPI.getRoomsForHotel(id!),
    enabled: !!id,
  });
  
  const isLoading = hotelLoading || roomsLoading;
  const error = hotelError || roomsError;
  
  useEffect(() => {
    if (error) {
      toast.error('Failed to load hotel details. Please try again later.');
    }
  }, [error]);
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16 md:pt-20 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-hotel-500" />
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !hotel) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16 md:pt-20">
          <div className="container-custom py-12 text-center">
            <Info className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Hotel Not Found</h1>
            <p className="text-muted-foreground mb-8">
              We couldn't find the hotel you're looking for. It may have been removed or there's a temporary issue.
            </p>
            <Link to="/hotels">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Hotels
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20">
        {/* Hotel Header */}
        <div className="relative h-64 md:h-96 bg-gray-200 overflow-hidden">
          <img 
            src={hotel.photos?.[0] || "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3"} 
            alt={hotel.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="container-custom">
              <Link to="/hotels" className="inline-flex items-center text-white mb-4 hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Hotels
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold">{hotel.name}</h1>
              <div className="flex items-center mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{hotel.address}, {hotel.city}</span>
                <Badge variant="secondary" className="ml-4">
                  {hotel.type}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Hotel Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="flex items-center bg-hotel-100 text-hotel-800 px-2 py-1 rounded">
                    <Star className="h-4 w-4 fill-hotel-500 text-hotel-500 mr-1" />
                    <span className="font-medium">{hotel.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground ml-2">• {hotel.distance} from center</span>
                </div>
                <span className="text-xl font-bold text-hotel-700">
                  From ${hotel.cheapestPrice}/night
                </span>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="rooms">Rooms</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>
                
                <TabsContent value="rooms" className="animate-in fade-in-50">
                  <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>
                  
                  {roomsLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-hotel-500" />
                    </div>
                  ) : rooms && rooms.length > 0 ? (
                    <div className="space-y-6">
                      {rooms.map((room: Room) => (
                        <RoomCard key={room._id} room={room} hotelId={hotel._id} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <p className="text-lg font-medium mb-2">No rooms available</p>
                      <p className="text-muted-foreground">
                        There are currently no rooms available for this hotel.
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="details" className="animate-in fade-in-50">
                  <h2 className="text-2xl font-bold mb-4">Hotel Details</h2>
                  
                  <div className="prose max-w-none">
                    <p className="text-lg mb-6">{hotel.desc}</p>
                    
                    <h3 className="text-xl font-semibold mb-3">Features & Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 mb-6">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-hotel-500 rounded-full mr-2"></div>
                        <span>Free WiFi</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-hotel-500 rounded-full mr-2"></div>
                        <span>Air Conditioning</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-hotel-500 rounded-full mr-2"></div>
                        <span>Room Service</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-hotel-500 rounded-full mr-2"></div>
                        <span>Restaurant</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-hotel-500 rounded-full mr-2"></div>
                        <span>Swimming Pool</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-hotel-500 rounded-full mr-2"></div>
                        <span>Fitness Center</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3">Hotel Policies</h3>
                    <ul className="mb-6">
                      <li>Check-in time: 3:00 PM</li>
                      <li>Check-out time: 12:00 PM</li>
                      <li>Pets: Not allowed</li>
                      <li>Cancellation: Varies by room type</li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="location" className="animate-in fade-in-50">
                  <h2 className="text-2xl font-bold mb-4">Location</h2>
                  
                  <div className="aspect-video bg-gray-200 rounded-lg mb-6 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <div className="text-center p-6">
                        <MapPin className="h-8 w-8 mx-auto mb-2 text-hotel-500" />
                        <h3 className="font-medium text-lg mb-1">Map View</h3>
                        <p className="text-muted-foreground text-sm">
                          {hotel.address}, {hotel.city}
                        </p>
                        <p className="text-muted-foreground text-sm mt-4">
                          {hotel.distance} from city center
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">Getting There</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="font-medium">From the Airport</div>
                      <p className="text-muted-foreground">
                        Take a taxi or rideshare service directly to the hotel (approximately 30 minutes).
                      </p>
                    </div>
                    <div>
                      <div className="font-medium">Public Transportation</div>
                      <p className="text-muted-foreground">
                        The nearest metro station is a 5-minute walk from the hotel.
                      </p>
                    </div>
                    <div>
                      <div className="font-medium">Parking</div>
                      <p className="text-muted-foreground">
                        Valet parking is available for $25 per day.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right Column - Photos & Booking */}
            <div>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Gallery</h3>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {hotel.photos && hotel.photos.length > 0 ? (
                    hotel.photos.slice(0, 4).map((photo: string, index: number) => (
                      <div key={index} className="aspect-square rounded overflow-hidden">
                        <img 
                          src={photo} 
                          alt={`${hotel.name} - ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    // Placeholder images if no photos available
                    Array(4).fill(0).map((_, index) => (
                      <div key={index} className="aspect-square bg-gray-200 rounded"></div>
                    ))
                  )}
                </div>
                
                <Button variant="outline" className="w-full">View All Photos</Button>
              </div>
              
              <div className="bg-hotel-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Reserve Your Stay</h3>
                <p className="text-muted-foreground mb-6">
                  Select your room type and dates to check availability and book your stay.
                </p>
                
                <Link to={`/hotels/${hotel._id}/book`}>
                  <Button className="w-full bg-hotel-500 hover:bg-hotel-600">Book Now</Button>
                </Link>
                
                <Separator className="my-6" />
                
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">Need help with your booking?</p>
                  <p className="font-medium text-foreground">Call us at: (123) 456-7890</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HotelDetail;
