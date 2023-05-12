import React, { useState, useEffect } from 'react';
import Navbar from '../HeaderPublic';

export default function Userprofile() {
  const [username, setUsername] = useState('');
  
  
  useEffect(() => {
    fetch('http://localhost:8000/userprofile', {
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(userInfo => {
        setUsername(userInfo.username); // set the username state
        console.log(username); // log username to the console
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, [setUsername]);


  return (
    <div>
     <Navbar />

    <div className="container">
      <h1>This is {username}'s profile page.</h1>
    </div>
    </div>);
}
