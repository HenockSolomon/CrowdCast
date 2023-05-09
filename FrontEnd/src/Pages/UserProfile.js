import React, { useState, useEffect } from 'react';
import Navbar from '../HeaderPublic';

export default function Userprofile() {
  const [username, setUsername] = useState('');

  useEffect(() => {
  const response = JSON.parse(window.localStorage.getItem('response'));
  if (response) {
    setUsername(response.username);
  }
}, []);


  return (
    <div>
     <Navbar />

    <div className="container">
      This is {username}'s profile page.
    </div>
    </div>);
}
