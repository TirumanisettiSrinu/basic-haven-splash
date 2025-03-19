
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { userAPI, hotelAPI, roomAPI, bookingAPI } from '@/services/api';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  User,
  HelpCircle,
  FileText,
  PlusCircle,
  Hotel,
  Trash,
  Edit,
  Info,
  Eye,
  Bed,
  Calendar,
  MapPin,
  Star
} from 'lucide-react';

const AdminDashboard = () => {
  const { state } = useAuth();
  const { user } = state;
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // User editing state
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [userFormData, setUserFormData] = useState({
    username: '',
    email: '',
    country: '',
    city: '',
    phone: '',
    isAdmin: false,
    isModerator: false
  });
  
  // Hotel editing state
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isHotelDialogOpen, setIsHotelDialogOpen] = useState(false);
  const [hotelFormData, setHotelFormData] = useState({
    name: '',
    type: 'Hotel',
    city: '',
    address: '',
    distance: '',
    photos: [],
    title: '',
    desc: '',
    rating: 0,
    cheapestPrice: 0,
    featured: false
  });
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  
  // Hotel details state
  const [isHotelDetailsOpen, setIsHotelDetailsOpen] = useState(false);
  const [detailsHotel, setDetailsHotel] = useState(null);
  const [hotelRooms, setHotelRooms] = useState([]);
  
  // Initial data load
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [usersData, hotelsData, bookingsData, roomsData] = await Promise.all([
          userAPI.getAllUsers(),
          hotelAPI.getAllHotels(),
          bookingAPI.getAllBookings(),
          roomAPI.getAllRooms(),
        ]);
        
        setUsers(usersData || []);
        setHotels(hotelsData || []);
        setBookings(bookingsData || []);
        setRooms(roomsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // User management functions
  const handleUserInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setUserFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserFormData({
      username: user.username,
      email: user.email,
      country: user.country || '',
      city: user.city || '',
      phone: user.phone || '',
      isAdmin: user.isAdmin || false,
      isModerator: user.isModerator || false
    });
    setIsUserDialogOpen(true);
  };
  
  const handleAddUser = () => {
    setSelectedUser(null);
    setUserFormData({
      username: '',
      email: '',
      country: '',
      city: '',
      phone: '',
      password: '',
      isAdmin: false,
      isModerator: false
    });
    setIsUserDialogOpen(true);
  };
  
  const handleSubmitUserForm = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedUser) {
        const updatedUser = await userAPI.updateUser(selectedUser._id, userFormData);
        setUsers(users.map(u => u._id === selectedUser._id ? updatedUser : u));
        toast.success('User updated successfully');
      } else {
        const newUser = await userAPI.createUser(userFormData);
        setUsers([...users, newUser]);
        toast.success('User added successfully');
      }
      
      setIsUserDialogOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error(error.message || 'Failed to save user');
    }
  };
  
  const handleDeleteUser = async (userId) => {
    try {
      await userAPI.deleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };
  
  // Hotel management functions
  const handleHotelInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setHotelFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? checked 
        : name === 'cheapestPrice' || name === 'rating'
          ? Number(value)
          : value
    }));
  };
  
  const handleAddHotel = () => {
    setSelectedHotel(null);
    setHotelFormData({
      name: '',
      type: 'Hotel',
      city: '',
      address: '',
      distance: '',
      photos: [],
      title: '',
      desc: '',
      rating: 0,
      cheapestPrice: 0,
      featured: false
    });
    setPhotoUrlInput('');
    setIsHotelDialogOpen(true);
  };
  
  const handleEditHotel = (hotel) => {
    setSelectedHotel(hotel);
    setHotelFormData({
      name: hotel.name,
      type: hotel.type,
      city: hotel.city,
      address: hotel.address,
      distance: hotel.distance,
      photos: [...(hotel.photos || [])],
      title: hotel.title,
      desc: hotel.desc,
      rating: hotel.rating,
      cheapestPrice: hotel.cheapestPrice,
      featured: hotel.featured || false
    });
    setPhotoUrlInput('');
    setIsHotelDialogOpen(true);
  };
  
  const handleAddPhotoUrl = () => {
    if (photoUrlInput) {
      setHotelFormData(prev => ({
        ...prev,
        photos: [...prev.photos, photoUrlInput]
      }));
      setPhotoUrlInput('');
    }
  };
  
  const handleRemovePhotoUrl = (index) => {
    setHotelFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmitHotelForm = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedHotel) {
        const updatedHotel = await hotelAPI.updateHotel(selectedHotel._id, hotelFormData);
        setHotels(hotels.map(h => h._id === selectedHotel._id ? updatedHotel : h));
        toast.success('Hotel updated successfully');
      } else {
        const newHotel = await hotelAPI.createHotel(hotelFormData);
        setHotels([...hotels, newHotel]);
        toast.success('Hotel added successfully');
      }
      
      setIsHotelDialogOpen(false);
    } catch (error) {
      console.error('Error saving hotel:', error);
      toast.error(error.message || 'Failed to save hotel');
    }
  };
  
  const handleDeleteHotel = async (hotelId) => {
    try {
      await hotelAPI.deleteHotel(hotelId);
      setHotels(hotels.filter(h => h._id !== hotelId));
      toast.success('Hotel deleted successfully');
    } catch (error) {
      console.error('Error deleting hotel:', error);
      toast.error('Failed to delete hotel');
    }
  };
  
  const handleViewHotelDetails = async (hotel) => {
    setDetailsHotel(hotel);
    
    try {
      const hotelRooms = await roomAPI.getRoomsForHotel(hotel._id);
      setHotelRooms(hotelRooms || []);
    } catch (error) {
      console.error('Error fetching hotel rooms:', error);
      setHotelRooms([]);
      toast.error('Failed to load hotel rooms');
    }
    
    setIsHotelDetailsOpen(true);
  };
  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl">Loading dashboard data...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <AuthGuard requireAdmin>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow bg-gray-50 py-10">
          <div className="container-custom">
            <header className="mb-8">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage users, hotels, and bookings
              </p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {users.filter(user => user.isAdmin).length} admins,
                    {users.filter(user => user.isModerator).length} moderators
                  </p>
                </CardContent>
              </Card>
              
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
                    {hotels.filter(hotel => hotel.featured).length} featured
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
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Bookings
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookings.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length} active
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="dashboard">Overview</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="hotels">Hotels</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Users</CardTitle>
                      <CardDescription>
                        Recently registered users on the platform
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {users.slice(0, 5).map(user => (
                          <li key={user._id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                <User className="h-5 w-5 text-gray-400" />
                              </div>
                              <div>
                                <p className="font-medium">{user.username}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              {user.isAdmin && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  Admin
                                </span>
                              )}
                              {user.isModerator && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  Mod
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab('users')}>
                        View All Users
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Hotels</CardTitle>
                      <CardDescription>
                        Recently added hotels on the platform
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {hotels.slice(0, 5).map(hotel => (
                          <li key={hotel._id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden mr-3">
                                {hotel.photos && hotel.photos[0] ? (
                                  <img 
                                    src={hotel.photos[0]} 
                                    alt={hotel.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <Hotel className="h-5 w-5 m-auto text-gray-400" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{hotel.name}</p>
                                <p className="text-sm text-muted-foreground">{hotel.city}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="text-yellow-500 flex items-center">
                                <Star className="h-4 w-4 mr-1 fill-current" />
                                {hotel.rating.toFixed(1)}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab('hotels')}>
                        View All Hotels
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="users">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">User Management</h2>
                  <Button onClick={handleAddUser}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
                
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 border-b px-4 py-3 font-medium">
                    <div className="col-span-2">User</div>
                    <div>Location</div>
                    <div>Role</div>
                    <div>Created</div>
                    <div className="text-right">Actions</div>
                  </div>
                  
                  {users.map(user => (
                    <div key={user._id} className="grid grid-cols-6 items-center px-4 py-3 border-b last:border-0">
                      <div className="col-span-2">
                        <div className="flex items-center">
                          <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                          <div>
                            <div className="font-medium">{user.username}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        {user.city && user.country ? (
                          <span>{user.city}, {user.country}</span>
                        ) : (
                          <span className="text-muted-foreground">Not specified</span>
                        )}
                      </div>
                      <div>
                        <div className="flex flex-wrap gap-1">
                          {user.isAdmin && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              Admin
                            </span>
                          )}
                          {user.isModerator && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Moderator
                            </span>
                          )}
                          {!user.isAdmin && !user.isModerator && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                              User
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        {user.createdAt ? (
                          <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                        ) : (
                          <span className="text-muted-foreground">Unknown</span>
                        )}
                      </div>
                      <div className="flex space-x-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={user._id === state.user?._id}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {users.length === 0 && (
                    <div className="py-8 text-center">
                      <p className="text-muted-foreground">No users found</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="hotels">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Hotel Management</h2>
                  <Button onClick={handleAddHotel}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Hotel
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hotels.map(hotel => (
                    <Card key={hotel._id} className="overflow-hidden">
                      <div className="aspect-video bg-gray-100 relative">
                        {hotel.photos && hotel.photos[0] ? (
                          <img 
                            src={hotel.photos[0]} 
                            alt={hotel.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Hotel className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        {hotel.featured && (
                          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                            Featured
                          </div>
                        )}
                      </div>
                      
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{hotel.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {hotel.city}
                            </p>
                          </div>
                          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                            <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                            <span className="font-medium">{hotel.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        
                        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{hotel.desc}</p>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm">
                            <span className="font-medium text-base">${hotel.cheapestPrice}</span>
                            <span className="text-muted-foreground"> / night</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Type: </span>
                            <span>{hotel.type}</span>
                          </div>
                        </div>
                      </CardContent>
                      
                      <div className="px-4 pb-4 grid grid-cols-3 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewHotelDetails(hotel)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditHotel(hotel)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteHotel(hotel._id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </Card>
                  ))}
                  
                  {hotels.length === 0 && (
                    <div className="col-span-full py-8 text-center">
                      <p className="text-muted-foreground">No hotels found</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
        
        {/* User Dialog */}
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {selectedUser ? 'Edit User' : 'Add New User'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmitUserForm} className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={userFormData.username}
                    onChange={handleUserInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={userFormData.email}
                    onChange={handleUserInputChange}
                    required
                  />
                </div>
                
                {!selectedUser && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={userFormData.password}
                      onChange={handleUserInputChange}
                      required={!selectedUser}
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={userFormData.country}
                      onChange={handleUserInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={userFormData.city}
                      onChange={handleUserInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={userFormData.phone}
                    onChange={handleUserInputChange}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>User Role</Label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isAdmin"
                        name="isAdmin"
                        checked={userFormData.isAdmin}
                        onCheckedChange={(checked) => 
                          setUserFormData(prev => ({ ...prev, isAdmin: checked }))
                        }
                      />
                      <label
                        htmlFor="isAdmin"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Administrator
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isModerator"
                        name="isModerator"
                        checked={userFormData.isModerator}
                        onCheckedChange={(checked) => 
                          setUserFormData(prev => ({ ...prev, isModerator: checked }))
                        }
                      />
                      <label
                        htmlFor="isModerator"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Moderator
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedUser ? 'Update User' : 'Add User'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Hotel Dialog */}
        <Dialog open={isHotelDialogOpen} onOpenChange={setIsHotelDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedHotel ? 'Edit Hotel' : 'Add New Hotel'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmitHotelForm} className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Hotel Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={hotelFormData.name}
                    onChange={handleHotelInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <select
                      id="type"
                      name="type"
                      value={hotelFormData.type}
                      onChange={handleHotelInputChange}
                      required
                      className="w-full rounded-md border border-input px-3 py-2 bg-background"
                    >
                      <option value="Hotel">Hotel</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Resort">Resort</option>
                      <option value="Villa">Villa</option>
                      <option value="Cabin">Cabin</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={hotelFormData.city}
                      onChange={handleHotelInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={hotelFormData.address}
                    onChange={handleHotelInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="distance">Distance from City Center</Label>
                    <Input
                      id="distance"
                      name="distance"
                      placeholder="e.g. 500m"
                      value={hotelFormData.distance}
                      onChange={handleHotelInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (0-5)</Label>
                    <Input
                      id="rating"
                      name="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={hotelFormData.rating}
                      onChange={handleHotelInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Short descriptive title"
                    value={hotelFormData.title}
                    onChange={handleHotelInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <textarea
                    id="desc"
                    name="desc"
                    value={hotelFormData.desc}
                    onChange={handleHotelInputChange}
                    required
                    className="w-full rounded-md border border-input px-3 py-2 bg-background h-24"
                  ></textarea>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cheapestPrice">Cheapest Price (per night)</Label>
                  <Input
                    id="cheapestPrice"
                    name="cheapestPrice"
                    type="number"
                    min="0"
                    value={hotelFormData.cheapestPrice}
                    onChange={handleHotelInputChange}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    name="featured"
                    checked={hotelFormData.featured}
                    onCheckedChange={(checked) => 
                      setHotelFormData(prev => ({ ...prev, featured: checked }))
                    }
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Featured Hotel
                  </label>
                </div>
                
                <div className="space-y-2">
                  <Label>Photos</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter photo URL"
                      value={photoUrlInput}
                      onChange={(e) => setPhotoUrlInput(e.target.value)}
                    />
                    <Button type="button" onClick={handleAddPhotoUrl}>Add</Button>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {hotelFormData.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={photo} 
                          alt={`Hotel photo ${index + 1}`}
                          className="w-full h-20 object-cover rounded-md"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/150?text=Invalid+URL";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhotoUrl(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    
                    {hotelFormData.photos.length === 0 && (
                      <p className="text-sm text-muted-foreground col-span-full">No photos added yet</p>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsHotelDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedHotel ? 'Update Hotel' : 'Add Hotel'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Hotel Details Dialog */}
        <Dialog open={isHotelDetailsOpen} onOpenChange={setIsHotelDetailsOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Hotel className="h-5 w-5 mr-2" />
                {detailsHotel?.name}
              </DialogTitle>
            </DialogHeader>
            
            {detailsHotel && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {detailsHotel.photos && detailsHotel.photos.length > 0 ? (
                    detailsHotel.photos.map((photo, index) => (
                      <img 
                        key={index}
                        src={photo}
                        alt={`${detailsHotel.name} - ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150?text=Invalid+URL";
                        }}
                      />
                    ))
                  ) : (
                    <div className="col-span-full h-32 flex items-center justify-center bg-gray-100 rounded-md">
                      <p className="text-muted-foreground">No photos available</p>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Location</h3>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-1 mt-0.5" />
                      <div>
                        <p>{detailsHotel.address}</p>
                        <p>{detailsHotel.city}</p>
                        <p className="text-sm text-muted-foreground">
                          {detailsHotel.distance} from center
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Details</h3>
                    <p><span className="font-medium">Type:</span> {detailsHotel.type}</p>
                    <p><span className="font-medium">Price:</span> ${detailsHotel.cheapestPrice}/night</p>
                    <p className="flex items-center">
                      <span className="font-medium mr-1">Rating:</span>
                      <span className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                        {detailsHotel.rating.toFixed(1)}
                      </span>
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Status</h3>
                    <p>
                      <span className="font-medium">Featured:</span>
                      {detailsHotel.featured ? (
                        <span className="ml-1 text-green-600">Yes</span>
                      ) : (
                        <span className="ml-1 text-red-600">No</span>
                      )}
                    </p>
                    <p><span className="font-medium">Total Rooms:</span> {hotelRooms.length}</p>
                    <p>
                      <span className="font-medium">Added:</span> 
                      {detailsHotel.createdAt ? (
                        <span className="ml-1">{new Date(detailsHotel.createdAt).toLocaleDateString()}</span>
                      ) : (
                        <span className="ml-1 text-muted-foreground">Unknown</span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-sm mb-1">Description</h3>
                  <p className="text-gray-600">{detailsHotel.desc}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-3">Available Rooms</h3>
                  
                  {hotelRooms.length > 0 ? (
                    <div className="space-y-3">
                      {hotelRooms.map(room => (
                        <Card key={room._id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">{room.title}</h4>
                                <p className="text-sm text-muted-foreground">${room.price} per night</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm"><span className="font-medium">Max People:</span> {room.maxPeople}</p>
                                <p className="text-sm">
                                  <span className="font-medium">Room Numbers:</span> {room.roomNumbers?.map(r => r.number).join(', ')}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm mt-2">{room.desc}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No rooms available for this hotel</p>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  );
};

export default AdminDashboard;
