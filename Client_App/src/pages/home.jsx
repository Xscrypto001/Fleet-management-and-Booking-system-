import React, { useState } from 'react';
import { Menu, MapPin, ChevronRight, Package, Clock, User, Search, Bus, X } from 'lucide-react';
import {fetchProfile, fetchRoute } from './services/api';
import {RouteMap} from './google_maps';
const BookingAppHome = () => {
  const [showTripMenu, setShowTripMenu] = useState(false);
  const [userName, setUserName] = useState("");
  const [routes, setRoutes] = useState([]);

  const toggleTripMenu = () => {
    setShowTripMenu(!showTripMenu);
  };

  const closeTripMenu = () => {
    setShowTripMenu(false);
  };
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await fetchProfile(); 
        setUserName(response); 
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    getUserProfile();
  }, []);



  useEffect(() => {
    const getUserRoutes = async () => {
      try {
        const response = await fetchRoute(); 
        setRoutes(response); 
      } catch (error) {
        console.error("Failed to fetch user Routes:", error);
      }
    };

    getUserRoutes();
  }, []);
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header with Avatar and Hamburger */}
      <div className="absolute top-0 left-0 right-0 z-10 px-4 py-3 bg-white bg-opacity-90 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-slate-100">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-blue-600">Garissa Coach</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{userName}</span>
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {userName.split(' ').map(name => name[0]).join('')}
            </div>
          </div>
        </div>
      </div>

      {/* Google Maps Background */}
      <RouteMap />


      {/* Main Action Cards */}
      <div className="absolute bottom-24 left-0 right-0 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-4 space-y-4">
          {/* Book Trip Button */}
          <button 
            onClick={toggleTripMenu}
            className="w-full bg-blue-50 hover:bg-blue-100 p-4 rounded-xl flex items-center justify-between border border-blue-200 transition-all duration-200"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                <Bus size={20} className="text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-blue-800">Book Trip</h3>
                <p className="text-xs text-slate-500">Find and book your next journey</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-blue-600" />
          </button>

          {/* Send Parcel Button */}
          <button className="w-full bg-purple-50 hover:bg-purple-100 p-4 rounded-xl flex items-center justify-between border border-purple-200 transition-all duration-200">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                <Package size={20} className="text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-purple-800">Send Parcel</h3>
                <p className="text-xs text-slate-500">Quick and secure delivery service</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-purple-600" />
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
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

      {/* Trip Menu Modal */}
      {showTripMenu && (
        <div className="absolute inset-0 bg-slate-900 bg-opacity-50 z-20 flex flex-col">
          <div className="mt-16 bg-white rounded-t-3xl flex-1 p-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Find Your Trip</h2>
              <button 
                onClick={closeTripMenu}
                className="p-2 rounded-full hover:bg-slate-100"
              >
                <X size={24} className="text-slate-600" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Where to?"
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Available Buses */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-500 mb-2">Available Routes</h3>
              {routes.map(bus => (
               <div key={bus.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-slate-800">{bus.name}</h4>
                      <div className="flex items-center mt-1">
                        <Clock size={14} className="text-slate-400 mr-1" />
                        <span className="text-sm text-slate-500">{bus.time}</span>
                        <span className="mx-2 text-slate-300">|</span>
                        <span className="text-sm text-green-600">{bus.seats} seats available</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-blue-600">{bus.price}</span>
                      <button className="block mt-1 text-xs text-blue-500 font-medium">Select →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingAppHome;
