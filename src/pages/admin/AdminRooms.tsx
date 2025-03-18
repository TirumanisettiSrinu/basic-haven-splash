
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomAPI, hotelAPI } from '@/services/api';
import { Room, Hotel } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, PencilIcon, Plus, Trash2, AlertCircle, Check, X } from 'lucide-react';
import { toast } from 'sonner';

const roomSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  price: z.coerce.number().min(1, 'Price must be at least 1'),
  maxPeople: z.coerce.number().min(1, 'Max people must be at least 1'),
  desc: z.string().min(10, 'Description must be at least 10 characters'),
  roomNumbers: z.string().refine(value => {
    try {
      const numbers = value.split(',').map(n => parseInt(n.trim()));
      return numbers.every(n => !isNaN(n) && n > 0);
    } catch {
      return false;
    }
  }, {
    message: 'Room numbers must be comma-separated integers (e.g., 101, 102, 103)'
  }),
  hotelId: z.string().min(1, 'Hotel is required'),
});

type RoomFormValues = z.infer<typeof roomSchema>;

const AdminRooms = () => {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      title: '',
      price: 0,
      maxPeople: 1,
      desc: '',
      roomNumbers: '',
      hotelId: '',
    },
  });

  const editForm = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      title: '',
      price: 0,
      maxPeople: 1,
      desc: '',
      roomNumbers: '',
      hotelId: '',
    },
  });

  // Fetch hotels
  const { data: hotels, isLoading: isLoadingHotels } = useQuery({
    queryKey: ['hotels'],
    queryFn: hotelAPI.getAllHotels,
  });

  // Fetch rooms for all hotels
  const { data: allRooms, isLoading, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      if (!hotels) return [];
      
      // Fetch rooms for all hotels
      const promises = hotels.map((hotel: Hotel) => 
        roomAPI.getRoomsForHotel(hotel._id as string)
          .catch(() => []) // Handle case where hotel has no rooms
      );
      
      const results = await Promise.all(promises);
      
      // Flatten the array of room arrays
      return results.flat();
    },
    enabled: !!hotels,
  });

  // Create room mutation
  const createRoomMutation = useMutation({
    mutationFn: (data: { hotelId: string, roomData: Partial<Room> }) => 
      roomAPI.createRoom(data.hotelId, data.roomData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast.success('Room created successfully');
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(`Failed to create room: ${error.message}`);
    }
  });

  // Update room mutation
  const updateRoomMutation = useMutation({
    mutationFn: (data: { id: string, roomData: Partial<Room> }) => 
      roomAPI.updateRoom(data.id, data.roomData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room updated successfully');
      setIsEditDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to update room: ${error.message}`);
    }
  });

  // Delete room mutation
  const deleteRoomMutation = useMutation({
    mutationFn: (data: { id: string, hotelId: string }) => 
      roomAPI.deleteRoom(data.id, data.hotelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast.success('Room deleted successfully');
      setIsDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete room: ${error.message}`);
    }
  });

  const onCreateSubmit = (data: RoomFormValues) => {
    // Convert roomNumbers string to array of room number objects
    const roomNumbersArray = data.roomNumbers.split(',').map(num => ({
      number: parseInt(num.trim()),
      unavailableDates: [],
    }));
    
    createRoomMutation.mutate({
      hotelId: data.hotelId,
      roomData: {
        title: data.title,
        price: data.price,
        maxPeople: data.maxPeople,
        desc: data.desc,
        roomNumbers: roomNumbersArray,
        isCleaned: true,
        isAssigned: false,
        bookedBy: null,
      },
    });
  };

  const onEditSubmit = (data: RoomFormValues) => {
    if (selectedRoom?._id) {
      // For editing, we won't change the room numbers
      updateRoomMutation.mutate({
        id: selectedRoom._id,
        roomData: {
          title: data.title,
          price: data.price,
          maxPeople: data.maxPeople,
          desc: data.desc,
        },
      });
    }
  };

  const handleDelete = () => {
    if (selectedRoom?._id) {
      const hotelId = editForm.getValues('hotelId');
      deleteRoomMutation.mutate({
        id: selectedRoom._id,
        hotelId: hotelId,
      });
    }
  };

  const handleEditClick = (room: Room) => {
    setSelectedRoom(room);
    
    // Find which hotel this room belongs to
    let hotelId = '';
    if (hotels) {
      for (const hotel of hotels) {
        if (hotel.rooms.includes(room._id as string)) {
          hotelId = hotel._id as string;
          break;
        }
      }
    }
    
    // Get room numbers as comma-separated string
    const roomNumbersString = room.roomNumbers
      .map(r => r.number)
      .join(', ');
    
    editForm.reset({
      title: room.title,
      price: room.price,
      maxPeople: room.maxPeople,
      desc: room.desc,
      roomNumbers: roomNumbersString,
      hotelId: hotelId,
    });
    
    setIsEditDialogOpen(true);
  };

  const getHotelName = (roomId: string) => {
    if (!hotels) return 'Unknown Hotel';
    
    for (const hotel of hotels) {
      if (hotel.rooms.includes(roomId)) {
        return hotel.name;
      }
    }
    
    return 'Unknown Hotel';
  };

  if (isLoading || isLoadingHotels) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-hotel-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-xl font-medium mb-2">Unable to load rooms</p>
        <p className="text-muted-foreground">
          There was an error fetching the rooms. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Room Management</h2>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-hotel-500 hover:bg-hotel-600"
          disabled={!hotels || hotels.length === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Room
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room Type</TableHead>
              <TableHead>Hotel</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Max People</TableHead>
              <TableHead>Room Numbers</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allRooms && allRooms.length > 0 ? (
              allRooms.map((room: Room) => (
                <TableRow key={room._id}>
                  <TableCell className="font-medium">{room.title}</TableCell>
                  <TableCell>{getHotelName(room._id as string)}</TableCell>
                  <TableCell>${room.price}</TableCell>
                  <TableCell>{room.maxPeople}</TableCell>
                  <TableCell>
                    <span className="text-xs">
                      {room.roomNumbers.map(r => r.number).join(', ')}
                    </span>
                  </TableCell>
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
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(room)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedRoom(room);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No rooms found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Room Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onCreateSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="hotelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Hotel</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a hotel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hotels && hotels.map((hotel: Hotel) => (
                          <SelectItem key={hotel._id} value={hotel._id as string}>
                            {hotel.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Deluxe King Room" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Night</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" placeholder="Price in USD" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="maxPeople"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max People</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" placeholder="e.g., 2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Room description"
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="roomNumbers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Numbers</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 101, 102, 103" {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Enter comma-separated room numbers
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-hotel-500 hover:bg-hotel-600"
                  disabled={createRoomMutation.isPending}
                >
                  {createRoomMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Room"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Room Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="hotelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a hotel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hotels && hotels.map((hotel: Hotel) => (
                          <SelectItem key={hotel._id} value={hotel._id as string}>
                            {hotel.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Hotel cannot be changed</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Deluxe King Room" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Night</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" placeholder="Price in USD" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="maxPeople"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max People</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" placeholder="e.g., 2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Room description"
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="roomNumbers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Numbers</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 101, 102, 103" {...field} disabled />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Room numbers cannot be changed after creation
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-hotel-500 hover:bg-hotel-600"
                  disabled={updateRoomMutation.isPending}
                >
                  {updateRoomMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    "Update Room"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Room</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-center">Are you sure you want to delete this room?</p>
            {selectedRoom && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="font-medium">Room Details:</p>
                <p>Title: {selectedRoom.title}</p>
                <p>Price: ${selectedRoom.price}</p>
                <p>Room Numbers: {selectedRoom.roomNumbers.map(r => r.number).join(', ')}</p>
              </div>
            )}
            <p className="text-red-500 text-sm mt-4 text-center">
              This action cannot be undone. All bookings for this room will also be affected.
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteRoomMutation.isPending}
            >
              {deleteRoomMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRooms;
