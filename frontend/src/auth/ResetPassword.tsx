import React,{useState} from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { CredentialResponse, GoogleLogin, useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import { useMessage } from '../context/MessageContext';
import { AxiosError } from 'axios';
import { api } from '../utils';

function ResetPassword() {
  const {login, googleLogin} = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
    const handleResetPass = () =>{
        api.post("/reset-password", {email, password}).then(res =>{
            console.log(res)
        }).catch(err =>{
            console.log(err)
        })
    }
  return (
    <div>
      <h1>Reset Password</h1>
      <div className='form'>
        <input onChange={(e) =>setEmail(e.target.value)} value={email} type='email' placeholder='email'></input>
        <input onChange={(e) =>setPassword(e.target.value)} value={password} type='password' placeholder='new password'></input>
        <button type='submit' onClick={handleResetPass}>Submit</button>
        {/* <p>Don't have an account yet? <Link to={"/"}>Register</Link></p> */}
       
        {/* <GoogleLogin onSuccess={handleGoogleLogin} onError={()=> console.log("Error google login")}/> */}
      </div>
    </div>
  );
}

export default ResetPassword;
