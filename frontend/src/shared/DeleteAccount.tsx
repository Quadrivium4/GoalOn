import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils';
import { useMessage } from '../context/MessageContext';


function DeleteAccount() {
    const {id, token} = useParams();
    const {verify} = useAuth();
    const navigate = useNavigate()
    const{message} = useMessage();
    const [status, setStatus] = useState("loading");
    useEffect(()=>{
        if(id && token) {
            api.post('/delete-account', {id, token}).then(res =>{
                setStatus("success")
                message.success("account deleted succesfully");
            }
                
            ).catch(err =>{
                setStatus("error")
                message.error(err.message)
            })
        }
    },[])
  return (
    <div>
      {status == "loading" ? <h1>Deleting your account... </h1>
      :status == "success"? <>
        <h1>Your account has been succesfully deleted!</h1>
        <Link to={"/"}>{"<"} back to home</Link>
      </> :
      status == "error"? <>
      <h1>Something went wrong, try again</h1> 
      <Link to={"/"}>{"<"} back to home</Link>
      </>: null}

    </div>
  );
}

export default DeleteAccount;
