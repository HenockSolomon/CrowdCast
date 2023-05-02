import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from './Props/UserInfo';

export default function Navbar() {
  const location = useLocation();
  const { authenticated, user, handleLogout } = useContext(UserContext);

  const showSignupNavItems3 = location.pathname === '/LoginSignup';
  const showSignupNavItems2 = location.pathname === '/CreatePost';
  const showSignupNavItems1 = location.pathname === '/About';

  return (
    <div className="navbar">
      <div className="navbarLogo">
        <nav className="logo"><Link to='/'>Crowd Cast</Link></nav>
      </div>

      <ul className="navbarMenu">
        {!showSignupNavItems1 && <li><Link to="/About" className='about'>About Us</Link></li>}
        {!showSignupNavItems2 && <li><Link to="/CreatePost" className='CreatePost'>Create Post</Link></li>}
        {authenticated && user && <li><span className='welcome'>Welcome {user.username}</span></li>}
        {authenticated && <li><button onClick={handleLogout}>Log out</button></li>}
        {!authenticated && !showSignupNavItems3 && <li><Link to="/LoginSignup" className='LoginSignup'>Login/Signup</Link></li>}
      </ul>
    </div>
  );
}
