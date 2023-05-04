import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './Props/UserInfo';
import axios from 'axios';
import api from './Props/API';

export default function Navbar() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  // api.get('/userprofile').then(response => {
  //   console.log(response.data);
  // });
  // useEffect(() => {
  //   axios.get('http://localhost:8000/userprofile', {
  //     withCredentials: true
  //   })
  //   .then(response => {
  //     if (setUserInfo) {
  //       setUserInfo(response.data);
  //     }
  //   })
  //   .catch(error => {
  //     console.log(error);
  //   });
  // }, [setUserInfo]);
  

//console.log(userInfo)

  function logout() {
    fetch('http://localhost:8000/logout', {
      credentials: 'include',
      method: 'POST',
    });
    if (setUserInfo) {
      setUserInfo(null);
    }
  }

  const username = userInfo?.username;
//console.log(username);


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
                  <Link to="/" onClick={logout}>
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
