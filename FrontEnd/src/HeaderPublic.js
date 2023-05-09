import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './Props/UserInfo';


export default function Navbar() {
  
  const { setUserInfo} = useContext(UserContext);
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




  function Logout() {
    fetch('http://localhost:8000/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }
  
  return (
    <nav className="navbar">
      <div className="navbarLogo logo">
        <Link to="/">Crowd Cast </Link>
      </div>
      <ul className="navbarMenu">
       
        {username ? (
          <>
            <li>
              <Link to="/createpost" className="CreatePost">
                Create Post
              </Link>
            </li>
            <li>
              <Link to="/userprofile">
                <span className="welcome"> {username}'s Profile</span>
              </Link>
            </li>
            <li>
              <Link to="/" onClick={Logout}>
                Logout
              </Link>
            </li>
          </>
        ) : (
          <li>
            <Link to="/loginsignup" className="LoginSignup">
              Login/Signup
            </Link>
          </li>
        )}
      
      </ul>
    </nav>
  );
}