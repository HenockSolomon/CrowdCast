import { React, useState } from "react";
import Navbar from "../HeaderPublic";
import { Navigate } from "react-router-dom";
import { useLocation, Link, useNavigate  } from "react-router-dom";
import UserProfile from "./UserProfile";


export default function LoginSignup (){
    const location = useLocation();
    const navigate = useNavigate();
    const [username, setUsername]= useState('');
    const [email, setEmail]= useState('');
    const [password, setPassword]= useState('');
    const [redirect, setRedirect]= useState(false);


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
                setRedirect(true);
                    console.log('Successfully registered');
                    navigate ('/UserProfile');
            }else{
                const error = await response.json();
                console.log(error.msg);
            }
       }catch (error){
        console.log(error);
       }
      
    }

// this is for the login page to login the user and take user information
    
async function Login(e){
    e.preventDefault();
try{
const Response = await fetch('http://localhost:8000/login',{
    method: 'POST',
    body: JSON.stringify({username, password}),
    headers: { 'Content-Type': 'application/json'},
});
    if(Response.status === 200){
        const data = await Response.json();
        
        setRedirect(true);
        navigate ('/UserProfile');
        console.log(data);
    }else{
        const error = await Response.json();
        console.log(error.msg);
    }

}catch(error){
    console.log(error);
}


}



// return of the component
    
    return redirect ? <Navigate to='/UserProfile' username={username} />:(
        <div>
            <Navbar>
                {location.pathname === '/LoginSignup' ?
                    <>
                        <li><Link to="/About" className='about'>About Us</Link></li>
                        <li><Link to="/UserProfile">{username}</Link></li>
                        <li><Link to="/CreatePost" className='CreatePost'>Create Post</Link></li>
                    </>
                    : null
                }
            </Navbar>
            <h1 className="heading">If you have an account </h1>


            <h1 className="loginHeadline">Login into your account</h1>
            <form className="login" onSubmit={Login}>
                <input type="text" 
                    placeholder="Username"
                    value={username}
                    onChange={((e)=> setUsername(e.target.value))}/>
                <input type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={((e)=> setPassword(e.target.value))}/>
                <button>Login<Link to={'/UserProfile'}/>  </button>
                
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
                <button>Signup</button>
            
            </form>
        </div>
    );
}