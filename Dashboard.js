// src/components/Dashboard.js

import React, { useEffect, useState } from 'react';
// Assuming we have an API call that fetches the user info (e.g., getUser or a similar function)
import { getUser } from '../services/api';  // Correct path to api.js

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await getUser();  // Fetch user data from API
        setUser(userInfo);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    
    fetchUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      {/* Display other user-related information here */}
    </div>
  );
}

export default Dashboard;
