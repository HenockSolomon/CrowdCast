// UserProfile.js

import React, { useState, useEffect } from 'react';
import Navbar from '../HeaderPublic';

export default function UserProfile() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const response = JSON.parse(window.localStorage.getItem('response'));
    setUsername(response.username);
  }, []);

  return (
    <div>
      <Navbar />
      <h1>Welcome to your profile {username}</h1>
    </div>
  );
}
