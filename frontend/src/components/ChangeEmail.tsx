import React,{useState} from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { CredentialResponse, GoogleLogin, useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import { useMessage } from '../context/MessageContext';
import { AxiosError } from 'axios';
import classes from "./Form.module.css"
import GoogleButton from '../components/GoogleButton';
const errors = {
  INVALID_EMAIL: 1002,
  INVALID_PASSWORD: 1003,
}
function ChangeEmail({setPop}: {setPop: (children: React.ReactNode)=>void}) {
  const {changeEmail} = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const {message} = useMessage();
  const [error, setError] = useState(null)
  const handleChange = () =>{
      setError(null)
      changeEmail({email, password}).then((res)=>{
              console.log(res)
              setPop(undefined)
          }).catch(err => {

            let msg =  err.message
            console.log("login error", {err})
            setError(err.errorCode);
            message.error(msg)
          })
  }
  return (
    <>
      
      <div className={'form'}>
        <h2>Change Email</h2>
        <input onChange={(e) =>setEmail(e.target.value)} value={email} type='email' placeholder='email'></input>
        <input onChange={(e) =>setPassword(e.target.value)} value={password} type='password' placeholder='password'></input>
        <button type='submit' onClick={handleChange}>Submit</button>
      </div>
    </>
  );
}

export default ChangeEmail;
