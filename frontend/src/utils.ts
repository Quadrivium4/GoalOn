import axios from "axios";
import { baseUrl, protectedUrl, userColors } from "./constants";

export const api = axios.create({
    baseURL: baseUrl
});
export const protectedApi = () => {
    let aToken = localStorage.getItem("aToken");
    //if(!aToken) return 0;
    return axios.create({
    baseURL: protectedUrl,
    headers: {
        "Authorization":  "Bearer " + localStorage.getItem("aToken"),
    }
})
}
export const getTimeAmount = (timeInMinutes: number) =>{
    return Math.floor(timeInMinutes/60) + ":" + (timeInMinutes % 60).toString().padStart(2,"0");
}
export const getNormalizedPercentage = (max: number, value: number, dayDiveder = 1)=>{ 
    let percentage = Math.round(100/(max/dayDiveder)* value);;
    if(percentage>100)return 100
    return percentage
}
export const getToday = () =>{
    //let now = new Date()
    let now = new Date("2024-12-28T22:00:00.000Z");
    now.setHours(0,0,0,0);
    return now
}
export function getRandomColorNumber(){
    return (Math.random() * 180).toFixed(0) 
}
export function getRandomColor(){
    return `rgb(${getRandomColorNumber()},${getRandomColorNumber()},${getRandomColorNumber()})`;
}
export function getRandomUserColor(userId: string){
    userId = userId.substring(18)
    let number = parseInt(userId, 16);
     console.log({before: number})
    number = number % userColors.length;
    console.log({after: number});
    return userColors[number]
}
export const getLastMonday = (date: number | Date) =>{
  date = new Date(date);
  date.setDate(date.getDate() - date.getDay() + 1);
  return date;
}
