import React,{useState} from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';


function Login() {
  const {login} = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  return (
    <div>
      <h1>Login</h1>
      <div className='form'>
        <input onChange={(e) =>setEmail(e.target.value)} value={email} type='email' placeholder='email'></input>
        <input onChange={(e) =>setPassword(e.target.value)} value={password} type='password' placeholder='password'></input>
        <button type='submit' onClick={async()=>{
          const response = await login({email, password})
          navigate("/");
          console.log(response)
          //message.success("Email Sent!")
        }}>Submit</button>
        <p>Don't have an account yet? <Link to={"/"}>Register</Link></p>
      </div>
    </div>
  );
}

export default Login;
