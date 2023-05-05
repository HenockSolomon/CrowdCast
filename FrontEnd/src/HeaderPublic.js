import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './Props/UserInfo';
import axios from 'axios';
import api from './Props/API';
import handleLogout  from './Pages/Logout';

export default function Navbar() {
  const { setUserInfo, userInfo } = useContext(UserContext);  

  const username = userInfo?.username;

  return (
    <div className="navbar">
      <header>
        <div className="navbarLogo logo">
          <Link to="/">Crowd Cast</Link>
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
