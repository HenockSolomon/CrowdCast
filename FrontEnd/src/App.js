import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './HeaderPublic';
import About from './Pages/AboutUs';
import CreatePost from './Pages/CreatePost';
import LoginSignup from './Pages/LoginSignup';
import UserProfile from './Pages/UserProfile';
import HomePage from './HomePage';
import { UserContextProvider } from './Props/UserInfo';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const handleLogin = (userData) => {
    setAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setUser(null);
  };

  return (
    <UserContextProvider value={{ authenticated, user, handleLogin, handleLogout }}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/About" element={<About />} />
          <Route path="/CreatePost" element={<CreatePost />} />
          <Route path="/LoginSignup" element={<LoginSignup handleLogin={handleLogin} />} />
          <Route path="/UserProfile" element={<UserProfile handleLogout={handleLogout} />} />
        </Routes>
      </Router>
    </UserContextProvider>
  );
}

export default App;