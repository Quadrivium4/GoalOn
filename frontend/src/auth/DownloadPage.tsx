import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useNavigation, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import iphoneImg1 from '../assets/images/iphone-download1.jpg';
import iphoneImg2 from '../assets/images/iphone-download2.jpg';
import statsImg from '../assets/images/stats.jpg';
import friendsImg from '../assets/images/friends.jpg';
import { MdIosShare } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { VscDesktopDownload } from "react-icons/vsc";
import "./DownloadPage.css"
import { colors } from '../constants';

function DownloadPage() {
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
        <>
        <div className="instructions">
        <Link to={"/"}>{"<"} Back</Link>
        <h1>Download</h1>
        <section id='iphone'>
            <h2>iPhone</h2>
            <p>In Safari browser, tap on the share button <span className="icon"><MdIosShare  color={colors.primary} style={{marginLeft: 5}} size={20} className='icon'></MdIosShare></span></p>
            {/* <img src={iphoneImg1} alt='goals screenshot' className='app-screenshot1' /> */}
            <p>Then tap on '<span>Add to Home Screen</span>' and then on '<span>Add</span>'</p>
            {/* <img src={iphoneImg2} alt='goals screenshot' className='app-screenshot1' /> */}
        </section>
        <section id='android'>
           <h2>Android</h2>
            <p>In Chrome browser, tap on the 3 dots <span className="icon"><BsThreeDotsVertical color={colors.primary} size={20} className='icon'/></span></p>
            {/* <img src={iphoneImg1} alt='goals screenshot' className='app-screenshot1' /> */}
            <p>Then tap on '<span>Install</span>'</p>
            {/* <img src={iphoneImg2} alt='goals screenshot' className='app-screenshot1' /> */}
        </section>
        <section id='desktop'>
           <h2>Desktop</h2>
            <p>Inside the search bar, on the right click on the download icon <span className="icon"><VscDesktopDownload  color={colors.primary} size={20}   style={{marginLeft: 5}} className='icon'/></span></p>
            {/* <img src={iphoneImg1} alt='goals screenshot' className='app-screenshot1' /> */}
            <p>Then tap on '<span>Install</span>'</p>
            {/* <img src={iphoneImg2} alt='goals screenshot' className='app-screenshot1' /> */}
        </section>
       
        </div>
        </>
    );
}

export default DownloadPage;
