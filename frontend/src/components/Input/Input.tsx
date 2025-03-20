import React,{useEffect, useState} from 'react';

const getStringFromMinutes = (minutes: number) =>{
    return Math.floor(minutes/60).toString()+ ":" + (minutes% 60).toString().padStart(2,"0")
}
const TimePicker = ({onSelect, initialValue = 0}: {onSelect: (timeInMinutes: number) =>void, initialValue?: number}) =>{
    const [time, setTime] = useState(initialValue);
    const [input, setInput] = useState(initialValue? getStringFromMinutes(initialValue) : "")
    const [error, setError] = useState(false)
    useEffect(()=>{
        onSelect(time)
    },[time, onSelect])
     useEffect(() =>{
        handleValidation(input)
    },[input])
    const handleValidation = (timeString: string) =>{
        
        let time = timeString.split(":")
        if(time.length < 2) {
            if(time[0] === "") return;
            let hours = parseInt(time[0]);
            setTime(hours * 60);
            //setInput(hours.toString() + ":00")
        }else if(time.length < 3){
            if(time[0] === "") time[0] = "0"
            if(time[1] === "") time[1] = "0"
            let hours = parseInt(time[0]);
            let minutes = parseInt(time[1]);
            console.log({minutes, time})
            let timeInMinutes = hours * 60 + minutes;
            setTime(timeInMinutes);
            //setInput(getStringFromMinutes(timeInMinutes))
        }else {
            setError(true)
        }
    }
    const validateString = (string: string) =>{
        for(let i = 0; i< string.length; i++){
            
        }
    }
    return (
        <input 
            className={error? "error": ""}
            placeholder={"hh:mm"} 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e)=>{
                if(e.key === "Enter") setInput(getStringFromMinutes(time))
            }}
            onBlur={()=>setInput(getStringFromMinutes(time))}></input>
    )
}
const getStringFromMeters = (meters: number) =>{
    let rest = meters% 1000 
    let restString =  rest? "." + rest : ""
            
    return Math.floor(meters/1000) + restString;
}
const DistancePicker = ({onSelect, initialValue= 0}: {onSelect: (distanceInMeters: number) =>void, initialValue?: number }) =>{
    const [distance, setDistance] = useState(initialValue);
    const [input, setInput] = useState(initialValue? getStringFromMeters(initialValue): "")
    const [error, setError] = useState(false)
    useEffect(()=>{
        onSelect(distance)
    },[distance, onSelect])
    useEffect(() =>{
        handleValidation(input)
    },[input])
    const handleValidation = (distanceString: string) =>{
        let distance = distanceString.split(".")
        console.log({distance})
        if(distance.length < 2) {
            if(distance[0] === "") return;
            let kilometers = parseInt(distance[0]);
            setDistance(kilometers * 1000);
        }else if(distance.length < 3){
            let kilometers = parseInt(distance[0]);
            let meters = parseInt(distance[1].padEnd(3, "0"))
            let distanceInMeters = kilometers * 1000 + meters;
            setDistance(distanceInMeters);
        }else {
            setError(true)
        }
    }
    return (
        <input 
            className={error? "error": ""}
            placeholder={"km (e.g 6.5)"} 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e)=>{
                if(e.key === "Enter") {
                    handleValidation(input);
                    setInput(getStringFromMeters(distance))
                } 
            }}
            onBlur={()=>{
                handleValidation(input);
                setInput(getStringFromMeters(distance))
            }}></input>
    )
}
const Input = {
    TimePicker,
    DistancePicker
}
export default Input