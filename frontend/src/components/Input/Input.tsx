import React,{useEffect, useState} from 'react';

const getStringFromMinutes = (minutes: number) =>{
    return Math.floor(minutes/60).toString()+ ":" + (minutes% 60).toString().padStart(2,"0")
}
const getTimeFromString = (timeString: string):{err: string | undefined, result: number} =>{
        let result;
        let error;
        let time = timeString.split(":")
        if(time.length < 2) {
            if(time[0] === "") result = 0;
            else{
                let hours = parseInt(time[0]);
                result = hours * 60
            }
        }else if(time.length < 3){
            if(time[0] === "") time[0] = "0"
            if(time[1] === "") time[1] = "0"
            let hours = parseInt(time[0]);
            let minutes = parseInt(time[1]);
            console.log({minutes, time})
            let timeInMinutes = hours * 60 + minutes;
            result = timeInMinutes
        }else {
            error = 'Invalid time string'
        }
        return {err: error, result: result || 0};
    }
const TimePicker = ({onSelect, initialValue = 0}: {onSelect: (timeInMinutes: number) =>void, initialValue?: number}) =>{
    const [input, setInput] = useState(initialValue? getStringFromMinutes(initialValue) : "")
    const [time, setTime] = useState(initialValue);
    const [error, setError] = useState("")
    const handleInputChange = (value: string) =>{
        setInput(value)
        let {err, result} = getTimeFromString(value);
        if(err) setError(err)
        else {
            if(error) setError("")
            onSelect(result);
            setTime(result)
        }

    }
    return (
        <input 
            className={error? "error": ""}
            placeholder={"hh:mm"} 
            value={input} 
            onChange={(e) => handleInputChange(e.target.value)} 
            onKeyDown={(e)=>{
                if(e.key === "Enter") setInput(getStringFromMinutes(time))
            }}
            onBlur={()=>setInput(getStringFromMinutes(time))}
            ></input>
    )
}

const DistancePicker = ({onSelect, initialValue= 0}: {onSelect: (distanceInMeters: number) =>void, initialValue?: number }) =>{
    const [distance, setDistance] = useState(initialValue);
    const [input, setInput] = useState(initialValue? initialValue.toString() : "")
    const handleInputChange = (value: string) =>{
        setInput(value)
        let km = parseFloat(value)
        
        if(Number.isNaN(km)) km = 0;
        let distanceInMeters = Math.round(km * 1000)
        onSelect(distanceInMeters)
        setDistance(distanceInMeters)
        
    }
    return (
        <input 
            //className={error? "error": ""}
            placeholder={"km (e.g 6.5)"} 
            type='number'
            value={input} 
            onChange={(e) => handleInputChange(e.target.value)} 
            onKeyDown={(e)=>{
                if(e.key === "Enter") setInput((distance/1000).toString())
            }}
            onBlur={()=>setInput((distance/1000).toString())}
         ></input>
    )
}
const Input = {
    TimePicker,
    DistancePicker
}
export default Input