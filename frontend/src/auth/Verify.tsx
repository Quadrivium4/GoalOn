import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


function Verify() {
    const {userId, token} = useParams();
    const {verify} = useAuth();
    const navigate = useNavigate()
    useEffect(()=>{
        if(userId && token) {
          verify({id: userId, token:token});
          navigate("/");
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

export default Verify;
