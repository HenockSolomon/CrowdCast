import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../Props/UserInfo';


export default function Navbar() {
  const { setUserInfo, userInfo } = useContext(UserContext);  

  function handleLogout() {
    // Clear user information (e.g. authentication token)
    localStorage.removeItem('token');

    // Clear user information in context
    setUserInfo(null);

    // Redirect to home page
    window.location.href = '/';
  }

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
                <button>
                  <Link to="/" onClick={handleLogout} >
                    Logout
                  </Link>
                </button>
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
