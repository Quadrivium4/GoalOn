import { baseUrl } from "../constants"
import { getRandomUserColor } from "../utils"

export default function ProfileIcon({profileImg, name, _id}: {profileImg?: string, name:string, _id: string}){
    return (
       <div className='profile' style={{backgroundColor: getRandomUserColor(_id)}}>
            {profileImg?<img src={baseUrl + "/file/" + profileImg} />: <h1>{name[0]}</h1>}
        </div> 
    )
}