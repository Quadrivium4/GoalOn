import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils';
import { useMessage } from '../context/MessageContext';


function ResetPassword() {
    const {id, token} = useParams();
    const {verify} = useAuth();
    const navigate = useNavigate()
    const{message} = useMessage();
    useEffect(()=>{
        if(id && token) {
            api.post('/delete-account', {id, token}).then(res =>{
                message.success("account deleted succesfully");
            }
                
            )
        }
    },[])
  return (
    <div>
      <h1>Deleting account </h1>

    </div>
  );
}

export default ResetPassword;
