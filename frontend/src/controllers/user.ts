// const addDay = async(day: TDayForm): Promise<TDay> =>{

import { TUser } from "../context/AuthContext"
import { protectedApi } from "../utils"

// }
const getUser = async(userId: string): Promise<TUser> =>{
    const res = await protectedApi().get("/user", {params: {id: userId}});
    return res.data;
}
const uploadProfileImg = async(formData: FormData): Promise<string> =>{
    const res =  await protectedApi().post("/user/upload-profile-image", formData,{headers: {"Content-Type": "multipart/form-data"}})
    return res.data
}

export  {
    uploadProfileImg,
    getUser
}