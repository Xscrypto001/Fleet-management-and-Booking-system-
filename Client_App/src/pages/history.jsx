
import React, { useState,useEffect } from 'react';

//import React from "react";
import { Menu,Calendar, MapPin, Clock, CheckCircle2 } from "lucide-react";
import BottomNav from "./nav";

const mockBookings = [
  {
    id: 1,
    from: "Nairobi",
    to: "Mombasa",
    date: "2025-09-01",
    time: "08:30 AM",
    status: "Completed",
  },
  {
    id: 2,
    from: "Kisumu",
    to: "Nakuru",
    date: "2025-09-02",
    time: "02:15 PM",
    status: "Completed",
  },
];

const BookingHistory = () => {
const [userName, setUserName] = useState("");



  return (
    <div className="min-h-screen flex flex-col bg- gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      {/* Top Bar already included elsewhere */}



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
              {userName?.split(' ').map(name => name[0]).join('')}
            </div>
          </div>
        </div>
      </div>



      <div className="flex-1 p-4 space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Booking History</h2>

        {mockBookings.map((booking) => (
          <div
            key={booking.id}
            className="relative b -gray-800 rounded-2xl shadow-lg p-5 order order-gray-700 hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="text-black font-semibold">{booking.from}</span>
                  <span className="text-black">→</span>
                  <span className="font-semibold text-black">{booking.to}</span>
                </div>
                <div className="flex items-center mt-2 space-x-3 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{booking.date}</span>
                  <Clock className="w-4 h-4 ml-4" />
                  <span>{booking.time}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 bg-green-900 text-green-300 px-3 py-1 rounded-full text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>{booking.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default BookingHistory;
