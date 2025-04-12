import React, { useState } from 'react';
import { Download, Car, Star, Clock, MapPin, Shield, CreditCard, CheckCircle, User, Phone, Calendar } from 'lucide-react';

// Mock data for the car and driver
const mockData = {
  id: "ride-123456",
  car: {
    name: "Mercedes E350",
    type: "Premium Sedan",
    image: "/api/placeholder/600/300",
    licensePlate: "LG-234-KJ",
    features: ["Air Conditioning", "Leather Seats", "4 Passengers", "2 Luggage"],
    rating: 4.9,
    totalTrips: 349
  },
  driver: {
    name: "Michael Johnson",
    image: "/api/placeholder/200/200",
    phone: "+1 (555) 123-4567",
    rating: 4.8,
    experience: "5 years",
    totalRides: 1245,
    verified: true
  },
  trip: {
    pickup: "123 Main Street, New York",
    destination: "JFK International Airport",
    distance: "18.5 miles",
    duration: "35 min",
    date: "April 12, 2025",
    time: "14:30",
    price: 65.99
  }
};

export default function BookingDetailsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  
  const handlePayment = () => {
    setIsLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      setIsPaid(true);
    }, 2000);
  };
  
  const downloadTicket = () => {
    // In a real app, this would generate and download a PDF
    alert("Downloading your ticket...");
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fancy gradient header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-48 rounded-b-3xl shadow-lg">
        <div className="container mx-auto px-4 pt-12">
          <h1 className="text-white text-3xl font-bold">Ride Details</h1>
          <p className="text-blue-100">Booking #{mockData.id}</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 -mt-16">
        {/* Main content card */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
          {/* Car details section */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="md:w-2/5">
              <div className="rounded-lg overflow-hidden">
                <img src={mockData.car.image} alt={mockData.car.name} className="w-full h-auto object-cover" />
              </div>
            </div>
            
            <div className="md:w-3/5">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{mockData.car.name}</h2>
                  <p className="text-gray-500">{mockData.car.type}</p>
                </div>
                <div className="flex items-center bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                  <Star size={16} className="mr-1 fill-current" />
                  <span className="font-semibold">{mockData.car.rating}</span>
                </div>
              </div>
              
              <div className="mt-3 flex items-center text-gray-700">
                <Car size={18} className="mr-2" />
                <span>License: {mockData.car.licensePlate}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                {mockData.car.features.map((feature, index) => (
                  <div key={index} className="flex items-center bg-gray-50 rounded-lg p-2">
                    <CheckCircle size={16} className="mr-2 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Trip details section */}
          <div className="border-t border-b border-gray-100 py-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Trip Details</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left column - route details */}
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-4 pt-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-0.5 h-16 bg-gray-300 mx-auto"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Pickup Location</p>
                      <p className="font-medium">{mockData.trip.pickup}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Destination</p>
                      <p className="font-medium">{mockData.trip.destination}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right column - time and price */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="text-gray-400 mr-3" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium">{mockData.trip.date} • {mockData.trip.time}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="text-gray-400 mr-3" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Duration & Distance</p>
                    <p className="font-medium">{mockData.trip.duration} • {mockData.trip.distance}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CreditCard className="text-gray-400 mr-3" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-bold text-lg text-blue-600">${mockData.trip.price}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Driver details section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Driver Information</h3>
            
            <div className="flex items-center">
              <div className="relative mr-4">
                <img src={mockData.driver.image} alt={mockData.driver.name} className="w-16 h-16 rounded-full object-cover" />
                {mockData.driver.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                    <CheckCircle size={14} />
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-semibold">{mockData.driver.name}</h4>
                <div className="flex items-center mt-1">
                  <Star size={16} className="text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm">{mockData.driver.rating} • {mockData.driver.totalRides} rides</span>
                </div>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <Phone size={14} className="mr-1" />
                  <span>{mockData.driver.phone}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment/Ticket Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            {!isPaid ? (
              <div className="text-center">
                <h3 className="text-xl font-bold mb-3">Complete Your Booking</h3>
                <p className="text-gray-600 mb-6">Secure your ride by completing the payment process</p>
                <button 
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg flex items-center justify-center w-full md:w-auto md:mx-auto">
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} className="mr-2" />
                      Pay with Paystack - ${mockData.trip.price}
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-green-100 text-green-600 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600 mb-6">Your ride has been successfully booked</p>
                <button 
                  onClick={downloadTicket}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg flex items-center justify-center w-full md:w-auto md:mx-auto">
                  <Download size={20} className="mr-2" />
                  Download Ticket
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
