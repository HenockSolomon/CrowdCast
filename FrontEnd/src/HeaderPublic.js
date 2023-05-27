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
          <div className='nav-container'>
            <div className='create-event'>
              <Link to="/createpost" className="CreatePost">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-plus-square" viewBox="0 0 16 16">
  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
</svg>   Create Event
              </Link>
            </div>
            <div className='user-profile'>
              <Link to="/userprofile">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
</svg>
                <span className="userprofile"> {username}'s Profile</span>
              </Link>
            </div>
            <li>
              <Link to="/" onClick={Logout} className='logout'>
                Logout
                <svg xmlns="http://www.w3.org/2000/svg" width="29" height="20" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
  <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
</svg>
              </Link>
            </li>
          </div>
        ) : (
          <li>
            <Link to="/loginsignup" className="loginsignup">
              
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="16" fill="currentColor" class="bi bi-brush" viewBox="0 0 16 16">
  <path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04zM4.705 11.912a1.23 1.23 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.39 3.39 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3.122 3.122 0 0 0 .126-.75l-.793-.792zm1.44.026c.12-.04.277-.1.458-.183a5.068 5.068 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005a.031.031 0 0 1-.007.004zm3.582-3.043.002.001h-.002z"/>
</svg>   Login / Signup
            </Link>
          </li>
        )}
      
      </ul>
    </nav>
  );
}