import axios, { AxiosError } from "axios";
import { baseUrl, protectedUrl, userColors } from "./constants";
import { resolve } from "path";

const delay = 3000;
const wait = async(data: any, headers: any) =>{
    return new Promise((resolve, reject) =>{
        setTimeout(()=>{
            resolve(data)
            console.log({data, headers})
        }, delay)
    })
    
}
type TBackendError = AxiosError & {
    response?: {
        data: {
            message: string,
            errorCode: number
        }
    }
}
export const api = axios.create({
    baseURL: baseUrl
});
api.interceptors.response.use(function(response){

    console.log({response});
    return response
}, function(error: TBackendError){
    if(error.response){
        const {message}  = error.response.data;
        throw new Error(message)
    }
    console.log({error});
    return error
}
)
//api.get("https://stackoverflow.com/questions/51447021/how-to-handle-api-call-error-with-jquery-ajax").then(resp=> console.log({resp})).catch(err => console.log(err))

export const protectedApi = () => {
   // let aToken = localStorage.getItem("aToken");
    //if(!aToken) return 0;
    //if(delay) await setTimeout(()=>{}, delay)
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
    let now = new Date();
    now.setHours(0,0,0,0);
    return now
}
export const getLastMonday = (date: number | Date) =>{
  date = new Date(date);
  date.setDate(date.getDate() - date.getDay() + 1);
  return date;
}
export const nextWeekTime =(date: number | Date) =>{
  date = new Date(date);
  date.setDate(date.getDate() + 7);
  return date;
}
export const isToday = (date: number | Date) =>{
    let date1 = new Date(date);
    date1.setHours(0,0,0,0);
    let today = getToday();
    return today.getTime() === date1.getTime();
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
    // console.log({before: number})
    number = number % userColors.length;
    //console.log({after: number});
    return userColors[number]
}
