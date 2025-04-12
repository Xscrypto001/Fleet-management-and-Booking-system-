import React, { useState } from 'react';
import { User, Calendar, Phone, Camera, Edit2 } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "Alex Johnson",
    phone: "+1 (555) 123-4567",
    joinedDate: "April 5, 2023",
    avatar: null
  });

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Profile Header with Avatar */}
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt="Profile avatar" 
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={64} className="text-gray-400" />
          )}
        </div>
        <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition-colors">
          <Camera size={18} />
        </button>
      </div>

      {/* User Name */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
          <button className="text-blue-500 hover:text-blue-700 transition-colors">
            <Edit2 size={18} />
          </button>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
      </div>

      {/* User Details */}
      <div className="w-full space-y-6">
        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
          <Phone className="text-blue-500 mr-4" />
          <div>
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="text-lg font-medium">{user.phone}</p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
          <Calendar className="text-blue-500 mr-4" />
          <div>
            <p className="text-sm text-gray-500">Member Since</p>
            <p className="text-lg font-medium">{user.joinedDate}</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button className="mt-8 w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-purple-600 transition-all">
        Edit Profile
      </button>
    </div>
  );
}
