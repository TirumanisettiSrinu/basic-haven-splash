
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moderatorAPI, hotelAPI, userAPI } from '@/services/api';
import { Moderator, User, Hotel } from '@/types';
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
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, PencilIcon, Plus, Trash2, AlertCircle, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const moderatorSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  hotelId: z.string().min(1, 'Hotel is required'),
  permissions: z.object({
    canManageWorkers: z.boolean().default(true),
    canManageRooms: z.boolean().default(true),
    canViewBookings: z.boolean().default(true),
  }),
  isActive: z.boolean().default(true),
});

type ModeratorFormValues = z.infer<typeof moderatorSchema>;

const AdminModerators = () => {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedModerator, setSelectedModerator] = useState<Moderator | null>(null);

  const form = useForm<ModeratorFormValues>({
    resolver: zodResolver(moderatorSchema),
    defaultValues: {
      userId: '',
      hotelId: '',
      permissions: {
        canManageWorkers: true,
        canManageRooms: true,
        canViewBookings: true,
      },
      isActive: true,
    },
  });

  const editForm = useForm<ModeratorFormValues>({
    resolver: zodResolver(moderatorSchema),
    defaultValues: {
      userId: '',
      hotelId: '',
      permissions: {
        canManageWorkers: true,
        canManageRooms: true,
        canViewBookings: true,
      },
      isActive: true,
    },
  });

  // Fetch moderators
  const { data: moderators, isLoading, error } = useQuery({
    queryKey: ['moderators'],
    queryFn: moderatorAPI.getAllModerators,
  });

  // Fetch users
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: userAPI.getAllUsers,
  });

  // Fetch hotels
  const { data: hotels } = useQuery({
    queryKey: ['hotels'],
    queryFn: hotelAPI.getAllHotels,
  });

  // Create moderator mutation
  const createModeratorMutation = useMutation({
    mutationFn: moderatorAPI.createModerator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderators'] });
      queryClient.invalidateQueries({ queryKey: ['users'] }); // Update users to reflect moderator status
      toast.success('Moderator created successfully');
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(`Failed to create moderator: ${error.message}`);
    }
  });

  // Update moderator mutation
  const updateModeratorMutation = useMutation({
    mutationFn: (data: { id: string, moderatorData: Partial<Moderator> }) => 
      moderatorAPI.updateModerator(data.id, data.moderatorData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderators'] });
      toast.success('Moderator updated successfully');
      setIsEditDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to update moderator: ${error.message}`);
    }
  });

  // Delete moderator mutation
  const deleteModeratorMutation = useMutation({
    mutationFn: moderatorAPI.deleteModerator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderators'] });
      queryClient.invalidateQueries({ queryKey: ['users'] }); // Update users to reflect moderator status
      toast.success('Moderator removed successfully');
      setIsDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete moderator: ${error.message}`);
    }
  });

  const onCreateSubmit = (data: ModeratorFormValues) => {
    createModeratorMutation.mutate({
      userId: data.userId,
      hotelId: data.hotelId,
      permissions: data.permissions,
      isActive: data.isActive,
    });
  };

  const onEditSubmit = (data: ModeratorFormValues) => {
    if (selectedModerator?._id) {
      updateModeratorMutation.mutate({
        id: selectedModerator._id,
        moderatorData: {
          hotelId: data.hotelId,
          permissions: data.permissions,
          isActive: data.isActive,
        },
      });
    }
  };

  const handleDelete = () => {
    if (selectedModerator?._id) {
      deleteModeratorMutation.mutate(selectedModerator._id);
    }
  };

  const handleEditClick = (moderator: Moderator) => {
    setSelectedModerator(moderator);
    editForm.reset({
      userId: moderator.userId,
      hotelId: moderator.hotelId,
      permissions: {
        canManageWorkers: moderator.permissions.canManageWorkers,
        canManageRooms: moderator.permissions.canManageRooms,
        canViewBookings: moderator.permissions.canViewBookings,
      },
      isActive: moderator.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const getUserName = (userId: string) => {
    if (!users) return 'Unknown User';
    const user = users.find((u: User) => u._id === userId);
    return user ? user.username : 'Unknown User';
  };

  const getUserEmail = (userId: string) => {
    if (!users) return '';
    const user = users.find((u: User) => u._id === userId);
    return user ? user.email : '';
  };

  const getHotelName = (hotelId: string) => {
    if (!hotels) return 'Unknown Hotel';
    const hotel = hotels.find((h: Hotel) => h._id === hotelId);
    return hotel ? hotel.name : 'Unknown Hotel';
  };

  // Filter out users who are already moderators or admins
  const getAvailableUsers = () => {
    if (!users || !moderators) return [];
    
    const moderatorUserIds = moderators.map((mod: Moderator) => mod.userId);
    return users.filter((user: User) => 
      !moderatorUserIds.includes(user._id as string) && !user.isAdmin
    );
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
        <p className="text-xl font-medium mb-2">Unable to load moderators</p>
        <p className="text-muted-foreground">
          There was an error fetching the moderators. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Moderator Management</h2>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-hotel-500 hover:bg-hotel-600"
          disabled={getAvailableUsers().length === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Moderator
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Assigned Hotel</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {moderators && moderators.length > 0 ? (
              moderators.map((moderator: Moderator) => (
                <TableRow key={moderator._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-hotel-500" />
                      {getUserName(moderator.userId)}
                    </div>
                  </TableCell>
                  <TableCell>{getUserEmail(moderator.userId)}</TableCell>
                  <TableCell>{getHotelName(moderator.hotelId)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {moderator.permissions.canManageWorkers && (
                        <Badge variant="outline" className="bg-blue-50">Workers</Badge>
                      )}
                      {moderator.permissions.canManageRooms && (
                        <Badge variant="outline" className="bg-green-50">Rooms</Badge>
                      )}
                      {moderator.permissions.canViewBookings && (
                        <Badge variant="outline" className="bg-purple-50">Bookings</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      moderator.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {moderator.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(moderator)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedModerator(moderator);
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
                <TableCell colSpan={6} className="text-center py-4">
                  No moderators found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Moderator Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Moderator</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onCreateSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select User</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getAvailableUsers().map((user: User) => (
                          <SelectItem key={user._id} value={user._id as string}>
                            {user.username} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select a user to assign moderator privileges
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                            {hotel.name} ({hotel.city})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Assign the hotel this moderator will manage
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Permissions</h3>
                
                <FormField
                  control={form.control}
                  name="permissions.canManageWorkers"
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
                          Manage Workers
                        </FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Can add, edit, or remove workers
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="permissions.canManageRooms"
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
                          Manage Rooms
                        </FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Can manage room status and assignments
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="permissions.canViewBookings"
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
                          View Bookings
                        </FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Can view and manage bookings for their hotel
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Active Account
                        </FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Deactivated accounts cannot access moderator features
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
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
                  disabled={createModeratorMutation.isPending}
                >
                  {createModeratorMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Moderator"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Moderator Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Moderator</DialogTitle>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
              {/* User ID field (disabled in edit mode) */}
              <FormField
                control={editForm.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User</FormLabel>
                    <div className="font-medium text-sm px-3 py-2 border rounded-md bg-gray-50">
                      {getUserName(field.value)} ({getUserEmail(field.value)})
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Hotel selection */}
              <FormField
                control={editForm.control}
                name="hotelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Hotel</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a hotel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hotels && hotels.map((hotel: Hotel) => (
                          <SelectItem key={hotel._id} value={hotel._id as string}>
                            {hotel.name} ({hotel.city})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Permissions */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Permissions</h3>
                
                <FormField
                  control={editForm.control}
                  name="permissions.canManageWorkers"
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
                          Manage Workers
                        </FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Can add, edit, or remove workers
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="permissions.canManageRooms"
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
                          Manage Rooms
                        </FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Can manage room status and assignments
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="permissions.canViewBookings"
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
                          View Bookings
                        </FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Can view and manage bookings for their hotel
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Active Account
                        </FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Deactivated accounts cannot access moderator features
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
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
                  disabled={updateModeratorMutation.isPending}
                >
                  {updateModeratorMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    "Update Moderator"
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
            <DialogTitle>Remove Moderator</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-center">Are you sure you want to remove this moderator?</p>
            {selectedModerator && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="font-medium">Moderator Details:</p>
                <p>User: {getUserName(selectedModerator.userId)}</p>
                <p>Email: {getUserEmail(selectedModerator.userId)}</p>
                <p>Hotel: {getHotelName(selectedModerator.hotelId)}</p>
              </div>
            )}
            <p className="text-red-500 text-sm mt-4 text-center">
              This action cannot be undone. The user will lose all moderator privileges.
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
              disabled={deleteModeratorMutation.isPending}
            >
              {deleteModeratorMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Remove Moderator
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminModerators;
