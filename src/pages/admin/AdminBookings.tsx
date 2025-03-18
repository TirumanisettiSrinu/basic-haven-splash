
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { bookingAPI, hotelAPI, userAPI } from '@/services/api';
import { Booking, Hotel, User } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Hotel as HotelIcon, Users, Calendar, DollarSign, Edit, Trash, Eye } from 'lucide-react';
import { format } from 'date-fns';

const AdminBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bookingsData, usersData, hotelsData] = await Promise.all([
          bookingAPI.getAllBookings(),
          userAPI.getAllUsers(),
          hotelAPI.getAllHotels(),
        ]);
        
        setBookings(bookingsData);
        setUsers(usersData);
        setHotels(hotelsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load bookings data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewDialogOpen(true);
  };

  const handleDeleteConfirmation = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDeleteDialogOpen(true);
  };

  const handleStatusChange = async (bookingId: string, status: string) => {
    try {
      await bookingAPI.updateBooking(bookingId, { status: status as Booking['status'] });
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: status as Booking['status'] } : booking
      ));
      toast.success('Booking status updated successfully');
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const handleDeleteBooking = async () => {
    if (!selectedBooking?._id) return;
    
    try {
      await bookingAPI.deleteBooking(selectedBooking._id);
      setBookings(bookings.filter(booking => booking._id !== selectedBooking._id));
      setIsDeleteDialogOpen(false);
      toast.success('Booking deleted successfully');
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
  };

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === statusFilter);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Bookings</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium">Filter Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading bookings...</div>
      ) : filteredBookings.length === 0 ? (
        <Card className="p-8 text-center">No bookings found.</Card>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Hotel</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => {
                const user = users.find(u => u._id === booking.userId);
                const hotel = hotels.find(h => h._id === booking.hotelId);
                
                return (
                  <TableRow key={booking._id}>
                    <TableCell className="font-medium">{booking._id?.substring(0, 8)}...</TableCell>
                    <TableCell>{user?.username || 'Unknown'}</TableCell>
                    <TableCell>{hotel?.name || 'Unknown'}</TableCell>
                    <TableCell>Room {booking.roomNumber}</TableCell>
                    <TableCell>{format(new Date(booking.dateStart), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{format(new Date(booking.dateEnd), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>${booking.totalPrice}</TableCell>
                    <TableCell>
                      <Select 
                        value={booking.status} 
                        onValueChange={(value) => handleStatusChange(booking._id || '', value)}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleViewBooking(booking)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleEditBooking(booking)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteConfirmation(booking)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* View Booking Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium flex items-center mb-2">
                    <Users className="mr-2 h-4 w-4" /> Guest
                  </h3>
                  <p>{users.find(u => u._id === selectedBooking.userId)?.username || 'Unknown'}</p>
                </div>
                <div>
                  <h3 className="font-medium flex items-center mb-2">
                    <HotelIcon className="mr-2 h-4 w-4" /> Hotel
                  </h3>
                  <p>{hotels.find(h => h._id === selectedBooking.hotelId)?.name || 'Unknown'}</p>
                </div>
                <div>
                  <h3 className="font-medium flex items-center mb-2">
                    <Calendar className="mr-2 h-4 w-4" /> Check In
                  </h3>
                  <p>{format(new Date(selectedBooking.dateStart), 'PPP')}</p>
                </div>
                <div>
                  <h3 className="font-medium flex items-center mb-2">
                    <Calendar className="mr-2 h-4 w-4" /> Check Out
                  </h3>
                  <p>{format(new Date(selectedBooking.dateEnd), 'PPP')}</p>
                </div>
                <div>
                  <h3 className="font-medium flex items-center mb-2">
                    <DollarSign className="mr-2 h-4 w-4" /> Total Price
                  </h3>
                  <p>${selectedBooking.totalPrice}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Status</h3>
                  <p className="capitalize">{selectedBooking.status}</p>
                </div>
              </div>
              
              {selectedBooking.receipt && (
                <div className="mt-4 p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Receipt</h3>
                  <div className="text-sm">
                    <p>Receipt Number: {selectedBooking.receipt.receiptNumber}</p>
                    <p>Issue Date: {
                      selectedBooking.receipt.issueDate ? 
                      format(new Date(selectedBooking.receipt.issueDate), 'PPP') : 'N/A'
                    }</p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteBooking}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBookings;
