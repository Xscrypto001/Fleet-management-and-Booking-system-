import React, { useState, useEffect } from 'react';
import { Download, Car, Star, Clock, MapPin, Shield, CreditCard, CheckCircle, User, Phone, Calendar, Menu } from 'lucide-react';
import { fetchBooking } from './services/api';
import PaymentSection from "./PaymentSection";

//npm install react-paystack jspdf html2canvas

export default function BookingDetailsPage() {
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [userName, setUserName] = useState("Michael Chen");

  useEffect(() => {
    const getUserBookings = async () => {
      try {
        const response = await fetchBooking(); 
        setBooking(response); 
      } catch (error) {
        console.error("Failed to fetch user booking:", error);
      }
    };

    getUserBookings();
  }, []);

  if (!booking) {
    return <div className="p-6 text-center">Loading booking details...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* Gradient header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-48 rounded-b-3xl shadow-lg">
        <div className="container mx-auto px-4 pt-12">
          <h1 className="text-white text-3xl font-bold">Ride Details</h1>
          <p className="text-blue-100">Booking #{booking.id}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16">
        <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
          {/* Car details */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="md:w-2/5">
              <img src={booking.car.image} alt={booking.car.name} className="w-full h-auto object-cover rounded-lg" />
            </div>

            <div className="md:w-3/5">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{booking.car.name}</h2>
                  <p className="text-gray-500">{booking.car.type}</p>
                </div>
                <div className="flex items-center bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                  <Star size={16} className="mr-1 fill-current" />
                  <span className="font-semibold">{booking.car.rating}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center text-gray-700">
                <Car size={18} className="mr-2" />
                <span>License: {booking.car.licensePlate}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                {booking.car.features.map((feature, index) => (
                  <div key={index} className="flex items-center bg-gray-50 rounded-lg p-2">
                    <CheckCircle size={16} className="mr-2 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trip details */}
          <div className="border-t border-b border-gray-100 py-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Trip Details</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-4 pt-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-0.5 h-16 bg-gray-300 mx-auto"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pickup Location</p>
                    <p className="font-medium">{booking.trip.pickup}</p>
                    <p className="text-sm text-gray-500 mt-4">Destination</p>
                    <p className="font-medium">{booking.trip.destination}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="text-gray-400 mr-3" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium">{booking.trip.date} • {booking.trip.time}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="text-gray-400 mr-3" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Duration & Distance</p>
                    <p className="font-medium">{booking.trip.duration} • {booking.trip.distance}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CreditCard className="text-gray-400 mr-3" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-bold text-lg text-blue-600">${booking.trip.price}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Driver details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Driver Information</h3>
            <div className="flex items-center">
              <div className="relative mr-4">
                <img src={booking.driver.image} alt={booking.driver.name} className="w-16 h-16 rounded-full object-cover" />
                {booking.driver.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                    <CheckCircle size={14} />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-semibold">{booking.driver.name}</h4>
                <div className="flex items-center mt-1">
                  <Star size={16} className="text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm">{booking.driver.rating} • {booking.driver.totalRides} rides</span>
                </div>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <Phone size={14} className="mr-1" />
                  <span>{booking.driver.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <PaymentSection booking={booking} />

          {/* Bottom Nav */}
          <div className="absolute bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-2xl">
            <div className="flex justify-around p-4">
              <button className="flex flex-col items-center space-y-1 text-blue-600">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      </div>
    </div>
  );
}
