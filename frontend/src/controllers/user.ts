// const addDay = async(day: TDayForm): Promise<TDay> =>{

import { TLoginForm, TUser } from "../context/AuthContext"
import { protectedApi } from "../utils"
import { wait } from "./days";
export type TUserForm = {
    name: string,
    bio: string
}
// }
const getUser = async(userId: string): Promise<TUser> =>{
    //await wait(5000)

    const res = await protectedApi.get("/user", {params: {id: userId}});
    return res.data;
}
const uploadProfileImg = async(formData: FormData): Promise<string> =>{
    const res =  await protectedApi.post("/user/upload-profile-image", formData,{headers: {"Content-Type": "multipart/form-data"}})
    return res.data
}
const changeEmail = async(form: TLoginForm): Promise<TUser> =>{
    const res =  await protectedApi.post("/change-email", form);
    return res.data
}
const putUser =  async(form: TUserForm): Promise<TUser> =>{
    //await wait(5000)

    const res = await protectedApi.put("/user", form);
    return res.data;
}
let controller = {
    uploadProfileImg,
    getUser,
    changeEmail,
    putUser
}
export  {
    uploadProfileImg,
    getUser,
    changeEmail,
    putUser
}
export default controller