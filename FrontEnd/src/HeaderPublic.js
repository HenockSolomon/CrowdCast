import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './Props/UserInfo';
import './App.css';


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
                <span className="userprofile"> {username}'s Profile</span>
              </Link>
            </li>
            <li>
              <Link to="/" onClick={Logout} className='logout'>
                Logout
              </Link>
            </li>
          </>
        ) : (
          <li>
            <Link to="/loginsignup" className="loginsignup">
              Login/Signup
            </Link>
          </li>
        )}
      
      </ul>
    </nav>
  );
}