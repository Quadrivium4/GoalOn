import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../constants"
import { getRandomUserColor } from "../../utils"
import styles from "./ProfileIcon.module.css";

export default function ProfileIcon({profileImg, name, _id, size}: {profileImg?: string, name:string, _id: string, size?: number}){
    return (
       
       <div className={styles.profile} style={{width: size, height: size, backgroundColor: getRandomUserColor(_id)}} >
            {profileImg?<img src={baseUrl + "/file/" + profileImg} style={{width: size, height: size}} />: <h1 style={{fontSize: size}}>{name[0]}</h1>}
        </div> 

    )
}
export function ProfileIconLink({profileImg, name, _id, size}: {profileImg?: string, name:string, _id: string, size?: number}){
    return (
        <Link to={"/user/" + _id}>
            <ProfileIcon profileImg={profileImg} name={name} size={size} _id={_id}/>
         </Link>
    )
}