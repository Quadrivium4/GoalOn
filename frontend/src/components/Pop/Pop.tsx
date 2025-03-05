import { ReactNode } from "react";
import "./Pop.css"

const Pop = ({children, toggle}: {children: ReactNode, toggle: () => void}) =>{
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
                    {children}
                </div>
            </div>
        </div>)
}
export default Pop

