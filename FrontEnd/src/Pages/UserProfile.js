import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../HeaderPublic";
import { UserContext } from "../Props/UserInfo";

export default function UserProfile(props) {
  const { authenticated, handleLogout } = props;
  
  return (
    <div>
      <Navbar>
        home
      </Navbar>

      <h1>Welcome to your profile</h1>
    </div>
  );
}
