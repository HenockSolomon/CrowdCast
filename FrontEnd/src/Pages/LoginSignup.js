import { React, useState } from "react";
import Navbar from "../HeaderPublic";
import {  useNavigate  } from "react-router-dom";
import axios from "axios";


export default function LoginSignup (){
    const navigate = useNavigate();
    const [username, setUsername]= useState('');
    const [email, setEmail]= useState('');
    const [password, setPassword]= useState('');
    const [redirect, setRedirect]= useState(false);
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
            if (response.status === 200){
                window.localStorage.setItem("token", response.data);
                setRedirect(true);
                    console.log('Successfully registered');
                    alert('Successfully registered');
                    navigate ('/UserProfile');
            }else{
                const error = await response.json();
                console.log(error);
                console.log('Signup Failed: username or email already exists');
                alert('Signup Failed: username or email already exists');
            }
       }catch (error){
        console.log(error);
        console.log('signup Failed either because you used the invalid username or email')
        alert('Signup Failed either because you used the invalid username or email')
       }
      
    }

// this is for the login page to login the user and take user information
    
async function Login(e){
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:8000/login', {
            username,
            password
        }).then(function (response) {
            console.log(response);
            navigate('/UserProfile');
            if(response.status === 200){
                window.localStorage.setItem("token", response.data);
                
                alert('Log in successful');
                
            } else {
                console.log(response.data);
                alert("Username or password doesn't match");
            }
        })
        console.log(username);
      
    } catch(error){
        
        alert("Invalid Username or password");
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