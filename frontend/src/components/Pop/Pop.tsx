import { ReactNode, useEffect } from "react";
import "./Pop.css"
import { usePop } from "../../context/PopContext";
import { useLocation } from "react-router-dom";

const Pop = ({children, toggle}: {children?: ReactNode, toggle?: () => void}) =>{
    const {content, closePop, title} = usePop();
    const location = useLocation();
    useEffect(()=>{
        if(!children && !content) return;
        document.body.style.overflow = "hidden";
        // document.documentElement.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = "unset";
            //document.documentElement.style.overflow = 'unset'
        }
    },[children, content])
    useEffect(()=>{
        closePop();
    },[location])
    const handleClick = () =>{

        if(toggle) toggle();
        else closePop()
    }
    if(!children && !content) return null
    return (
        <div id="pop-layer">
            <div id="pop-up">
                <div className="header">
                    <h2 className="title">{title}</h2>
                    <div id="close-pop" onClick={handleClick}>
                        <span className="n1"></span>
                        <span className="n2"></span>
                    </div>
                </div>
                
                <div id="pop-body">
                    {/* <p>{document.body.style.overflow}</p> */}
                    {children || content}
                </div>
            </div>
        </div>)
}
export default Pop

