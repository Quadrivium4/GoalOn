import { ReactNode, useEffect } from "react";
import "./Pop.css"

const Pop = ({children, toggle}: {children: ReactNode, toggle: () => void}) =>{
    useEffect(()=>{
        document.body.style.overflow = "hidden";
        // document.documentElement.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = "unset";
            //document.documentElement.style.overflow = 'unset'
        }
    },[])
    const handleClick = () =>{

        toggle();
    }
    return (
        <div id="pop-layer">
            <div id="pop-up">
                <div id="close-pop" onClick={handleClick}>
                    <span className="n1"></span>
                    <span className="n2"></span>
                </div>
                <div id="pop-body">
                    <p>{document.body.style.overflow}</p>
                    {children}
                </div>
            </div>
        </div>)
}
export default Pop

