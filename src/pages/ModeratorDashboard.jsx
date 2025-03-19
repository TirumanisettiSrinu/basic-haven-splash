
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Hotel, 
  Users, 
  UserCheck, 
  Plus,
  Edit, 
  Trash, 
  Bed,
  Check,
  X,
  Calendar,
  Eye,
  Briefcase
} from 'lucide-react';
import { hotelAPI, roomAPI, userAPI, workerAPI, bookingAPI } from '@/services/api';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const ModeratorDashboard = () => {
  const { state } = useAuth();
  const { user } = state;
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Worker state
  const [isWorkerDialogOpen, setIsWorkerDialogOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [workerFormData, setWorkerFormData] = useState({
    name: '',
    role: '',
    hotelId: '',
    email: '',
    phone: '',
    isActive: true,
    userId: user?._id || '',
    assignedRooms: []
  });
  
  // Room state
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomFormData, setRoomFormData] = useState({
    title: '',
    price: 0,
    maxPeople: 1,
    desc: '',
    hotelId: '',
    roomNumbers: []
  });
  const [roomNumberInput, setRoomNumberInput] = useState('');

  // Load dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [hotelsData, workersData, bookingsData] = await Promise.all([
          hotelAPI.getAllHotels(),
          workerAPI.getAllWorkers(),
          bookingAPI.getAllBookings()
        ]);
        
        setHotels(hotelsData || []);
        setBookings(bookingsData || []);
        
        if (Array.isArray(workersData)) {
          setWorkers(workersData);
        }
        
        let allRooms = [];
        
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
  
  // Worker form handlers
  const handleWorkerInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setWorkerFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleAddWorker = () => {
    setSelectedWorker(null);
    setWorkerFormData({
      name: '',
      role: '',
      hotelId: hotels.length > 0 ? hotels[0]._id || '' : '',
      email: '',
      phone: '',
      isActive: true,
      userId: user?._id || '',
      assignedRooms: []
    });
    setIsWorkerDialogOpen(true);
  };
  
  const handleEditWorker = (worker) => {
    setSelectedWorker(worker);
    setWorkerFormData({
      name: worker.name,
      role: worker.role,
      hotelId: worker.hotelId,
      email: worker.email,
      phone: worker.phone || '',
      isActive: worker.isActive,
      userId: worker.userId,
      assignedRooms: worker.assignedRooms
    });
    setIsWorkerDialogOpen(true);
  };
  
  const handleSubmitWorkerForm = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedWorker) {
        const updatedWorker = await workerAPI.updateWorker(selectedWorker._id || '', workerFormData);
        setWorkers(workers.map(w => w._id === selectedWorker._id ? updatedWorker : w));
        toast.success('Worker updated successfully');
      } else {
        const newWorker = await workerAPI.createWorker(workerFormData);
        setWorkers([...workers, newWorker]);
        toast.success('Worker added successfully');
      }
      
      setIsWorkerDialogOpen(false);
    } catch (error) {
      console.error('Error saving worker:', error);
      toast.error('Failed to save worker');
    }
  };
  
  const handleDeleteWorker = async (workerId) => {
    try {
      await workerAPI.deleteWorker(workerId);
      setWorkers(workers.filter(w => w._id !== workerId));
      toast.success('Worker deleted successfully');
    } catch (error) {
      console.error('Error deleting worker:', error);
      toast.error('Failed to delete worker');
    }
  };
  
  // Room form handlers
  const handleRoomInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setRoomFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? checked 
        : type === 'number' 
          ? Number(value) 
          : value
    }));
  };
  
  const handleAddRoom = () => {
    setSelectedRoom(null);
    setRoomFormData({
      title: '',
      price: 0,
      maxPeople: 1,
      desc: '',
      hotelId: hotels.length > 0 ? hotels[0]._id || '' : '',
      roomNumbers: []
    });
    setRoomNumberInput('');
    setIsRoomDialogOpen(true);
  };
  
  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setRoomFormData({
      title: room.title,
      price: room.price,
      maxPeople: room.maxPeople,
      desc: room.desc,
      hotelId: room.hotelId,
      roomNumbers: room.roomNumbers
    });
    setRoomNumberInput('');
    setIsRoomDialogOpen(true);
  };
  
  const handleAddRoomNumber = () => {
    if (roomNumberInput && !isNaN(Number(roomNumberInput))) {
      const roomNumber = Number(roomNumberInput);
      
      // Check if the room number already exists
      const exists = roomFormData.roomNumbers.some(r => r.number === roomNumber);
      
      if (!exists) {
        setRoomFormData(prev => ({
          ...prev,
          roomNumbers: [...prev.roomNumbers, { number: roomNumber, unavailableDates: [] }]
        }));
        setRoomNumberInput('');
      } else {
        toast.error('This room number already exists');
      }
    }
  };
  
  const handleRemoveRoomNumber = (number) => {
    setRoomFormData(prev => ({
      ...prev,
      roomNumbers: prev.roomNumbers.filter(r => r.number !== number)
    }));
  };
  
  const handleSubmitRoomForm = async (e) => {
    e.preventDefault();
    
    if (roomFormData.roomNumbers.length === 0) {
      toast.error('Please add at least one room number');
      return;
    }
    
    try {
      if (selectedRoom) {
        const updatedRoom = await roomAPI.updateRoom(selectedRoom._id || '', roomFormData);
        setRooms(rooms.map(r => r._id === selectedRoom._id ? updatedRoom : r));
        toast.success('Room updated successfully');
      } else {
        const newRoom = await roomAPI.createRoom(roomFormData);
        setRooms([...rooms, newRoom]);
        toast.success('Room added successfully');
      }
      
      setIsRoomDialogOpen(false);
    } catch (error) {
      console.error('Error saving room:', error);
      toast.error('Failed to save room');
    }
  };
  
  const handleDeleteRoom = async (roomId) => {
    try {
      await roomAPI.deleteRoom(roomId);
      setRooms(rooms.filter(r => r._id !== roomId));
      toast.success('Room deleted successfully');
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error('Failed to delete room');
    }
  };
  
  // Toggle room cleaning status
  const handleToggleRoomCleaned = async (room) => {
    if (!room._id) return;
    
    try {
      const updatedRoom = await roomAPI.toggleRoomCleaningStatus(room._id, !room.isCleaned);
      
      setRooms(rooms.map(r => r._id === room._id ? updatedRoom : r));
      
      toast.success(`Room marked as ${updatedRoom.isCleaned ? 'cleaned' : 'needs cleaning'}`);
    } catch (error) {
      console.error('Error updating room:', error);
      toast.error('Failed to update room status');
    }
  };
  
  return (
    <AuthGuard requireModerator>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow py-12 bg-gray-50">
          <div className="container-custom">
            <header className="mb-8">
              <h1 className="text-3xl font-bold">Moderator Dashboard</h1>
              <p className="text-muted-foreground">
                Manage workers, rooms, and bookings
              </p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Assigned Hotels
                  </CardTitle>
                  <Hotel className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{hotels.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Workers
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{workers.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {workers.filter(w => w.isActive).length} active
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Rooms to Clean
                  </CardTitle>
                  <Bed className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {rooms.filter(r => !r.isCleaned).length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    out of {rooms.length} total rooms
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Bookings
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    out of {bookings.length} total bookings
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="workers">Workers</TabsTrigger>
                <TabsTrigger value="rooms">Rooms</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Overview</h2>
                <p className="text-muted-foreground mb-6">
                  Welcome to the StayHaven moderator dashboard. Here you can manage workers, room cleaning status, and view bookings.
                </p>
                
                <h3 className="text-lg font-medium mb-3">Assigned Hotels</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {hotels.map(hotel => (
                    <Card key={hotel._id} className="overflow-hidden">
                      <div className="h-32 bg-gray-200">
                        {hotel.photos && hotel.photos.length > 0 ? (
                          <img 
                            src={hotel.photos[0]} 
                            alt={hotel.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Hotel className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold">{hotel.name}</h4>
                        <p className="text-sm text-muted-foreground">{hotel.city}</p>
                        <div className="flex justify-between mt-2 text-sm">
                          <span>Rooms: {hotel.rooms?.length || 0}</span>
                          <span>Rating: {hotel.rating || 'N/A'}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <h3 className="text-lg font-medium mb-3">Recent Activity</h3>
                <Card>
                  <CardContent className="p-4">
                    <ul className="space-y-3">
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span>Room 101 marked as cleaned</span>
                        <span className="ml-auto text-muted-foreground">2 hours ago</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <UserCheck className="h-4 w-4 text-blue-500 mr-2" />
                        <span>New worker Sarah Johnson added</span>
                        <span className="ml-auto text-muted-foreground">Yesterday</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <X className="h-4 w-4 text-red-500 mr-2" />
                        <span>Room 205 marked as needs cleaning</span>
                        <span className="ml-auto text-muted-foreground">2 days ago</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="workers" className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Workers</h2>
                  <Button onClick={handleAddWorker} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Worker
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {workers.map(worker => (
                    <Card key={worker._id} className="overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                              <UserCheck className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">{worker.name}</h3>
                              <div className="flex items-center">
                                <span className="text-sm text-muted-foreground mr-2">{worker.role}</span>
                                {worker.isActive ? (
                                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Active</span>
                                ) : (
                                  <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full">Inactive</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditWorker(worker)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteWorker(worker._id || '')}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <span className="text-sm font-medium">Email: </span>
                            <span className="text-sm">{worker.email}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Phone: </span>
                            <span className="text-sm">{worker.phone || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Hotel: </span>
                            <span className="text-sm">
                              {hotels.find(h => h._id === worker.hotelId)?.name || 'Unknown Hotel'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  {workers.length === 0 && (
                    <Card className="p-8 text-center">
                      <p className="text-muted-foreground">No workers found. Add a worker to get started.</p>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="rooms" className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Room Management</h2>
                  <Button onClick={handleAddRoom} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Room
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {rooms.map(room => {
                    const hotel = hotels.find(h => h._id === room.hotelId || h.rooms?.includes(room._id || ''));
                    
                    return (
                      <Card key={room._id} className="overflow-hidden">
                        <div className="p-4">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-bold text-lg">{room.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {hotel?.name || 'Unknown Hotel'}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant={room.isCleaned ? "outline" : "default"}
                                size="sm"
                                onClick={() => handleToggleRoomCleaned(room)}
                              >
                                {room.isCleaned ? (
                                  <>
                                    <X className="h-4 w-4 mr-2" />
                                    Needs Cleaning
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Mark Clean
                                  </>
                                )}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditRoom(room)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteRoom(room._id || '')}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <span className="text-sm font-medium">Room Numbers: </span>
                              <span className="text-sm">
                                {room.roomNumbers?.map(r => r.number).join(', ')}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm font-medium">Price: </span>
                              <span className="text-sm">${room.price} per night</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium">Max People: </span>
                              <span className="text-sm">{room.maxPeople}</span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">{room.desc}</p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                  
                  {rooms.length === 0 && (
                    <Card className="p-8 text-center">
                      <p className="text-muted-foreground">No rooms found. Add a room to get started.</p>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="bookings" className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Bookings</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {bookings.map(booking => {
                    const hotel = hotels.find(h => h._id === booking.hotelId);
                    
                    return (
                      <Card key={booking._id} className="overflow-hidden">
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg">Booking #{booking._id?.substring(0, 8)}...</h3>
                              <p className="text-sm text-muted-foreground">
                                Room {booking.roomNumber} at {hotel?.name || 'Unknown Hotel'}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newStatus = booking.status === 'active' || booking.status === 'confirmed' ? 'completed' : 'active';
                                  bookingAPI.updateBooking(booking._id || '', { status: newStatus })
                                    .then(updatedBooking => {
                                      setBookings(bookings.map(b => b._id === booking._id ? updatedBooking : b));
                                      toast.success(`Booking marked as ${newStatus}`);
                                    })
                                    .catch(error => {
                                      console.error('Error updating booking:', error);
                                      toast.error('Failed to update booking');
                                    });
                                }}
                              >
                                {booking.status === 'active' || booking.status === 'confirmed' ? 'Mark Completed' : 'Mark Active'}
                              </Button>
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <span className="text-sm font-medium">Check In: </span>
                              <span className="text-sm">{new Date(booking.dateStart).toLocaleDateString()}</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium">Check Out: </span>
                              <span className="text-sm">{new Date(booking.dateEnd).toLocaleDateString()}</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium">Price: </span>
                              <span className="text-sm">${booking.totalPrice}</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium">Status: </span>
                              <span className="text-sm capitalize">{booking.status}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                  
                  {bookings.length === 0 && (
                    <Card className="p-8 text-center">
                      <p className="text-muted-foreground">No bookings found.</p>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
        
        {/* Worker Dialog */}
        <Dialog open={isWorkerDialogOpen} onOpenChange={setIsWorkerDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {selectedWorker ? 'Edit Worker' : 'Add New Worker'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmitWorkerForm} className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={workerFormData.name}
                    onChange={handleWorkerInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    name="role"
                    value={workerFormData.role}
                    onChange={handleWorkerInputChange}
                    required
                    className="w-full rounded-md border border-input px-3 py-2 bg-background"
                  >
                    <option value="">Select Role</option>
                    <option value="Housekeeper">Housekeeper</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Manager">Manager</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Security">Security</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hotelId">Hotel</Label>
                  <select
                    id="hotelId"
                    name="hotelId"
                    value={workerFormData.hotelId}
                    onChange={handleWorkerInputChange}
                    required
                    className="w-full rounded-md border border-input px-3 py-2 bg-background"
                  >
                    {hotels.map(hotel => (
                      <option key={hotel._id} value={hotel._id}>
                        {hotel.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={workerFormData.email}
                    onChange={handleWorkerInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={workerFormData.phone}
                    onChange={handleWorkerInputChange}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={workerFormData.isActive}
                    onChange={handleWorkerInputChange}
                    className="rounded"
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsWorkerDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedWorker ? 'Update Worker' : 'Add Worker'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Room Dialog */}
        <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {selectedRoom ? 'Edit Room' : 'Add New Room'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmitRoomForm} className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Room Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={roomFormData.title}
                    onChange={handleRoomInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hotelId">Hotel</Label>
                  <select
                    id="hotelId"
                    name="hotelId"
                    value={roomFormData.hotelId}
                    onChange={handleRoomInputChange}
                    required
                    className="w-full rounded-md border border-input px-3 py-2 bg-background"
                  >
                    {hotels.map(hotel => (
                      <option key={hotel._id} value={hotel._id}>
                        {hotel.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price Per Night ($)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="1"
                      value={roomFormData.price}
                      onChange={handleRoomInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxPeople">Max People</Label>
                    <Input
                      id="maxPeople"
                      name="maxPeople"
                      type="number"
                      min="1"
                      value={roomFormData.maxPeople}
                      onChange={handleRoomInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <textarea
                    id="desc"
                    name="desc"
                    value={roomFormData.desc}
                    onChange={handleRoomInputChange}
                    required
                    className="w-full rounded-md border border-input px-3 py-2 bg-background h-24"
                  ></textarea>
                </div>
                
                <div className="space-y-2">
                  <Label>Room Numbers</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter room number"
                      value={roomNumberInput}
                      onChange={(e) => setRoomNumberInput(e.target.value)}
                    />
                    <Button type="button" onClick={handleAddRoomNumber}>Add</Button>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-2">
                    {roomFormData.roomNumbers.map(room => (
                      <div key={room.number} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium">
                        Room {room.number}
                        <button 
                          type="button"
                          onClick={() => handleRemoveRoomNumber(room.number)}
                          className="ml-1 text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    
                    {roomFormData.roomNumbers.length === 0 && (
                      <p className="text-sm text-muted-foreground">No room numbers added yet</p>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsRoomDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedRoom ? 'Update Room' : 'Add Room'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  );
};

export default ModeratorDashboard;
