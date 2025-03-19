
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { MapPin, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookingReceipt from './BookingReceipt';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

// Helper function to format dates
const formatDate = (dateString) => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return format(date, 'MMM dd, yyyy');
};

// Create a default Hotel object
const defaultHotel = {
  name: 'Unknown Hotel',
  city: 'Unknown Location',
  photos: [],
  type: 'hotel',
  address: 'Unknown Address',
  distance: '0 km',
  title: 'Unknown Hotel',
  desc: 'No description available',
  rating: 0,
  rooms: [],
  cheapestPrice: 0,
  featured: false
};

// Create a default Room object
const defaultRoom = {
  title: 'Standard Room',
  maxPeople: 2,
  price: 0,
  desc: 'No description available',
  roomNumbers: [],
  isCleaned: true,
  isAssigned: false,
  bookedBy: null
};

const BookingItem = ({ booking, onCancel, isDateInFuture }) => {
  const [showReceipt, setShowReceipt] = useState(false);
  const hotel = booking.hotel || defaultHotel;
  const room = booking.room || defaultRoom;
  
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Image */}
        <div className="md:col-span-3 aspect-[4/3] overflow-hidden bg-gray-100 flex items-center justify-center">
          {hotel.photos && hotel.photos[0] ? (
            <img 
              src={hotel.photos[0]} 
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400 text-center p-4">
              <div className="w-12 h-12 mx-auto mb-2 border-2 border-gray-300 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6" />
              </div>
              <p>No image</p>
            </div>
          )}
        </div>
        
        {/* Details */}
        <div className="p-4 md:col-span-6 flex flex-col">
          <div>
            <h3 className="font-medium text-lg">{hotel.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {hotel.city}
            </p>
          </div>
          
          <div className="mt-2 space-y-1">
            <p className="text-sm">
              <span className="font-medium">Room:</span> {room.title} (Room {booking.roomNumber})
            </p>
            <p className="text-sm">
              <span className="font-medium">Dates:</span> {formatDate(booking.dateStart)} - {formatDate(booking.dateEnd)}
            </p>
            <p className="text-sm">
              <span className="font-medium">Guests:</span> {room.maxPeople} max
            </p>
          </div>
          
          <div className="mt-auto pt-2 flex space-x-4">
            <Link 
              to={`/hotels/${booking.hotelId}`}
              className="text-hotel-500 hover:text-hotel-600 text-sm font-medium"
            >
              View Hotel
            </Link>
            <button 
              onClick={() => setShowReceipt(true)}
              className="text-gray-500 hover:text-gray-800 text-sm font-medium flex items-center"
            >
              <FileText className="h-3 w-3 mr-1" />
              View Receipt
            </button>
          </div>
        </div>
        
        {/* Price and Status */}
        <div className="p-4 bg-gray-50 md:col-span-3">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Price</p>
              <p className="text-lg font-semibold">${booking.totalPrice}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="flex items-center mt-1">
                {booking.status === 'confirmed' ? (
                  <>
                    <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-green-600 font-medium">Confirmed</span>
                  </>
                ) : booking.status === 'cancelled' ? (
                  <>
                    <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                    <span className="text-red-600 font-medium">Cancelled</span>
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 bg-gray-500 rounded-full mr-2"></span>
                    <span className="text-gray-600 font-medium">Completed</span>
                  </>
                )}
              </div>
            </div>
            
            {booking.status === 'confirmed' && isDateInFuture(booking.dateStart) && (
              <Button 
                variant="outline" 
                className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                onClick={() => onCancel(booking._id || '')}
              >
                Cancel Booking
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Receipt Dialog */}
      {showReceipt && (
        <BookingReceipt 
          booking={booking}
          hotel={hotel}
          room={room}
          open={showReceipt}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};

export default BookingItem;
