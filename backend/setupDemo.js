
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Hotel = require('./models/Hotel');
const Room = require('./models/Room');

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Demo users
const users = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'password123',
    country: 'United States',
    city: 'New York',
    phone: '+1234567890',
    isAdmin: true,
    isModerator: false,
  },
  {
    username: 'moderator',
    email: 'mod@example.com',
    password: 'password123',
    country: 'United Kingdom',
    city: 'London',
    phone: '+9876543210',
    isAdmin: false,
    isModerator: true,
  },
  {
    username: 'user',
    email: 'user@example.com',
    password: 'password123',
    country: 'Canada',
    city: 'Toronto',
    phone: '+1122334455',
    isAdmin: false,
    isModerator: false,
  },
];

// Demo hotels
const hotels = [
  {
    name: 'Grand Plaza Hotel',
    type: 'Hotel',
    city: 'New York',
    address: '123 Broadway Ave',
    distance: '500m from city center',
    photos: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3',
    ],
    title: 'Experience luxury in the heart of Manhattan',
    desc: 'The Grand Plaza Hotel offers luxurious accommodations with stunning views of the New York skyline. Located in the heart of Manhattan, guests are just steps away from famous attractions, shopping, and dining.',
    rating: 4.8,
    rooms: [],
    cheapestPrice: 299,
    featured: true,
  },
  {
    name: 'Seaside Resort & Spa',
    type: 'Resort',
    city: 'Miami',
    address: '789 Ocean Drive',
    distance: '50m from beach',
    photos: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3',
    ],
    title: 'Beachfront paradise with world-class amenities',
    desc: 'Escape to our beachfront resort featuring pristine beaches, multiple pools, and a full-service spa. Enjoy spacious rooms with private balconies overlooking the ocean.',
    rating: 4.6,
    rooms: [],
    cheapestPrice: 399,
    featured: true,
  },
  {
    name: 'Urban Loft Apartments',
    type: 'Apartment',
    city: 'San Francisco',
    address: '456 Market St',
    distance: '1.2km from city center',
    photos: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1630699144867-37acec97df5a?ixlib=rb-4.0.3',
    ],
    title: 'Modern loft living in downtown San Francisco',
    desc: 'These stylish loft apartments offer modern amenities and convenience in the heart of San Francisco. Each unit features a fully equipped kitchen, high ceilings, and contemporary furnishings.',
    rating: 4.3,
    rooms: [],
    cheapestPrice: 249,
    featured: false,
  },
  {
    name: 'Mountain View Cabins',
    type: 'Cabin',
    city: 'Aspen',
    address: '101 Pine Road',
    distance: '3km from city center',
    photos: [
      'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3',
    ],
    title: 'Cozy cabins with breathtaking mountain views',
    desc: 'Our rustic cabins offer a perfect mountain retreat with stunning views, wood-burning fireplaces, and access to hiking trails. Ideal for nature lovers and outdoor enthusiasts.',
    rating: 4.7,
    rooms: [],
    cheapestPrice: 329,
    featured: true,
  },
];

// Demo rooms types
const createRoomsForHotel = (hotelId) => [
  {
    title: 'Deluxe King Room',
    price: 299,
    maxPeople: 2,
    desc: 'Spacious room with a king-sized bed, luxury linens, and a marble bathroom with a deep soaking tub.',
    roomNumbers: [
      { number: 101, unavailableDates: [] },
      { number: 102, unavailableDates: [] },
      { number: 103, unavailableDates: [] },
    ],
  },
  {
    title: 'Double Queen Suite',
    price: 349,
    maxPeople: 4,
    desc: 'Perfect for families, this suite features two queen beds, a separate living area, and views of the city.',
    roomNumbers: [
      { number: 201, unavailableDates: [] },
      { number: 202, unavailableDates: [] },
    ],
  },
  {
    title: 'Executive Suite',
    price: 499,
    maxPeople: 2,
    desc: 'Our most luxurious accommodation with a king bed, separate living room, kitchenette, and premium amenities.',
    roomNumbers: [
      { number: 301, unavailableDates: [] },
    ],
  },
];

// Seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Hotel.deleteMany();
    await Room.deleteMany();

    console.log('Database cleared');

    // Create users
    const createdUsers = [];
    for (const user of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      
      const newUser = await User.create({
        ...user,
        password: hashedPassword,
      });
      
      createdUsers.push(newUser);
    }
    
    console.log('Demo users created');

    // Create hotels and rooms
    for (const hotel of hotels) {
      const newHotel = await Hotel.create(hotel);
      
      // Create rooms for this hotel
      const roomTemplates = createRoomsForHotel(newHotel._id);
      
      for (const roomTemplate of roomTemplates) {
        const newRoom = await Room.create(roomTemplate);
        
        // Add room to hotel
        await Hotel.findByIdAndUpdate(
          newHotel._id,
          { $push: { rooms: newRoom._id } }
        );
      }
    }
    
    console.log('Demo hotels and rooms created');
    console.log('Database seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
