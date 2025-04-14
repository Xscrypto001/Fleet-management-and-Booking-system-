import { useState } from 'react';
import { Calendar, Clock, MapPin, Menu, ChevronRight, Search, Filter, MoreVertical, Menu } from 'lucide-react';
import {fetchhistory } from './services/api';

// Status badge component
const StatusBadge = ({ status }) => {

  const [mockBookings, setmockBookings] = useState("");


  useEffect(() => {
    const getUserRoutes = async () => {
      try {
        const response = await fetchhistory(); 
        setmockBookings(response); 
      } catch (error) {
        console.error("Failed to fetch user Routes:", error);
      }
    };

    getUserRoutes();
  }, []);




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


  const [userName, setUserName] = useState("Michael Chen");

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
      <div className="absolute top-0 left-0 right-0 z-10 px-4 py-3 bg-white bg-opacity-90 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-slate-100">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-blue-600">RideWave</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{userName}</span>
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {userName.split(' ').map(name => name[0]).join('')}
            </div>
          </div>
        </div>
      </div>
      
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

      <div className="absolute bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-2xl">
        <div className="flex justify-around p-4">
          <button className="flex flex-col items-center space-y-1 text-blue-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span className="text-xs font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-slate-400">
            <Clock size={24} />
            <span className="text-xs font-medium">History</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-slate-400">
            <User size={24} />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>

    </div>
  );
}
