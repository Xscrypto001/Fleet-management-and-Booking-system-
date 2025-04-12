import { useState } from 'react';
import { Calendar, Clock, MapPin, Menu, ChevronRight, Search, Filter, MoreVertical } from 'lucide-react';

// Mock data for bookings
const mockBookings = [
  {
    id: 'B001',
    type: 'Flight',
    origin: 'New York (JFK)',
    destination: 'San Francisco (SFO)',
    departureDate: '2025-04-15',
    departureTime: '08:30 AM',
    arrivalTime: '12:15 PM',
    status: 'Completed',
    price: 349.99,
    airline: 'Delta Airlines',
    flightNumber: 'DL1234',
    bookingDate: '2025-03-20',
    thumbnail: '/api/placeholder/80/80'
  },
  {
    id: 'B002',
    type: 'Train',
    origin: 'Boston',
    destination: 'Washington DC',
    departureDate: '2025-04-10',
    departureTime: '10:45 AM',
    arrivalTime: '02:30 PM',
    status: 'Completed',
    price: 129.50,
    operator: 'Amtrak',
    trainNumber: 'AM456',
    bookingDate: '2025-03-15',
    thumbnail: '/api/placeholder/80/80'
  },
  {
    id: 'B003',
    type: 'Bus',
    origin: 'Los Angeles',
    destination: 'Las Vegas',
    departureDate: '2025-04-20',
    departureTime: '09:00 AM',
    arrivalTime: '03:30 PM',
    status: 'Upcoming',
    price: 79.99,
    operator: 'Greyhound',
    busNumber: 'GH789',
    bookingDate: '2025-03-25',
    thumbnail: '/api/placeholder/80/80'
  },
  {
    id: 'B004',
    type: 'Flight',
    origin: 'Chicago (ORD)',
    destination: 'Miami (MIA)',
    departureDate: '2025-05-05',
    departureTime: '07:15 AM',
    arrivalTime: '11:00 AM',
    status: 'Upcoming',
    price: 289.99,
    airline: 'American Airlines',
    flightNumber: 'AA789',
    bookingDate: '2025-04-01',
    thumbnail: '/api/placeholder/80/80'
  },
  {
    id: 'B005',
    type: 'Hotel',
    location: 'Seattle',
    checkIn: '2025-05-15',
    checkOut: '2025-05-18',
    status: 'Upcoming',
    price: 599.99,
    hotel: 'Seaside Luxury Resort',
    roomType: 'Deluxe King',
    bookingDate: '2025-04-05',
    thumbnail: '/api/placeholder/80/80'
  }
];

// Status badge component
const StatusBadge = ({ status }) => {
  const getBadgeClasses = () => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeClasses()}`}>
      {status}
    </span>
  );
};

// Booking card component
const BookingCard = ({ booking }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4 border border-gray-100">
      <div className="p-4 sm:flex">
        <div className="mr-4 flex-shrink-0">
          <img src={booking.thumbnail} alt={booking.type} className="h-20 w-20 rounded-lg object-cover" />
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{booking.type} Booking</h3>
              <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
            </div>
            <StatusBadge status={booking.status} />
          </div>
          
          {booking.type === 'Hotel' ? (
            <div className="mt-2">
              <div className="flex items-center mt-1 text-sm">
                <MapPin size={16} className="text-purple-500 mr-1" />
                <span>{booking.hotel}, {booking.location}</span>
              </div>
              <div className="flex items-center mt-1 text-sm">
                <Calendar size={16} className="text-purple-500 mr-1" />
                <span>{booking.checkIn} - {booking.checkOut}</span>
              </div>
            </div>
          ) : (
            <div className="mt-2">
              <div className="flex items-center text-sm">
                <MapPin size={16} className="text-purple-500 mr-1" />
                <span>{booking.origin} → {booking.destination}</span>
              </div>
              <div className="flex items-center mt-1 text-sm">
                <Calendar size={16} className="text-purple-500 mr-1" />
                <span>{booking.departureDate}</span>
                <Clock size={16} className="text-purple-500 ml-2 mr-1" />
                <span>{booking.departureTime} - {booking.arrivalTime}</span>
              </div>
            </div>
          )}
          
          <div className="mt-2 flex justify-between items-center">
            <p className="text-purple-600 font-bold">${booking.price.toFixed(2)}</p>
            <button className="text-purple-600 flex items-center text-sm font-medium">
              View Details <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Filter component
const FilterBar = ({ activeFilter, setActiveFilter }) => {
  const filters = ['All', 'Upcoming', 'Completed', 'Cancelled'];
  
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 mb-4">
      {filters.map(filter => (
        <button
          key={filter}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            activeFilter === filter 
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveFilter(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

// Main Component
export default function BookingHistory() {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const filteredBookings = activeFilter === 'All' 
    ? mockBookings 
    : mockBookings.filter(booking => booking.status === activeFilter);
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-purple-600 text-white px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Menu size={24} />
            <h1 className="text-xl font-bold ml-4">My Bookings</h1>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full bg-purple-500 hover:bg-purple-700">
              <Search size={18} />
            </button>
            <button className="p-2 rounded-full bg-purple-500 hover:bg-purple-700">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Filter bar */}
        <FilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        
        {/* Search & Sort Bar */}
        <div className="flex items-center mb-6 bg-white rounded-xl p-2 shadow-sm">
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="Search bookings..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-purple-500"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button className="ml-2 p-2 bg-gray-100 rounded-lg">
            <Filter size={18} className="text-gray-500" />
          </button>
        </div>
        
        {/* Bookings list */}
        <div>
          {filteredBookings.length > 0 ? (
            filteredBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No bookings found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
