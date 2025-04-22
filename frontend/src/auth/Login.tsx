import React,{useState} from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { CredentialResponse, GoogleLogin, useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import { useMessage } from '../context/MessageContext';
import { AxiosError } from 'axios';
const errors = {
  INVALID_EMAIL: 1002,
  INVALID_PASSWORD: 1003,
}
function Login() {
  const {login, googleLogin} = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const {message} = useMessage();
  const [error, setError] = useState(null)
  const handleLogin = () =>{
      setError(null)
      login({email, password}).then((res)=>{
              navigate("/");
              console.log(res)
          }).catch(err => {

            let msg =  err.message
            console.log("login error", {err})
            setError(err.errorCode);
            message.error(msg)
          })
  }
  // const handleGoogleLogin = (res: CredentialResponse) =>{
  //     googleLogin(res).then((res)=>{
  //             navigate("/");
  //             console.log(res)
  //         }).catch((err) => {
      
  //           let msg =  err.message;
  //           console.log("login error", err)
  //           message.error(msg)
  //         })
  // }
  const handleGoogleLogin = (token: string) =>{
      googleLogin(token).then((res)=>{
              navigate("/");
              console.log(res)
          }).catch((err) => {
      
            let msg =  err.message;
            console.log("login error", err)
            message.error(msg)
          })
  }
  const glog = useGoogleLogin({onSuccess: (res) =>handleGoogleLogin(res.access_token)})//useGoogleOneTapLogin({onSuccess: (token) =>handleGoogleLogin(token)});
  //{credential: token, clientId: process.env.REACT_APP_CLIENT_ID}
  return (
    <div>
      <h1>Login</h1>
      <div className='form'>
        <input onChange={(e) =>setEmail(e.target.value)} value={email} type='email' placeholder='email'></input>
        <input onChange={(e) =>setPassword(e.target.value)} value={password} type='password' placeholder='password'></input>
        <button type='submit' onClick={handleLogin}>Submit</button>
        <p>Don't have an account yet? <Link to={"/"}>Register</Link></p>
        <button onClick={()=>glog()}>google</button>
       {error === errors.INVALID_PASSWORD && <><p>Have you lost your password?</p><Link to={"/reset-password"} state={{email}} >reset password</Link></>}
        {/* <GoogleLogin onSuccess={handleGoogleLogin} onError={()=> console.log("Error google login")}/> */}
      </div>
    </div>
  );
}

export default Login;
