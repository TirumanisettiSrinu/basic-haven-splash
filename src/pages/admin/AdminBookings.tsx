import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingAPI, hotelAPI, userAPI } from '@/services/api';
import { Booking, Hotel, User } from '@/types';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Eye, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import BookingReceipt from '@/components/BookingReceipt';

const AdminBookings = () => {
  const queryClient = useQueryClient();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const { data: bookings, isLoading: isLoadingBookings, error: bookingsError } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => bookingAPI.getAllBookings(),
  });

  const { data: hotels } = useQuery({
    queryKey: ['hotels'],
    queryFn: hotelAPI.getAllHotels,
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: userAPI.getAllUsers,
  });

  const updateBookingMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      bookingAPI.updateBooking(id, { status: status as any }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('Booking status updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update booking: ${error.message}`);
    }
  });

  const deleteBookingMutation = useMutation({
    mutationFn: bookingAPI.deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('Booking deleted successfully');
      setIsDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete booking: ${error.message}`);
    }
  });

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    updateBookingMutation.mutate({ id: bookingId, status: newStatus });
  };

  const handleDeleteBooking = () => {
    if (selectedBooking?._id) {
      deleteBookingMutation.mutate(selectedBooking._id);
    }
  };

  const getHotelName = (hotelId: string) => {
    if (!hotels) return 'Unknown Hotel';
    const hotel = hotels.find((h: Hotel) => h._id === hotelId);
    return hotel ? hotel.name : 'Unknown Hotel';
  };

  const getUserName = (userId: string) => {
    if (!users) return 'Unknown User';
    const user = users.find((u: User) => u._id === userId);
    return user ? user.username : 'Unknown User';
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoadingBookings) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-hotel-500" />
      </div>
    );
  }

  if (bookingsError) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-xl font-medium mb-2">Unable to load bookings</p>
        <p className="text-muted-foreground">
          There was an error fetching the bookings. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bookings Management</h2>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Hotel</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings && bookings.length > 0 ? (
              bookings.map((booking: Booking) => (
                <TableRow key={booking._id}>
                  <TableCell className="font-medium">{booking._id?.substring(0, 8)}...</TableCell>
                  <TableCell>{getHotelName(booking.hotelId)}</TableCell>
                  <TableCell>{getUserName(booking.userId)}</TableCell>
                  <TableCell>{format(new Date(booking.dateStart), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{format(new Date(booking.dateEnd), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusBadgeColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                      <Select
                        value={booking.status}
                        onValueChange={(value) => handleStatusChange(booking._id as string, value)}
                      >
                        <SelectTrigger className="w-[120px] h-7">
                          <SelectValue placeholder="Change" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell>${booking.totalPrice}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setIsReceiptDialogOpen(true);
                      }}
                    >
                      <span className="text-xs">Receipt</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedBooking(booking);
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
                <TableCell colSpan={8} className="text-center py-4">
                  No bookings found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Booking ID</p>
                  <p className="font-medium">{selectedBooking._id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusBadgeColor(selectedBooking.status)}>
                    {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Hotel</p>
                  <p className="font-medium">{getHotelName(selectedBooking.hotelId)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Room</p>
                  <p className="font-medium">Room #{selectedBooking.roomNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Check-in</p>
                  <p className="font-medium">{format(new Date(selectedBooking.dateStart), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Check-out</p>
                  <p className="font-medium">{format(new Date(selectedBooking.dateEnd), 'MMM dd, yyyy')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Guest</p>
                  <p className="font-medium">{getUserName(selectedBooking.userId)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-medium">${selectedBooking.totalPrice}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Booking Date</p>
                <p className="font-medium">
                  {selectedBooking.createdAt 
                    ? format(new Date(selectedBooking.createdAt), 'MMM dd, yyyy') 
                    : 'Not available'}
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
            <Button 
              className="bg-hotel-500 hover:bg-hotel-600"
              onClick={() => {
                setIsViewDialogOpen(false);
                setIsReceiptDialogOpen(true);
              }}
            >
              View Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Booking Receipt</DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <BookingReceipt 
              booking={selectedBooking} 
              hotel={hotels?.find((h: Hotel) => h._id === selectedBooking.hotelId)} 
              user={users?.find((u: User) => u._id === selectedBooking.userId)}
            />
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsReceiptDialogOpen(false)}
            >
              Close
            </Button>
            <Button className="bg-hotel-500 hover:bg-hotel-600">
              Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Booking</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-center">Are you sure you want to delete this booking?</p>
            {selectedBooking && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="font-medium">Booking Details:</p>
                <p>ID: {selectedBooking._id?.substring(0, 8)}...</p>
                <p>Hotel: {getHotelName(selectedBooking.hotelId)}</p>
                <p>Guest: {getUserName(selectedBooking.userId)}</p>
                <p>Dates: {format(new Date(selectedBooking.dateStart), 'MMM dd')} - {format(new Date(selectedBooking.dateEnd), 'MMM dd, yyyy')}</p>
              </div>
            )}
            <p className="text-red-500 text-sm mt-4 text-center">
              This action cannot be undone.
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
              onClick={handleDeleteBooking}
              disabled={deleteBookingMutation.isPending}
            >
              {deleteBookingMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBookings;
