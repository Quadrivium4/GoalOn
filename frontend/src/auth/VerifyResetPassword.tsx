import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils';
import { useMessage } from '../context/MessageContext';


function VerifyResetPassword() {
    const {userId, token} = useParams();
    const {verify, verifyPassword } = useAuth();
    const isVerifing = useRef(false)
    const navigate = useNavigate()
    const {message} = useMessage()
    useEffect(()=>{
        // don't verify twice because of <StrictMode>
        if(isVerifing.current) console.log("already verifying...")
        if(userId && token && !isVerifing.current) {
          isVerifing.current = true;
         verifyPassword({id: userId, token}).then((res)=>{
            isVerifing.current = false;
            navigate("/");
         }).catch(err =>{
            console.log("error", err)
            message.error("Cannot verify password, try again");
            navigate("/")
         })
         
        }
    },[])
  return (
    <div>
      <h1>Verifying... </h1>
    </div>
  );
}

export default VerifyResetPassword;
