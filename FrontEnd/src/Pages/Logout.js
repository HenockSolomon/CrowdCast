import React from 'react';
import { useHistory } from 'react-router-dom';

export function handleLogout() {
  // Clear user information (e.g. authentication token)
  localStorage.removeItem('authToken');

  // Redirect to home page
  const history = useHistory();
  history.push('/');
}

export default function Navbar() {
  // ...

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
