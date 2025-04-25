import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMessage } from '../../context/MessageContext';
import { Link, useNavigate } from 'react-router-dom';
import styles from "../Form.module.css"
import { CredentialResponse, GoogleLogin, useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import Login from '../Login';
import GoogleButton from '../../components/GoogleButton';
//console.log(styles)

function Register() {
  const {register, googleLogin} = useAuth()
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const {message} = useMessage();
  const navigate = useNavigate();

  const handleGoogleLogin = () =>{
    navigate("/")
  }


  return (
    <>
      <h1>Register</h1>
      <div className={'form'} >
        <input onChange={(e) =>setName(e.target.value)} value={name} type='text' placeholder='username'></input>
        <input onChange={(e) =>setEmail(e.target.value)} value={email} type='email' placeholder='email'></input>
        <input onChange={(e) =>setPassword(e.target.value)} value={password} type='password' placeholder='password'></input>
        <button type='submit' onClick={()=>{
          register({name, email, password}).then(res =>{
              console.log(res)
          })
          //console.log(response)
          //message.success("Email Sent!")
        }}>Submit</button>
        <p>- or -</p>
        <GoogleButton onSuccess={handleGoogleLogin} onError={message.error} >Sign up With google</GoogleButton>
         <p>Already have an account? <Link to={"/login"}>Login</Link></p>
      </div>
      {/* <Login /> */}
    </>
  );
}

export default Register;
