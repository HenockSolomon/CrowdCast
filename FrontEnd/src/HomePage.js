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
      <div className="containerHome after-contain-home">
        <div className="headingSpace">
          {username ? (
            <div className="after-username-cont"> 
            
              <div className=" after-username">
             
              </div>
             
            </div>
          ) : ( 
            <div className="cont before-log">
              <div className="coverImgContainer">
                <img
                  src="https://plus.unsplash.com/premium_photo-1661270480589-ef777cebef1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  className="coverImg"
                  alt="talk in a walk"
                />
              
              </div>
              <div className="headingContent">
                <h1>Welcome to Crowd Cast</h1><br/><br/>
                <h2>Join the Crowd Cast community today</h2>
                <h3>A platform for sharing events and exciting activities</h3>


                <i className='qoute'><p>  '- best moments are, 
                the <br/>ones we share with others'</p></i>
              </div>
            </div>
          )}
        </div>



       
      </div>
      <IndexPage />
      <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>
            Crowd Cast is a web based application designed for sharing events that are happening necessary us. 
            Create an event and have fun with your family and friends.
          </p>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <p>
            Email:CrowdCast@info.com
            <br />
            Phone: 123-456-7890
          </p>
        </div>
        <div className="footer-section">
          <h3>Follow Us on</h3>
          <div className="social-media-links">
            <a href="#" className="social-media-link">
              <i className="fab fa-facebook">CrowedCast.linkedin.com</i>
            </a>
            
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2023 Crowd Cast. All rights reserved.</p>
      </div>
    </footer>
    </div>
  );
}
