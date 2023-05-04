import React, { useContext } from "react";
import Navbar from "../HeaderPublic";
import { UserContext } from "../Props/UserInfo";

export default function UserProfile() {
  const { userInfo } = useContext(UserContext);
  const username = userInfo?.username;

  return (
    <div>
      <Navbar />
      <h1>Welcome to your profile {username}</h1>
    </div>
  );
}
