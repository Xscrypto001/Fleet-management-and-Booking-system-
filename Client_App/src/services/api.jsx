export const API_URL = 'http://192.168.110.161:8000';

export const submitForm = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/api/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Error submitting form');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};







export const loginForm = async (formData) => {
  try {
      const response = await fetch(`${API_URL}/api/token/ `, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
      });

      if (!response.ok) {
          throw new Error('Login failed');
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error logging in:', error);
      throw error;
  }
};





export const fetchProfile = async () => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    console.error('No access token found');
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/api/usernames/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const profileData = await response.json();
      console.log(profileData);  
      return profileData;  
    } else {
      console.error('Failed to fetch profile:', response.status, response.statusText);
      return null;  
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};







export const fetchRoutes= async () => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      console.error('No access token found');
      return null;
    }
  
    try {
      const response = await fetch(`${API_URL}/api/routes/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const profileData = await response.json();
        console.log(profileData);  
        return profileData;  
      } else {
        console.error('Failed to fetch profile:', response.status, response.statusText);
        return null;  
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };



  

  
  export const fetchhistory= async () => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      console.error('No access token found');
      return null;
    }
  
    try {
      const response = await fetch(`${API_URL}/api/history/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const profileData = await response.json();
        console.log(profileData);  
        return profileData;  
      } else {
        console.error('Failed to fetch profile:', response.status, response.statusText);
        return null;  
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };
export const fetchBooking= async () => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      console.error('No access token found');
      return null;
    }
  
    try {
      const response = await fetch(`${API_URL}/api/bookings/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const profileData = await response.json();
        console.log(profileData);  
        return profileData;  
      } else {
        console.error('Failed to fetch profile:', response.status, response.statusText);
        return null;  
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };