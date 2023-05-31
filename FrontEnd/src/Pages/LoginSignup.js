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

async function Signup(e) {
  e.preventDefault();

  // Validate username and password
  if (username.length < 5) {
    alert('Username must be at least 5 characters long');
    return;
  }

  if (password.length < 5) {
    alert('Password must be at least 5 characters long');
    return;
  }

  // Use regular expressions to validate password format
  

  try {
    const response = await fetch('http://localhost:8000/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(response);
    if (response.status === 200) {
      const data = await response.json();
      window.localStorage.setItem('token', data.token);
      setRedirect(true);
      console.log('Successfully registered');
      alert('Successfully registered');
      await Login(e);
    } else {
      const error = await response.json();
      console.log(error);
      console.log('Signup Failed: username or email already exists');
      alert('Signup Failed: username or email already exists');
    }
  } catch (error) {
    console.log(error);
    console.log(
      'Signup Failed either because you used an invalid username or email'
    );
    alert(
      'Signup Failed either because you used an invalid username or email'
    );
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
  if(!username || !password){
    alert('Please enter a username and password');
  }else if (response.ok) {
    response.json().then(userInfo => {
      setUserInfo(userInfo);
      setRedirect(true);

    });
    alert('Log in successful');
    navigate('/');
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
            <h1 className="heading">Log in to your account</h1>
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
                <button className="btn log-in" type="submit">Login</button>
            <h1 className="heading forNew" onClick={toggleForm}>Create a new account
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
</svg> </h1>
</form>
    


            
            <form className='register' onSubmit={Signup}>
            <h1 className="heading forNew"> Creat a new Account </h1>
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
                <button type="submit" className="btn sign-up">Signup</button>
                <h1 className="heading forNew" onClick={toggleForm}> <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
</svg>  go back to login </h1>
            </form>
            
    </>
    );
}
