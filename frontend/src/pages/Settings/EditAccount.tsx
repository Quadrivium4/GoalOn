import React,{useState} from 'react';
import { useAuth, useUser } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { CredentialResponse, GoogleLogin, useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import { useMessage } from '../../context/MessageContext';
import { AxiosError } from 'axios';
import classes from "./Form.module.css"
import GoogleButton from '../../components/GoogleButton';
const errors = {
  INVALID_EMAIL: 1002,
  INVALID_PASSWORD: 1003,
}
function EditAccount() {
  const {editUser} = useAuth()
  const user = useUser()
  const [bio, setBio] = useState<string>(user.bio);
  const [name, setName] = useState<string>(user.name);
  const {message} = useMessage();
  const [error, setError] = useState(null)

     const handleChange = () =>{
      console.log("handle change")
      editUser({name, bio}).then(()=>{

      }).catch(err=>{
        console.log("error editing user")
      })
  }
  return (
    <>
      
      <div className={'form'}>
        <h2>Edit Account</h2>
        <input onChange={(e) =>setName(e.target.value)} value={name} placeholder='name'></input>
        <textarea onChange={(e) =>setBio(e.target.value)} value={bio} placeholder='about you'></textarea>
        <button type='submit' onClick={handleChange}>Save</button>
      </div>
    </>
  );
}

export default EditAccount;
