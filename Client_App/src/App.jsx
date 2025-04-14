import React, { useState, useEffect } from 'react'; 
import { BrowserRouter as Router, 
Route, Routes } from 'react-router-dom'; 
import './index.css';

import {fetchProfile } from './services/api';


import BookingHistory from './pages/history';

import ProfilePage from './pages/profile';
import BookingAppHome  from './pages/home';
import BookingDetailsPage  from './pages/Booking';





if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}



const App = () => {

  const [authenticated, setAuthenticated] = useState(false); // Authentication state
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchProfile();
     
        setAuthenticated(true); // Set authenticated to true upon successful fetch
      } catch (error) {
        console.error('Error fetching user data:', error);
        setAuthenticated(false); 
        setLoading(false); 
      }
    };

    fetchUserData();
  }, []);


 

  const handleLogout = () => {
    localStorage.removeItem('access_token'); 
    window.location.href = '/signin';

    setAuthenticated(false); 
  
  };





 
  return (
    <Router>

 
       <main className="">
          <div className="">
            <div className=" rounded-xl  shadow-sm">
          <Routes>
            {!authenticated ? (
              <>
               {/* <Route path="/signin" element={<LoginPage  CRMWelcomeSection={CRMWelcomeSection} App_name={App_name} logo={logo} />} />
           */}
              
              </>
            ) : (
              <>
        <Route path="/" element={<BookingAppHome />} />
        <Route path="/profile" element={<ProfilePage  />} />
        <Route path="/history" element={<BookingHistory  />} />
        <Route path="/booking_details" element={< BookingDetailsPage />} />
      

        

 

    
              </>
            )}
          </Routes>
          </div>
          </div>

        </main>
        </div>

    </Router>
  );
};

export default App;
