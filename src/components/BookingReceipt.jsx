
import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { FileText, Printer, Download } from 'lucide-react';

const BookingReceipt = ({ booking, hotel, room, user, open, onClose }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };
  
  const handleDownload = () => {
    // This is a basic implementation - in a real app you'd generate a PDF
    const fileContent = `
      BOOKING RECEIPT
      
      BOOKING ID: ${booking._id}
      DATE: ${format(new Date(), 'MMM dd, yyyy')}
      
      HOTEL: ${hotel.name}
      ADDRESS: ${hotel.address}, ${hotel.city}
      
      ROOM: ${room?.title || 'Standard Room'} (Room ${booking.roomNumber})
      CHECK-IN: ${format(new Date(booking.dateStart), 'MMM dd, yyyy')}
      CHECK-OUT: ${format(new Date(booking.dateEnd), 'MMM dd, yyyy')}
      
      TOTAL AMOUNT: $${booking.totalPrice}
      STATUS: ${booking.status.toUpperCase()}
    `;
    
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-receipt-${booking._id}.txt`;
    a.click();
    
    URL.revokeObjectURL(url);
  };
  
  const isInDialog = open !== undefined && onClose !== undefined;
  
  if (isInDialog) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Booking Receipt
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-4 space-y-6 print:p-0" id="receipt-content">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">Booking Receipt</h2>
                <p className="text-muted-foreground">
                  {format(new Date(), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Booking ID:</p>
                <p className="font-mono">{booking._id}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Hotel Information</h3>
                <p className="font-medium">{hotel.name}</p>
                <p>{hotel.address}</p>
                <p>{hotel.city}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Guest Information</h3>
                <p>Booking made by: {user ? user.username : booking.userId}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Booking Details</h3>
              <div className="rounded-md border p-4 space-y-2">
                <div className="flex justify-between">
                  <span>Room Type:</span>
                  <span className="font-medium">{room?.title || 'Standard Room'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Room Number:</span>
                  <span>{booking.roomNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-in:</span>
                  <span>{format(new Date(booking.dateStart), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out:</span>
                  <span>{format(new Date(booking.dateEnd), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-medium ${
                    booking.status === 'confirmed' ? 'text-green-600' : 
                    booking.status === 'cancelled' ? 'text-red-600' :
                    'text-blue-600'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Payment Summary</h3>
              <div className="rounded-md border p-4">
                <div className="flex justify-between font-medium text-lg mb-2">
                  <span>Total Amount Paid:</span>
                  <span>${booking.totalPrice}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Payment was successful. This serves as your official receipt.
                </p>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground print:mt-8">
              <p>Thank you for choosing StayHaven for your accommodation needs.</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 print:hidden">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="default" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <div className="p-4 space-y-6 border rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Booking Receipt</h2>
          <p className="text-muted-foreground">
            {format(new Date(), 'MMM dd, yyyy')}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Booking ID:</p>
          <p className="font-mono">{booking._id}</p>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Hotel Information</h3>
          <p className="font-medium">{hotel.name}</p>
          <p>{hotel.address}</p>
          <p>{hotel.city}</p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Guest Information</h3>
          <p>Booking made by: {user ? user.username : booking.userId}</p>
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold mb-2">Booking Details</h3>
        <div className="rounded-md border p-4 space-y-2">
          <div className="flex justify-between">
            <span>Room Type:</span>
            <span className="font-medium">{room?.title || 'Standard Room'}</span>
          </div>
          <div className="flex justify-between">
            <span>Room Number:</span>
            <span>{booking.roomNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Check-in:</span>
            <span>{format(new Date(booking.dateStart), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span>Check-out:</span>
            <span>{format(new Date(booking.dateEnd), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className={`font-medium ${
              booking.status === 'confirmed' ? 'text-green-600' : 
              booking.status === 'cancelled' ? 'text-red-600' :
              'text-blue-600'
            }`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold mb-2">Payment Summary</h3>
        <div className="rounded-md border p-4">
          <div className="flex justify-between font-medium text-lg mb-2">
            <span>Total Amount Paid:</span>
            <span>${booking.totalPrice}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Payment was successful. This serves as your official receipt.
          </p>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground print:mt-8">
        <p>Thank you for choosing StayHaven for your accommodation needs.</p>
      </div>
      
      <div className="flex justify-end space-x-2 print:hidden">
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button variant="default" size="sm" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>
    </div>
  );
};

export default BookingReceipt;
