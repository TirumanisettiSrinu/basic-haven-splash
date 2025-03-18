
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workerAPI, hotelAPI, roomAPI } from '@/services/api';
import { Worker, Room, Hotel } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, ClipboardList, CheckSquare, AlertTriangle, Hotel as HotelIcon, DoorOpen, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const WorkerDashboard = () => {
  const { state } = useAuth();
  const { user, loading } = state;
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'assigned' | 'cleaned' | 'needs-cleaning'>('assigned');

  // Query to get worker data
  const { data: workerData, isLoading: isWorkerLoading } = useQuery({
    queryKey: ['worker', user?._id],
    queryFn: async () => {
      // First get all workers
      const allWorkers = await workerAPI.getAllWorkers();
      // Then find the worker with matching userId
      return allWorkers.find((w: Worker) => w.userId === user?._id) || null;
    },
    enabled: !!user?._id,
  });

  // Query to get hotel data
  const { data: hotel, isLoading: isHotelLoading } = useQuery({
    queryKey: ['hotel', workerData?.hotelId],
    queryFn: () => hotelAPI.getHotelById(workerData?.hotelId as string),
    enabled: !!workerData?.hotelId,
  });

  // Query to get room data for assigned rooms
  const { data: assignedRooms, isLoading: isRoomsLoading } = useQuery({
    queryKey: ['assigned-rooms', workerData?.hotelId],
    queryFn: async () => {
      if (!workerData || !workerData.assignedRooms || !workerData.hotelId) return [];
      
      const hotelRooms = await roomAPI.getRoomsForHotel(workerData.hotelId);
      
      // Filter to only include assigned rooms
      const assignedRoomIds = workerData.assignedRooms.map(r => r.roomId);
      return hotelRooms.filter((room: Room) => assignedRoomIds.includes(room._id as string));
    },
    enabled: !!workerData?.hotelId && !!workerData?.assignedRooms?.length,
  });

  // Mutation to mark a room as cleaned
  const markRoomAsCleanedMutation = useMutation({
    mutationFn: ({ workerId, roomId }: { workerId: string, roomId: string }) => 
      workerAPI.markRoomAsCleaned(workerId, roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assigned-rooms'] });
      toast.success('Room marked as cleaned');
    },
    onError: (error: any) => {
      toast.error(`Failed to mark room as cleaned: ${error.message}`);
    }
  });

  const handleMarkAsCleaned = (roomId: string) => {
    if (workerData?._id) {
      markRoomAsCleanedMutation.mutate({
        workerId: workerData._id as string,
        roomId,
      });
    }
  };

  // Get filtered rooms based on the active tab
  const getFilteredRooms = () => {
    if (!assignedRooms) return [];
    
    switch (activeTab) {
      case 'cleaned':
        return assignedRooms.filter(room => room.isCleaned);
      case 'needs-cleaning':
        return assignedRooms.filter(room => !room.isCleaned);
      case 'assigned':
      default:
        return assignedRooms;
    }
  };

  const filteredRooms = getFilteredRooms();

  if (loading || isWorkerLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-hotel-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!workerData) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow pt-16 md:pt-20 pb-10 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Not a Worker</h2>
            <p className="mb-6 text-muted-foreground">
              Your account is not registered as a worker. Please contact an administrator or moderator if you believe this is an error.
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
            <h1 className="text-3xl font-bold mb-2">Worker Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {workerData.name}. Manage your assigned rooms and tasks.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <HotelIcon className="h-5 w-5 mr-2 text-hotel-600" />
                  Assigned Hotel
                </CardTitle>
                <CardDescription>Your current workplace</CardDescription>
              </CardHeader>
              <CardContent>
                {isHotelLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-hotel-500" />
                  </div>
                ) : hotel ? (
                  <div>
                    <h3 className="font-semibold text-lg">{hotel.name}</h3>
                    <p className="text-muted-foreground">{hotel.address}, {hotel.city}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No hotel assigned</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-hotel-600" />
                  Today's Tasks
                </CardTitle>
                <CardDescription>Rooms that need attention</CardDescription>
              </CardHeader>
              <CardContent>
                {isRoomsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-hotel-500" />
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold">{filteredRooms.filter(room => !room.isCleaned).length}</span>
                        <span className="text-muted-foreground ml-2">rooms need cleaning</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Last updated: {format(new Date(), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <CheckSquare className="h-5 w-5 mr-2 text-hotel-600" />
                  Completed Tasks
                </CardTitle>
                <CardDescription>Your work progress</CardDescription>
              </CardHeader>
              <CardContent>
                {isRoomsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-hotel-500" />
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold">{filteredRooms.filter(room => room.isCleaned).length}</span>
                        <span className="text-muted-foreground ml-2">rooms cleaned</span>
                      </div>
                      <div>
                        <span className="text-2xl font-bold">
                          {assignedRooms?.length ? 
                            Math.round(filteredRooms.filter(room => room.isCleaned).length / assignedRooms.length * 100) : 
                            0
                          }%
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Keep up the good work!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center">
                <ClipboardList className="h-5 w-5 mr-2" />
                Room Assignments
              </h2>
              
              <div className="flex space-x-2">
                <Button 
                  variant={activeTab === 'assigned' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('assigned')}
                  className={activeTab === 'assigned' ? 'bg-hotel-500 hover:bg-hotel-600' : ''}
                >
                  All ({assignedRooms?.length || 0})
                </Button>
                <Button 
                  variant={activeTab === 'needs-cleaning' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('needs-cleaning')}
                  className={activeTab === 'needs-cleaning' ? 'bg-hotel-500 hover:bg-hotel-600' : ''}
                >
                  Needs Cleaning ({assignedRooms?.filter(r => !r.isCleaned).length || 0})
                </Button>
                <Button 
                  variant={activeTab === 'cleaned' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('cleaned')}
                  className={activeTab === 'cleaned' ? 'bg-hotel-500 hover:bg-hotel-600' : ''}
                >
                  Cleaned ({assignedRooms?.filter(r => r.isCleaned).length || 0})
                </Button>
              </div>
            </div>
            
            <div className="p-4">
              {isRoomsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-hotel-500" />
                </div>
              ) : filteredRooms.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Room Number</TableHead>
                        <TableHead>Room Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Cleaned</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRooms.map((room) => (
                        <TableRow key={room._id}>
                          <TableCell>
                            <div className="flex items-center">
                              <DoorOpen className="h-4 w-4 mr-2 text-hotel-500" />
                              {room.roomNumbers.map(r => r.number).join(', ')}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{room.title}</TableCell>
                          <TableCell>
                            <Badge variant={room.isCleaned ? "success" : "destructive"} className={`${
                              room.isCleaned ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {room.isCleaned ? 'Cleaned' : 'Needs Cleaning'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {room.updatedAt ? format(new Date(room.updatedAt), 'MMM d, yyyy') : 'Not yet cleaned'}
                          </TableCell>
                          <TableCell className="text-right">
                            {!room.isCleaned && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                                onClick={() => handleMarkAsCleaned(room._id as string)}
                                disabled={markRoomAsCleanedMutation.isPending}
                              >
                                {markRoomAsCleanedMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <CheckSquare className="h-4 w-4 mr-2" />
                                )}
                                Mark as Cleaned
                              </Button>
                            )}
                            {room.isCleaned && (
                              <span className="text-muted-foreground text-sm">Already cleaned</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No rooms match the current filter</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WorkerDashboard;
