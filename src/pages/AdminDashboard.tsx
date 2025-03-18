
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hotel, Bed, Users, ArrowUpRight, Plus, Edit, Trash } from 'lucide-react';
import { hotelAPI, roomAPI, userAPI } from '@/services/api';
import { toast } from 'sonner';
import { Hotel as HotelType, Room as RoomType, User as UserType } from '@/types';

// Admin Dashboard component with authentication guard
const AdminDashboard = () => {
  const { state } = useAuth();
  const { user } = state;
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch data for dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch hotels, rooms, and users data
        const [hotelsData, usersData] = await Promise.all([
          hotelAPI.getAllHotels(),
          userAPI.getAllUsers()
        ]);
        
        setHotels(hotelsData || []);
        setUsers(usersData || []);
        
        // Create an array to hold all rooms
        let allRooms: RoomType[] = [];
        
        // Fetch rooms for each hotel
        for (const hotel of hotelsData) {
          if (hotel._id) {
            const hotelRooms = await roomAPI.getRoomsForHotel(hotel._id);
            if (hotelRooms && hotelRooms.length > 0) {
              allRooms = [...allRooms, ...hotelRooms];
            }
          }
        }
        
        setRooms(allRooms);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // For demo purposes, create some mock data if no real data exists
  useEffect(() => {
    if (!loading && hotels.length === 0) {
      // Mock hotels
      const mockHotels = [
        {
          _id: 'h1',
          name: 'Grand Hotel',
          type: 'Hotel',
          city: 'New York',
          address: '123 Main St, New York',
          distance: '500m from center',
          photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945'],
          title: 'Luxury Stay in NYC',
          desc: 'Experience the best of New York City at our luxury hotel.',
          rating: 4.8,
          rooms: ['r1', 'r2'],
          cheapestPrice: 199,
          featured: true
        },
        {
          _id: 'h2',
          name: 'Seaside Resort',
          type: 'Resort',
          city: 'Miami',
          address: '456 Ocean Dr, Miami',
          distance: '200m from beach',
          photos: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'],
          title: 'Beach Paradise',
          desc: 'Enjoy the sun and sand at our beautiful beach resort.',
          rating: 4.6,
          rooms: ['r3'],
          cheapestPrice: 299,
          featured: true
        }
      ];
      
      setHotels(mockHotels as HotelType[]);
    }
    
    if (!loading && rooms.length === 0) {
      // Mock rooms
      const mockRooms = [
        {
          _id: 'r1',
          title: 'Deluxe King Room',
          price: 199,
          maxPeople: 2,
          desc: 'Spacious room with king-size bed and city view.',
          roomNumbers: [{ number: 101, unavailableDates: [] }, { number: 102, unavailableDates: [] }],
          isCleaned: true,
          isAssigned: false,
          bookedBy: null
        },
        {
          _id: 'r2',
          title: 'Executive Suite',
          price: 299,
          maxPeople: 3,
          desc: 'Luxury suite with separate living area and panoramic views.',
          roomNumbers: [{ number: 201, unavailableDates: [] }],
          isCleaned: true,
          isAssigned: false,
          bookedBy: null
        },
        {
          _id: 'r3',
          title: 'Ocean View Suite',
          price: 399,
          maxPeople: 4,
          desc: 'Stunning suite with direct ocean views and private balcony.',
          roomNumbers: [{ number: 301, unavailableDates: [] }, { number: 302, unavailableDates: [] }],
          isCleaned: true,
          isAssigned: false,
          bookedBy: null
        }
      ];
      
      setRooms(mockRooms as RoomType[]);
    }
    
    if (!loading && users.length === 0) {
      // Mock users
      const mockUsers = [
        {
          _id: 'u1',
          username: 'johndoe',
          email: 'john@example.com',
          country: 'USA',
          city: 'New York',
          phone: '+1234567890',
          isAdmin: false,
          isModerator: false
        },
        {
          _id: 'u2',
          username: 'janedoe',
          email: 'jane@example.com',
          country: 'Canada',
          city: 'Toronto',
          phone: '+9876543210',
          isAdmin: false,
          isModerator: true
        },
        {
          _id: 'u3',
          username: 'admin',
          email: 'admin@example.com',
          country: 'UK',
          city: 'London',
          phone: '+1122334455',
          isAdmin: true,
          isModerator: false
        }
      ];
      
      setUsers(mockUsers as UserType[]);
    }
  }, [loading, hotels.length, rooms.length, users.length]);
  
  const handleDeleteHotel = async (hotelId: string) => {
    try {
      await hotelAPI.deleteHotel(hotelId);
      setHotels(hotels.filter(hotel => hotel._id !== hotelId));
      toast.success('Hotel deleted successfully');
    } catch (error) {
      console.error('Error deleting hotel:', error);
      toast.error('Failed to delete hotel');
    }
  };
  
  const handleDeleteRoom = async (roomId: string, hotelId: string) => {
    try {
      await roomAPI.deleteRoom(roomId, hotelId);
      setRooms(rooms.filter(room => room._id !== roomId));
      toast.success('Room deleted successfully');
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error('Failed to delete room');
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    try {
      await userAPI.deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };
  
  return (
    <AuthGuard requireAdmin>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow py-12 bg-gray-50">
          <div className="container-custom">
            <header className="mb-8">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage hotels, rooms, and users from one central location
              </p>
            </header>
            
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Hotels
                  </CardTitle>
                  <Hotel className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{hotels.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {hotels.filter(h => h.featured).length} featured
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Rooms
                  </CardTitle>
                  <Bed className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{rooms.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {rooms.reduce((acc, room) => acc + room.roomNumbers.length, 0)} room numbers
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Registered Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {users.filter(u => u.isAdmin).length} admins, 
                    {users.filter(u => u.isModerator).length} moderators
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Dashboard Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="hotels">Hotels</TabsTrigger>
                <TabsTrigger value="rooms">Rooms</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">System Overview</h2>
                <p className="text-muted-foreground">
                  Welcome to the StayHaven admin dashboard. Here you can manage all aspects of your hotel booking system.
                </p>
                
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <Button onClick={() => setActiveTab('hotels')} variant="outline" className="justify-between">
                    <span>Manage Hotels</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => setActiveTab('rooms')} variant="outline" className="justify-between">
                    <span>Manage Rooms</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => setActiveTab('users')} variant="outline" className="justify-between">
                    <span>Manage Users</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              {/* Hotels Tab */}
              <TabsContent value="hotels" className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Hotels</h2>
                  <Button onClick={() => navigate('/admin/hotels/new')} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Hotel
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {hotels.map(hotel => (
                    <Card key={hotel._id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 bg-muted h-40 md:h-auto">
                          {hotel.photos && hotel.photos.length > 0 ? (
                            <img 
                              src={hotel.photos[0]} 
                              alt={hotel.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gray-100">
                              <Hotel className="h-10 w-10 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="p-4 md:w-3/4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg">{hotel.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {hotel.city}, {hotel.address}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => navigate(`/admin/hotels/edit/${hotel._id}`)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteHotel(hotel._id || '')}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm">{hotel.desc}</p>
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <div>
                              <span className="text-sm font-medium">Price: </span>
                              <span className="text-sm">${hotel.cheapestPrice} / night</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium">Rooms: </span>
                              <span className="text-sm">{hotel.rooms?.length || 0}</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium">Rating: </span>
                              <span className="text-sm">{hotel.rating || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Rooms Tab */}
              <TabsContent value="rooms" className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Rooms</h2>
                  <Button onClick={() => navigate('/admin/rooms/new')} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Room
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {rooms.map(room => (
                    <Card key={room._id} className="overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{room.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Max occupancy: {room.maxPeople} people
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => navigate(`/admin/rooms/edit/${room._id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              // Use a hotel ID from mock data for demo
                              onClick={() => handleDeleteRoom(room._id || '', 'h1')}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm">{room.desc}</p>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <div>
                            <span className="text-sm font-medium">Price: </span>
                            <span className="text-sm">${room.price} / night</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Room Numbers: </span>
                            <span className="text-sm">
                              {room.roomNumbers.map(r => r.number).join(', ')}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Status: </span>
                            <span className="text-sm">
                              {room.isCleaned ? 'Cleaned' : 'Needs cleaning'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Users Tab */}
              <TabsContent value="users" className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Users</h2>
                  <Button onClick={() => navigate('/admin/users/new')} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {users.map(user => (
                    <Card key={user._id} className="overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                              {user.img ? (
                                <img 
                                  src={user.img} 
                                  alt={user.username} 
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <Users className="h-5 w-5 text-gray-500" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">{user.username}</h3>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => navigate(`/admin/users/edit/${user._id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteUser(user._id || '')}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                          <div>
                            <span className="text-sm font-medium">Location: </span>
                            <span className="text-sm">{user.city}, {user.country}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Phone: </span>
                            <span className="text-sm">{user.phone || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Role: </span>
                            <span className="text-sm">
                              {user.isAdmin ? 'Admin' : user.isModerator ? 'Moderator' : 'User'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </AuthGuard>
  );
};

export default AdminDashboard;
