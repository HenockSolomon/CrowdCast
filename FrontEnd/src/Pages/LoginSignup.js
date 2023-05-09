import  React, {useState, useContext } from "react";
import Navbar from "../HeaderPublic";
import {  useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../Props/UserInfo";


export default function LoginSignup (){
    const navigate = useNavigate();
    const [username, setUsername]= useState('');
    const [email, setEmail]= useState('');
    const [password, setPassword]= useState('');
    const [redirect, setRedirect]= useState(false);
    
    const { setUserInfo} = useContext(UserContext);
    // const history = useHistory();

// this is for the signup page to sign up the user and take user information

    async function Signup (e){
        e.preventDefault();
       try { 
        const response = await fetch('http://localhost:8000/signup',{
                method: 'POST',
                body: JSON.stringify({username, email, password}),
                headers: { 'Content-Type': 'application/json'},
            });
                console.log(response);
                if (response.status === 200) {
                  const data = await response.json();
                  window.localStorage.setItem("token", data.token);
                  setRedirect(true);
                  console.log("Successfully registered");
                  alert("Successfully registered");
                  navigate("/userprofile");
                } else {
                  const error = await response.json();
                  console.log(error);
                  console.log("Signup Failed: username or email already exists");
                  alert("Signup Failed: username or email already exists");
                }
       }catch (error){
        console.log(error);
        console.log('signup Failed either because you used the invalid username or email')
        alert('Signup Failed either because you used the invalid username or email')
       }
      
    }

// this is for the login page to login the user and take user information
    
// Login.js
async function Login(ev) {
  ev.preventDefault();
  
  const response = await fetch('http://localhost:8000/login', {
    method: 'POST',
    body: JSON.stringify({username, password}),
    headers: {'Content-Type':'application/json'},
    credentials: 'include',
  });
  console.log(response);
  navigate('/userprofile');
  if (response.ok) {
    response.json().then(userInfo => {
      setUserInfo(userInfo);
      setRedirect(true);

    });
    alert('Log in successful');
    
  } else {
    alert('wrong credentials');
  }
}





// return of the component
    
    return(
        <>
            
          
            
            <Navbar></Navbar>
            <h1 className="heading">If you have an account</h1>
            <h1 className="loginHeadline">Login into your account</h1>
            <form className="login" onSubmit={Login}>
                <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
    


            <h1 className="heading">If you want to create an account </h1>

            <form className="register" onSubmit={Signup}>
                <input 
                    type="text" 
                    placeholder="Username"
                    value={username}
                    onChange={((e)=> setUsername(e.target.value))}/>
                <input type="email" 
                    placeholder="Email"
                    value={email}
                    onChange={((e)=> setEmail(e.target.value))}/>
                <input type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={((e)=> setPassword(e.target.value))}/>
                <button type="submit">Signup</button>
            
            </form>
    </>
    );
}