import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils';


function VerifyResetPassword() {
    const {userId, token} = useParams();
    const {verify, verifyPassword } = useAuth();
    const navigate = useNavigate()
    useEffect(()=>{
        if(userId && token) {
         verifyPassword({id: userId, token}).then((res)=>{

            navigate("/");
         }).catch(err =>{
            console.log("error", err)
         })
         
        }
    },[])
  return (
    <div>
      <h1>Verifying... </h1>
      <p>User Id: {userId}</p>
      <p>Token: {token}</p>
    </div>
  );
}

export default VerifyResetPassword;
