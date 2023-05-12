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
                  await Login(e);
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
    navigate('/loginsignup');
  }
}

function toggleForm() {
  const loginForm = document.querySelector('.login');
  const registerForm = document.querySelector('.register');
  const heading = document.querySelector('.heading');

  if (loginForm.style.display === 'none') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    heading.textContent = 'If you want to create an account';
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    heading.textContent = 'If you already have an account';
  }
}




// return of the component
    
    return(
        <>
            
          
            
            <Navbar></Navbar>
           
       
            <form className='login' onSubmit={Login}> 
            <h1 className="heading">If you have an account Log in here:</h1>
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
                <button className="btn" type="submit">Login</button>
            </form>
    


            <h1 className="heading forNew" onClick={toggleForm}>If you want to create a new account: </h1>

            <form className='register' onSubmit={Signup}>
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
                <button type="submit" className="btn">Signup</button>
                <h1 className="heading forNew" onClick={toggleForm}> go back to login </h1>
            </form>
            
    </>
    );
}
