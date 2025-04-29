import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useNavigation, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import goalsImg from '../assets/images/goals.jpg';
import statsImg from '../assets/images/stats.jpg';
import friendsImg from '../assets/images/friends.jpg';
import "./LandingPage.css"

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
    const handleDownload = () =>{
        if(prompt) prompt.prompt();
        else {
            navigate("/download")
        }
    }
    return (
        
        <div id='landing-page'>
        <section id='set-goal'>
            <div className='text'>
                <h1>Set your goal</h1>
                <p>stay motivated, work hard and you will achieve it!</p>
                <p></p>
                <div className='buttons'>
                     {window.matchMedia("(display-mode: standalone)").matches? <Link to={"/login"}><button>Login</button></Link>: <button onClick={handleDownload}>download</button>}
                    <Link to={"/register"}><button className='outline'>Sign up</button></Link>
                </div>
            </div>
            
            <img src={goalsImg} alt='goals screenshot' className='app-screenshot1' />
        </section>
        <section id='track-progress'>
              <img src={statsImg} alt='goals screenshot' className='app-screenshot2' />
            <div className='text'>
              
                <h1>Track your progress</h1>
                <p>get detailed stats of your goal over time!</p>
                <div className='buttons'>
                    <Link to={"/register"}><button className='outline'>Start now</button></Link>
                </div>
                   
            </div>
            

        </section>
        <section id='share-friends'>
            <div className='text'>
                <h1>Share with friends</h1>
                <p>Share your progress with your friends, and follow them back!</p>
                <div className='buttons'>
                     {/* {<button onClick={() => prompt.prompt()}>download</button>} */}
                    <Link to={"/register"}><button className='outline'>Join for Free</button></Link>
                </div>
            </div>
            
            <img src={friendsImg} alt='goals screenshot' className='app-screenshot3' />
        </section>
       
        </div>
    );
}

export default LandingPage;
