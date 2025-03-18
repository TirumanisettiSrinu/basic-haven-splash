
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moderatorAPI, hotelAPI, workerAPI, roomAPI } from '@/services/api';
import { Moderator, Hotel, Room, Worker } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Loader2, 
  Check, 
  X, 
  AlertCircle, 
  Plus, 
  PencilIcon, 
  Trash2, 
  Hotel as HotelIcon, 
  DoorOpen, 
  Users, 
  UserPlus, 
  Briefcase 
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const workerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  role: z.string().min(2, 'Role is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  hotelId: z.string().min(1, 'Hotel is required'),
  assignedRooms: z.array(z.object({
    roomId: z.string(),
  })).optional(),
  isActive: z.boolean().default(true),
});

type WorkerFormValues = z.infer<typeof workerSchema>;

const ModeratorDashboard = () => {
  const { state } = useAuth();
  const { user, loading } = state;
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddWorkerDialogOpen, setIsAddWorkerDialogOpen] = useState(false);
  const [isEditWorkerDialogOpen, setIsEditWorkerDialogOpen] = useState(false);
  const [isDeleteWorkerDialogOpen, setIsDeleteWorkerDialogOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

  // Query to get moderator data
  const { data: moderatorData, isLoading: isModeratorLoading } = useQuery({
    queryKey: ['moderator', user?._id],
    queryFn: async () => {
      // First get all moderators
      const allModerators = await moderatorAPI.getAllModerators();
      // Then find the moderator with matching userId
      return allModerators.find((m: Moderator) => m.userId === user?._id) || null;
    },
    enabled: !!user?._id,
  });

  // Query to get hotel data for the moderator
  const { data: hotel, isLoading: isHotelLoading } = useQuery({
    queryKey: ['moderator-hotel', moderatorData?.hotelId],
    queryFn: () => hotelAPI.getHotelById(moderatorData?.hotelId as string),
    enabled: !!moderatorData?.hotelId,
  });

  // Query to get rooms for the hotel
  const { data: rooms, isLoading: isRoomsLoading } = useQuery({
    queryKey: ['hotel-rooms', moderatorData?.hotelId],
    queryFn: () => roomAPI.getRoomsForHotel(moderatorData?.hotelId as string),
    enabled: !!moderatorData?.hotelId,
  });

  // Query to get workers for the hotel
  const { data: workers, isLoading: isWorkersLoading } = useQuery({
    queryKey: ['hotel-workers', moderatorData?.hotelId],
    queryFn: async () => {
      const allWorkers = await workerAPI.getAllWorkers();
      return allWorkers.filter((w: Worker) => w.hotelId === moderatorData?.hotelId);
    },
    enabled: !!moderatorData?.hotelId,
  });

  // Form for adding a new worker
  const form = useForm<WorkerFormValues>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      name: '',
      role: '',
      email: '',
      phone: '',
      hotelId: moderatorData?.hotelId || '',
      assignedRooms: [],
      isActive: true,
    },
  });

  // Form for editing an existing worker
  const editForm = useForm<WorkerFormValues>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      name: '',
      role: '',
      email: '',
      phone: '',
      hotelId: moderatorData?.hotelId || '',
      assignedRooms: [],
      isActive: true,
    },
  });

  // Mutation to create a new worker
  const createWorkerMutation = useMutation({
    mutationFn: workerAPI.createWorker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-workers'] });
      toast.success('Worker added successfully');
      setIsAddWorkerDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(`Failed to add worker: ${error.message}`);
    }
  });

  // Mutation to update an existing worker
  const updateWorkerMutation = useMutation({
    mutationFn: (data: { id: string, workerData: Partial<Worker> }) => 
      workerAPI.updateWorker(data.id, data.workerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-workers'] });
      toast.success('Worker updated successfully');
      setIsEditWorkerDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to update worker: ${error.message}`);
    }
  });

  // Mutation to delete a worker
  const deleteWorkerMutation = useMutation({
    mutationFn: workerAPI.deleteWorker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-workers'] });
      toast.success('Worker deleted successfully');
      setIsDeleteWorkerDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete worker: ${error.message}`);
    }
  });

  // Handler for creating a new worker
  const onAddWorkerSubmit = (data: WorkerFormValues) => {
    createWorkerMutation.mutate({
      ...data,
      userId: user?._id as string,
    });
  };

  // Handler for updating an existing worker
  const onEditWorkerSubmit = (data: WorkerFormValues) => {
    if (selectedWorker?._id) {
      updateWorkerMutation.mutate({
        id: selectedWorker._id as string,
        workerData: {
          ...data,
          userId: selectedWorker.userId,
        },
      });
    }
  };

  // Handler for deleting a worker
  const handleDeleteWorker = () => {
    if (selectedWorker?._id) {
      deleteWorkerMutation.mutate(selectedWorker._id as string);
    }
  };

  // Handler for editing a worker
  const handleEditWorker = (worker: Worker) => {
    setSelectedWorker(worker);
    editForm.reset({
      name: worker.name,
      role: worker.role,
      email: worker.email,
      phone: worker.phone || '',
      hotelId: worker.hotelId,
      assignedRooms: worker.assignedRooms,
      isActive: worker.isActive,
    });
    setIsEditWorkerDialogOpen(true);
  };

  if (loading || isModeratorLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-hotel-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!moderatorData) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow pt-16 md:pt-20 pb-10 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Not a Moderator</h2>
            <p className="mb-6 text-muted-foreground">
              Your account is not registered as a moderator. Please contact an administrator if you believe this is an error.
            </p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20 pb-10">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Moderator Dashboard</h1>
            <p className="text-muted-foreground">Manage your assigned hotel, workers, and rooms.</p>
          </div>
          
          <Tabs 
            defaultValue={activeTab} 
            value={activeTab}
            onValueChange={setActiveTab}
            className="mt-6"
          >
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="workers">Workers</TabsTrigger>
              <TabsTrigger value="rooms">Rooms</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {/* Hotel Information Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HotelIcon className="h-5 w-5 mr-2 text-hotel-600" />
                    Assigned Hotel
                  </CardTitle>
                  <CardDescription>Hotel you're responsible for managing</CardDescription>
                </CardHeader>
                <CardContent>
                  {isHotelLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-hotel-500" />
                    </div>
                  ) : hotel ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold">{hotel.name}</h3>
                        <p className="text-muted-foreground">{hotel.address}, {hotel.city}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-muted-foreground">Type</p>
                          <p className="font-medium">{hotel.type}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-muted-foreground">Rating</p>
                          <p className="font-medium">{hotel.rating} Stars</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-muted-foreground">Distance from Center</p>
                          <p className="font-medium">{hotel.distance}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No hotel assigned yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Users className="h-5 w-5 mr-2 text-blue-600" />
                      Workers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline justify-between">
                      <span className="text-3xl font-bold">{workers?.length || 0}</span>
                      <Button variant="outline" size="sm" onClick={() => setActiveTab('workers')}>
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <DoorOpen className="h-5 w-5 mr-2 text-emerald-600" />
                      Rooms
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline justify-between">
                      <span className="text-3xl font-bold">{rooms?.length || 0}</span>
                      <Button variant="outline" size="sm" onClick={() => setActiveTab('rooms')}>
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Check className="h-5 w-5 mr-2 text-green-600" />
                      Clean Rooms
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline justify-between">
                      <span className="text-3xl font-bold">
                        {rooms?.filter(room => room.isCleaned).length || 0}
                      </span>
                      <span className="text-muted-foreground">
                        of {rooms?.length || 0}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="workers" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Workers Management</h2>
                
                {moderatorData.permissions.canManageWorkers && (
                  <Button 
                    onClick={() => setIsAddWorkerDialogOpen(true)}
                    className="bg-hotel-500 hover:bg-hotel-600"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New Worker
                  </Button>
                )}
              </div>
              
              {isWorkersLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-hotel-500" />
                </div>
              ) : workers && workers.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Assigned Rooms</TableHead>
                        <TableHead>Status</TableHead>
                        {moderatorData.permissions.canManageWorkers && (
                          <TableHead className="text-right">Actions</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workers.map((worker: Worker) => (
                        <TableRow key={worker._id}>
                          <TableCell className="font-medium">{worker.name}</TableCell>
                          <TableCell>{worker.role}</TableCell>
                          <TableCell>{worker.email}</TableCell>
                          <TableCell>
                            {worker.assignedRooms ? worker.assignedRooms.length : 0} rooms
                          </TableCell>
                          <TableCell>
                            <Badge className={`${
                              worker.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {worker.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          {moderatorData.permissions.canManageWorkers && (
                            <TableCell className="text-right space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditWorker(worker)}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedWorker(worker);
                                  setIsDeleteWorkerDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-12 text-center">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Workers Yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    You haven't added any workers to your hotel. Workers can help manage rooms and cleaning tasks.
                  </p>
                  {moderatorData.permissions.canManageWorkers && (
                    <Button 
                      onClick={() => setIsAddWorkerDialogOpen(true)}
                      className="bg-hotel-500 hover:bg-hotel-600"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Your First Worker
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="rooms" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Rooms Management</h2>
              </div>
              
              {isRoomsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-hotel-500" />
                </div>
              ) : rooms && rooms.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Room Type</TableHead>
                        <TableHead>Room Numbers</TableHead>
                        <TableHead>Max People</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        {moderatorData.permissions.canManageRooms && (
                          <TableHead className="text-right">Actions</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rooms.map((room: Room) => (
                        <TableRow key={room._id}>
                          <TableCell className="font-medium">{room.title}</TableCell>
                          <TableCell>
                            <span className="text-xs">
                              {room.roomNumbers.map(r => r.number).join(', ')}
                            </span>
                          </TableCell>
                          <TableCell>{room.maxPeople}</TableCell>
                          <TableCell>${room.price}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {room.isCleaned ? (
                                <Check className="h-4 w-4 text-green-500 mr-1" />
                              ) : (
                                <X className="h-4 w-4 text-red-500 mr-1" />
                              )}
                              <span>{room.isCleaned ? 'Cleaned' : 'Needs Cleaning'}</span>
                            </div>
                          </TableCell>
                          {moderatorData.permissions.canManageRooms && (
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  // Toggle room cleaning status
                                  roomAPI.toggleRoomCleaningStatus(room._id as string, !room.isCleaned)
                                    .then(() => {
                                      queryClient.invalidateQueries({ queryKey: ['hotel-rooms'] });
                                      toast.success(`Room marked as ${!room.isCleaned ? 'cleaned' : 'needs cleaning'}`);
                                    })
                                    .catch((error) => {
                                      toast.error(`Failed to update room status: ${error.message}`);
                                    });
                                }}
                              >
                                {!room.isCleaned ? 'Mark as Cleaned' : 'Mark as Needs Cleaning'}
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-12 text-center">
                  <DoorOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Rooms Available</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    There are no rooms available in this hotel. Rooms must be added by an administrator.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
      
      {/* Add Worker Dialog */}
      <Dialog open={isAddWorkerDialogOpen} onOpenChange={setIsAddWorkerDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Worker</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAddWorkerSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Worker name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Housekeeper">Housekeeper</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Front Desk">Front Desk</SelectItem>
                        <SelectItem value="Room Service">Room Service</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hotelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel</FormLabel>
                    <Select defaultValue={moderatorData.hotelId} disabled>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue>
                            {hotel ? hotel.name : 'Loading...'}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={moderatorData.hotelId}>
                          {hotel ? hotel.name : 'Loading...'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Active
                      </FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Inactive workers won't be able to access the system
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddWorkerDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-hotel-500 hover:bg-hotel-600"
                  disabled={createWorkerMutation.isPending}
                >
                  {createWorkerMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    "Add Worker"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Worker Dialog */}
      <Dialog open={isEditWorkerDialogOpen} onOpenChange={setIsEditWorkerDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Worker</DialogTitle>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditWorkerSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Worker name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Housekeeper">Housekeeper</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Front Desk">Front Desk</SelectItem>
                        <SelectItem value="Room Service">Room Service</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Active
                      </FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Inactive workers won't be able to access the system
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditWorkerDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-hotel-500 hover:bg-hotel-600"
                  disabled={updateWorkerMutation.isPending}
                >
                  {updateWorkerMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    "Update Worker"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Worker Dialog */}
      <Dialog open={isDeleteWorkerDialogOpen} onOpenChange={setIsDeleteWorkerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Worker</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-center">Are you sure you want to delete this worker?</p>
            {selectedWorker && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="font-medium">Worker Details:</p>
                <p>Name: {selectedWorker.name}</p>
                <p>Role: {selectedWorker.role}</p>
                <p>Email: {selectedWorker.email}</p>
              </div>
            )}
            <p className="text-red-500 text-sm mt-4 text-center">
              This action cannot be undone.
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteWorkerDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteWorker}
              disabled={deleteWorkerMutation.isPending}
            >
              {deleteWorkerMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete Worker
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModeratorDashboard;
