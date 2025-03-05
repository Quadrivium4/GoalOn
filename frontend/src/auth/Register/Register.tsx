import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMessage } from '../../context/MessageContext';
import { Link } from 'react-router-dom';


function Register() {
  const {register} = useAuth()
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const {message} = useMessage()
  return (
    <>
      <h1>Register</h1>
      <div className='form'>
        <input onChange={(e) =>setName(e.target.value)} value={name} type='text' placeholder='username'></input>
        <input onChange={(e) =>setEmail(e.target.value)} value={email} type='email' placeholder='email'></input>
        <input onChange={(e) =>setPassword(e.target.value)} value={password} type='password' placeholder='password'></input>
        <button type='submit' onClick={async()=>{
          const response = await register({name, email, password})
          console.log(response)
          //message.success("Email Sent!")
        }}>Submit</button>
        <p>Already have an account? <Link to={"/login"}>Login</Link></p>
      </div>
      
    </>
  );
}

export default Register;
