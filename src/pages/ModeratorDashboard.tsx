
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
  X
} from 'lucide-react';
import { hotelAPI, roomAPI, userAPI, workerAPI } from '@/services/api';
import { toast } from 'sonner';
import { Hotel as HotelType, Room as RoomType, User as UserType, Worker } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// Enhanced ModeratorDashboard component
const ModeratorDashboard = () => {
  const { state } = useAuth();
  const { user } = state;
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Worker form state
  const [isWorkerDialogOpen, setIsWorkerDialogOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [workerFormData, setWorkerFormData] = useState<Partial<Worker>>({
    name: '',
    role: '',
    hotelId: '',
    email: '',
    phone: '',
    isActive: true,
    userId: '',
    assignedRooms: []
  });
  
  // Fetch data for dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch hotels and workers data
        const [hotelsData, workersData] = await Promise.all([
          hotelAPI.getAllHotels(),
          workerAPI.getAllWorkers()
        ]);
        
        setHotels(hotelsData || []);
        
        // Ensure workers data matches our Worker type
        if (Array.isArray(workersData)) {
          setWorkers(workersData);
        }
        
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
  
  const handleWorkerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setWorkerFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
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
      userId: user?.id || '',
      assignedRooms: []
    });
    setIsWorkerDialogOpen(true);
  };
  
  const handleEditWorker = (worker: Worker) => {
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
  
  const handleSubmitWorkerForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedWorker) {
        // Update existing worker
        const updatedWorker = await workerAPI.updateWorker(selectedWorker._id || '', workerFormData);
        setWorkers(workers.map(w => w._id === selectedWorker._id ? updatedWorker as Worker : w));
        toast.success('Worker updated successfully');
      } else {
        // Create new worker
        const newWorker = await workerAPI.createWorker(workerFormData);
        setWorkers([...workers, newWorker as Worker]);
        toast.success('Worker added successfully');
      }
      
      setIsWorkerDialogOpen(false);
    } catch (error) {
      console.error('Error saving worker:', error);
      toast.error('Failed to save worker');
    }
  };
  
  const handleDeleteWorker = async (workerId: string) => {
    try {
      await workerAPI.deleteWorker(workerId);
      setWorkers(workers.filter(w => w._id !== workerId));
      toast.success('Worker deleted successfully');
    } catch (error) {
      console.error('Error deleting worker:', error);
      toast.error('Failed to delete worker');
    }
  };
  
  const handleToggleRoomCleaned = async (room: RoomType) => {
    if (!room._id) return;
    
    try {
      const updatedRoom = await roomAPI.updateRoom(room._id, {
        ...room,
        isCleaned: !room.isCleaned,
        needsCleaning: room.isCleaned // If it was cleaned, it now needs cleaning and vice versa
      });
      
      setRooms(rooms.map(r => r._id === room._id ? updatedRoom as RoomType : r));
      
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
                Manage workers and room status
              </p>
            </header>
            
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            </div>
            
            {/* Dashboard Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="workers">Workers</TabsTrigger>
                <TabsTrigger value="rooms">Rooms</TabsTrigger>
              </TabsList>
              
              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Overview</h2>
                <p className="text-muted-foreground mb-6">
                  Welcome to the StayHaven moderator dashboard. Here you can manage workers and room cleaning status.
                </p>
                
                {/* Hotels overview */}
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
                
                {/* Recent activity - simplified for demo */}
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
              
              {/* Workers Tab */}
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
                </div>
              </TabsContent>
              
              {/* Rooms Tab */}
              <TabsContent value="rooms" className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Room Cleaning Status</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {rooms.map(room => {
                    const hotel = hotels.find(h => h.rooms?.includes(room._id || ''));
                    
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
                            <Button 
                              variant={room.isCleaned ? "outline" : "default"}
                              size="sm"
                              onClick={() => handleToggleRoomCleaned(room)}
                            >
                              {room.isCleaned ? (
                                <>
                                  <X className="h-4 w-4 mr-2" />
                                  Mark as Needs Cleaning
                                </>
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-2" />
                                  Mark as Cleaned
                                </>
                              )}
                            </Button>
                          </div>
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <span className="text-sm font-medium">Room Numbers: </span>
                              <span className="text-sm">
                                {room.roomNumbers.map(r => r.number).join(', ')}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm font-medium">Status: </span>
                              <span className={`text-sm ${room.isCleaned ? 'text-green-600' : 'text-red-600'}`}>
                                {room.isCleaned ? 'Cleaned' : 'Needs Cleaning'}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm font-medium">Max People: </span>
                              <span className="text-sm">{room.maxPeople}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
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
      </div>
    </AuthGuard>
  );
};

export default ModeratorDashboard;
