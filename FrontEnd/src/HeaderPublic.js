import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './Props/UserInfo';
import axios from 'axios';


export default function Navbar() {
  const { setUserInfo, userInfo } = useContext(UserContext);  

  function handleLogout() {
    fetch('http://localhost:8000/logout', {
      credentials: 'include',
      method: 'POST',
    })
    .then(response => {
      if (response.ok) {
        setUserInfo(null);
      } else {
        throw new Error('Failed to log out');
      }
    })
    .catch(error => {
      console.error(error);
    });
  }
  const username = userInfo?.username;

  return (
    <div className="navbar">
      <header>
        <div className="navbarLogo logo">
          <Link to="/">Crowd Cast </Link>
        </div>

        <nav>
          {username ? (
            <>
              <ul className="navbarMenu">
                <li>
                  <Link to="/createpost" className="CreatePost">Create Post</Link>
                </li>
                <li>
                  <span className="welcome">Welcome {username}</span>
                </li>
                <li>
                  <Link to="/" onClick={handleLogout}>
                    Logout
                  </Link>
                </li>
              </ul>
            </>
          ) : (
            <>
              <li><Link to="/loginsignup" className="LoginSignup"> Login/Signup </Link></li>
            </>
          )}
        </nav>
      </header>
    </div>
  );
}
