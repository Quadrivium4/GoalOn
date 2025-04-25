import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useNavigation, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';



function LandingPage() {
    const {userId, token} = useParams();
    const {verify} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams()
    const [prompt, setPropmpt] = useState<any>();
    const setEvent = (e: any) =>{
        e.preventDefault();
        setPropmpt(e);
    }
    useEffect(()=>{
       // console.log("landing mounting")
        console.log("hello landing", location, params)
        window.addEventListener("beforeinstallprompt",setEvent);
        return ()=>{
            window.removeEventListener("beforeinstallpropmpt", setEvent)
        }
    },[])
    return (
        
        <div>
        <h1>Landing page</h1>

        {prompt && <button onClick={() => prompt.prompt()}>download</button>}
        <Link to={"/register"}><button className='outline'>Sign up</button></Link>
        </div>
    );
}

export default LandingPage;
