
import React from 'react';
import { format } from 'date-fns';
import { Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

const BookingReceipt = ({ booking, hotel, room, open, onClose }) => {
  // Generate a random receipt number if not available
  const receiptNumber = booking.receipt?.receiptNumber || `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  
  // Get issue date or default to booking creation date or current date
  const issueDate = booking.receipt?.issueDate || booking.createdAt || new Date();
  
  // Calculate nights of stay
  const startDate = new Date(booking.dateStart);
  const endDate = new Date(booking.dateEnd);
  const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Calculate price breakdown
  const roomRate = room.price || (booking.totalPrice / nights);
  const taxRate = 0.1; // 10% tax
  const tax = booking.totalPrice * taxRate;
  const subtotal = booking.totalPrice - tax;
  
  // Handle print action
  const handlePrint = () => {
    window.print();
  };
  
  // Handle download action (simulated)
  const handleDownload = () => {
    alert('Receipt download functionality will be implemented.');
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Booking Receipt</DialogTitle>
        </DialogHeader>
        
        {/* Receipt content - printable section */}
        <div className="receipt-content" id="receipt-to-print">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-hotel-600">StayHaven</h2>
              <p className="text-sm text-muted-foreground mt-1">Your Home Away From Home</p>
            </div>
            <div className="text-right">
              <h3 className="font-medium">Receipt</h3>
              <p className="text-sm text-muted-foreground mt-1">#{receiptNumber}</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(issueDate), 'MMMM dd, yyyy')}
              </p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          {/* Hotel & Guest Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Hotel Details</h4>
              <p className="text-sm">{hotel.name}</p>
              <p className="text-sm text-muted-foreground">{hotel.address}</p>
              <p className="text-sm text-muted-foreground">{hotel.city}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Booking Details</h4>
              <p className="text-sm">Booking ID: {booking._id || 'N/A'}</p>
              <p className="text-sm text-muted-foreground">
                Check-in: {format(new Date(booking.dateStart), 'MMM dd, yyyy')}
              </p>
              <p className="text-sm text-muted-foreground">
                Check-out: {format(new Date(booking.dateEnd), 'MMM dd, yyyy')}
              </p>
              <p className="text-sm text-muted-foreground">
                Room: {room.title} (Room {booking.roomNumber})
              </p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          {/* Charges Breakdown */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3">Charges</h4>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{room.title} x {nights} night{nights > 1 ? 's' : ''}</span>
                <span>{formatCurrency(roomRate * nights)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tax (10%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatCurrency(booking.totalPrice)}</span>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          {/* Payment Info */}
          <div>
            <h4 className="text-sm font-medium mb-2">Payment Information</h4>
            <p className="text-sm">Payment Status: <span className="text-green-600 font-medium">Paid</span></p>
            <p className="text-sm text-muted-foreground">Payment Method: Credit Card (xxxx-xxxx-xxxx-1234)</p>
            <p className="text-sm text-muted-foreground">Payment Date: {format(new Date(issueDate), 'MMM dd, yyyy')}</p>
          </div>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Thank you for choosing StayHaven. We hope you enjoy your stay!</p>
            <p className="mt-1">For any queries, please contact us at support@stayhaven.com</p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end space-x-2 mt-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingReceipt;
