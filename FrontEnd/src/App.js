import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './HeaderPublic';
import CreatePost from './Pages/CreatePost';
import LoginSignup from './Pages/LoginSignup';
import UserProfile from './Pages/UserProfile';

import { UserContextProvider } from './Props/UserInfo';
import PostPage from "./Pages/postPage";
import EditPost from "./Pages/editPost";
import Layout from './layout';
import IndexPage from './Pages/indexPage';


function App() {


  return (
    <UserContextProvider >
      <Router>
        <Navbar />
        <Routes>
            <Route path="/" element={<Layout />} >
              <Route index element={<IndexPage />} />
              <Route path="/CreatePost" element={<CreatePost />} />
              <Route path="/LoginSignup" element={<LoginSignup />} />
              <Route path="/UserProfile" element={<UserProfile />} />
              <Route path="/post/:id" element={<PostPage />} />
              <Route path="/edit/:id" element={<EditPost />} />
            </Route>
        </Routes>
      </Router>
    </UserContextProvider>
  );
}

export default App;