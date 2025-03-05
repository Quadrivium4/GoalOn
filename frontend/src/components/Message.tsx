import React, { useEffect, useState } from 'react';
import { useMessage } from '../context/MessageContext';


function Message() {
    const  message = useMessage();
    const {content, type} = message;
    const [hidden, setHidden] = useState(true);
    const [classes, setClasses] = useState<string[]>(type? [type, "hidden"] : ["hidden"]);
    useEffect(()=>{
        setClasses(message.type? [message.type] : [])
        setHidden(false);
        let timeout = setTimeout(()=>setHidden(true), 5000)
        return () => clearTimeout(timeout)
    },[message])
    useEffect(() =>{
        //console.log({hidden})
        if(hidden) setClasses(classes => [...classes, "hidden"])
        else if(!hidden) setClasses(classes => classes.filter(classname => classname !== "hidden"))
    },[hidden])
    return (
        <>
        <div id='message' className={classes.join(" ")} onClick={() => setHidden(true)}>
            <p>{content}</p>
        </div>
        </>
    );
}

export default Message;
