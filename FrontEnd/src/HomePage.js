import React, { useState, useEffect } from 'react';
import Navbar from './HeaderPublic';
import IndexPage from './Pages/indexPage';

export default function Home() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:8000/userprofile', {
          credentials: 'include',
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const userInfo = await response.json();
        if (userInfo && userInfo.username) {
          setUsername(userInfo.username);
          console.log(userInfo);
        } else {
          throw new Error('User info not available');
        }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };
  
    fetchUserProfile();
  }, []);
  

  return (
    <div>
      <Navbar />
      <div className="containerHome">
        <div className="headingSpace">
          {username ? (
            <div className="cont">
              <div className="coverImgContainer">
                <img
                  src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1138&q=80"
                  className="coverImg"
                  alt="child play"
                />
              </div>
              <div className="headingContent">
                <h1>Hello {username}: here are your feeds</h1>
                <h2>Find activities you want</h2>
              </div>
            </div>
          ) : (
            <div className="cont">
              <div className="coverImgContainer">
                <img
                  src="https://images.unsplash.com/photo-1625043187309-49e34491916b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80"
                  className="coverImg"
                  alt="talk in a walk"
                />
              </div>
              <div className="headingContent">
                <h1>Welcome to Crowd Cast</h1>
                <h2>Join the Crowd Cast community - A platform for sharing events and exciting activities</h2>
              </div>
            </div>
          )}
        </div>
      </div>
      <IndexPage />
    </div>
  );
}
