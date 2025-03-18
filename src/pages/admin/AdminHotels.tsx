
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hotelAPI } from '@/services/api';
import { Hotel } from '@/types';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, PencilIcon, Plus, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const hotelSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  type: z.string().min(2, 'Type is required'),
  city: z.string().min(2, 'City is required'),
  address: z.string().min(2, 'Address is required'),
  distance: z.string().min(1, 'Distance is required'),
  title: z.string().min(2, 'Title is required'),
  desc: z.string().min(10, 'Description must be at least 10 characters'),
  rating: z.coerce.number().min(0).max(5),
  cheapestPrice: z.coerce.number().min(1, 'Price is required'),
  featured: z.boolean().default(false),
});

type HotelFormValues = z.infer<typeof hotelSchema>;

const AdminHotels = () => {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      name: '',
      type: '',
      city: '',
      address: '',
      distance: '',
      title: '',
      desc: '',
      rating: 0,
      cheapestPrice: 0,
      featured: false,
    },
  });

  const editForm = useForm<HotelFormValues>({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      name: '',
      type: '',
      city: '',
      address: '',
      distance: '',
      title: '',
      desc: '',
      rating: 0,
      cheapestPrice: 0,
      featured: false,
    },
  });

  // Fetch all hotels
  const { data: hotels, isLoading, error } = useQuery({
    queryKey: ['hotels'],
    queryFn: hotelAPI.getAllHotels,
  });

  // Create hotel mutation
  const createHotelMutation = useMutation({
    mutationFn: hotelAPI.createHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast.success('Hotel created successfully');
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(`Failed to create hotel: ${error.message}`);
    }
  });

  // Update hotel mutation
  const updateHotelMutation = useMutation({
    mutationFn: (data: { id: string, hotelData: Partial<Hotel> }) => 
      hotelAPI.updateHotel(data.id, data.hotelData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast.success('Hotel updated successfully');
      setIsEditDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to update hotel: ${error.message}`);
    }
  });

  // Delete hotel mutation
  const deleteHotelMutation = useMutation({
    mutationFn: hotelAPI.deleteHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast.success('Hotel deleted successfully');
      setIsDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete hotel: ${error.message}`);
    }
  });

  const onCreateSubmit = (data: HotelFormValues) => {
    createHotelMutation.mutate({
      ...data,
      photos: [],
      rooms: [],
    });
  };

  const onEditSubmit = (data: HotelFormValues) => {
    if (selectedHotel?._id) {
      updateHotelMutation.mutate({
        id: selectedHotel._id,
        hotelData: {
          ...data,
          // Preserve existing values that aren't being updated
          photos: selectedHotel.photos,
          rooms: selectedHotel.rooms,
        },
      });
    }
  };

  const handleDelete = () => {
    if (selectedHotel?._id) {
      deleteHotelMutation.mutate(selectedHotel._id);
    }
  };

  const handleEditClick = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    editForm.reset({
      name: hotel.name,
      type: hotel.type,
      city: hotel.city,
      address: hotel.address,
      distance: hotel.distance,
      title: hotel.title,
      desc: hotel.desc,
      rating: hotel.rating,
      cheapestPrice: hotel.cheapestPrice,
      featured: hotel.featured,
    });
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
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
        <p className="text-xl font-medium mb-2">Unable to load hotels</p>
        <p className="text-muted-foreground">
          There was an error fetching the hotels. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hotel Management</h2>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-hotel-500 hover:bg-hotel-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Hotel
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hotels && hotels.length > 0 ? (
              hotels.map((hotel: Hotel) => (
                <TableRow key={hotel._id}>
                  <TableCell className="font-medium">{hotel.name}</TableCell>
                  <TableCell>{hotel.city}</TableCell>
                  <TableCell>{hotel.type}</TableCell>
                  <TableCell>{hotel.rating}</TableCell>
                  <TableCell>${hotel.cheapestPrice}</TableCell>
                  <TableCell>{hotel.featured ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(hotel)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedHotel(hotel);
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
                  No hotels found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Hotel Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Hotel</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onCreateSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Grand Hotel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Hotel, Resort" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Full address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="distance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distance from City Center</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 500m, 2km" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating (0-5)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="5" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Short descriptive title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed description of the hotel"
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
                name="cheapestPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cheapest Price</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" placeholder="Price in USD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Featured Hotel
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Featured hotels appear on the homepage
                      </p>
                    </div>
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
                  disabled={createHotelMutation.isPending}
                >
                  {createHotelMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Hotel"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Hotel Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Hotel</DialogTitle>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              {/* Same form fields as create form */}
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Grand Hotel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Hotel, Resort" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Full address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="distance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distance from City Center</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 500m, 2km" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating (0-5)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="5" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Short descriptive title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed description of the hotel"
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
                name="cheapestPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cheapest Price</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" placeholder="Price in USD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Featured Hotel
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Featured hotels appear on the homepage
                      </p>
                    </div>
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
                  disabled={updateHotelMutation.isPending}
                >
                  {updateHotelMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    "Update Hotel"
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
            <DialogTitle>Delete Hotel</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-center">Are you sure you want to delete this hotel?</p>
            {selectedHotel && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="font-medium">Hotel Details:</p>
                <p>Name: {selectedHotel.name}</p>
                <p>Location: {selectedHotel.city}</p>
              </div>
            )}
            <p className="text-red-500 text-sm mt-4 text-center">
              This action cannot be undone. All rooms and bookings associated with this hotel will also be deleted.
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
              disabled={deleteHotelMutation.isPending}
            >
              {deleteHotelMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete Hotel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminHotels;
