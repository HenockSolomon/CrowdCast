import React, { useState } from 'react';
import { BrowserRouter as Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './HeaderPublic';
import About from './Pages/AboutUs';
import CreatePost from './Pages/CreatePost';
import LoginSignup from './Pages/LoginSignup';
import UserProfile from './Pages/UserProfile';
import HomePage from './HomePage';
import { UserContext } from './Props/UserInfo';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const handleLogin = () => {
    setAuthenticated(true);
    setUser(user);
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ authenticated, user, handleLogin, handleLogout }}>      
   
    <Routes>
      <Route path={"/"} element={<HomePage/>}/>
        <Route path={"/About"} element={<About/>} />
        <Route path={"/CreatePost"} element={<CreatePost/>} />
        <Route path={"/LoginSignup"} element={<LoginSignup handleLogin={handleLogin} />} />
        <Route path={"/UserProfile"} element={<UserProfile handleLogin={handleLogin}/>} />
        
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
