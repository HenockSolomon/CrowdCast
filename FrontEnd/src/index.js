import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";


import LoginSignup from './Pages/LoginSignup';
import UserProfile from './Pages/UserProfile';
import CreatePost from './Pages/CreatePost';
import AboutUs from './Pages/AboutUs';
import HomePage from './HomePage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/loginsignup" element={<LoginSignup />} />
      <Route path="/userprofile" element={<UserProfile />} />
      <Route path="/createpost" element={<CreatePost />} />
      <Route path="/about" element={<AboutUs />} />
    </Routes>
  );
};

ReactDOM.render(
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>,
  document.getElementById('root')
);
