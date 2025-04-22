import React,{ReactNode, useState} from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { CredentialResponse, GoogleLogin, useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import { useMessage } from '../context/MessageContext';
import { AxiosError } from 'axios';
import classes from "./Form.module.css"
import {FcGoogle} from "react-icons/fc"
const errors = {
  INVALID_EMAIL: 1002,
  INVALID_PASSWORD: 1003,
}
function GoogleButton({onSuccess = ()=>{}, onError= ()=>{}, children}: {onSuccess?: (res: any)=>void, onError?: (message: string)=>void, children: ReactNode}) {
  const {login, googleLogin} = useAuth()
  const handleGoogleLogin = (token: string) =>{
      googleLogin(token).then((res)=>{
                onSuccess(res);
          }).catch((err) => {
            let msg =  err.message;
            // console.log("login error", err)
            // message.error(msg)
            console.log(err)
            onError(msg)
          })
  }
  const glog = useGoogleLogin({onSuccess: (res) =>handleGoogleLogin(res.access_token)})
  return (
    <>

        <button onClick={()=>{
            console.log("google clicked");
            glog();
            }} className='google-button outline'>
            <FcGoogle />
            {children}
        </button>

    </>
  );
}

export default GoogleButton;
