import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginSignup from './Pages/LoginSignup';
import UserProfile from './Pages/UserProfile';
import CreatePost from './Pages/CreatePost';
import AboutUs from './Pages/AboutUs';
import HomePage from './HomePage';
import PostPage from './Pages/postPage'; // Import the PostPage component
import EditPost from './Pages/editPost';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/loginsignup" element={<LoginSignup />} />
      <Route path="/userprofile" element={<UserProfile />} />
      <Route path="/createpost" element={<CreatePost />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/post/:id" element={<PostPage />} /> 
      <Route path="/edit/:id" element={<EditPost />} />
    </Routes>
  );
};

ReactDOM.render(
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>,
  document.getElementById('root')
);
