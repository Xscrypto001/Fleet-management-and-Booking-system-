import React, { useState } from 'react';
import { User, Calendar, Phone, Camera, Edit2, Menu} from 'lucide-react';

export default function ProfilePage() {
  const [userName, setUserName] = useState("Michael Chen");

  const [user, setUser] = useState({
    name: "Alex Johnson",
    phone: "+1 (555) 123-4567",
    joinedDate: "April 5, 2023",
    avatar: null
  });

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
  
  
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
