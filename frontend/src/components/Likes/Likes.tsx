import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../constants"
import { getRandomUserColor } from "../../utils"
import styles from "./Likes.module.css";
import { TLike } from "../../controllers/days";
import ProfileIcon from "../ProfileIcon/ProfileIcon";
import { usePop } from "../../context/PopContext";
import { useEffect } from "react";

export function LikesList({likes}:{likes: TLike[]}){
    const {closePop} = usePop();
    const navigate = useNavigate();
    const handleClick = (id: string) =>{
        closePop();
        navigate("/user/" + id);
    }
  return <div className={styles.likesList}>
    {
      likes.map(like=>{
        return <div className={styles.like} key={like.userId} onClick={()=>handleClick(like.userId)}>
          <ProfileIcon profileImg={like.profileImg} _id={like.userId} name={like.username} size={30}/>
          <h3>{like.username}</h3>
        </div>
      })
    }
    </div>
}
export function Likes({likes}:{likes: TLike[]}){
  const {setPop} = usePop();
//   useEffect(()=> {
//     console.log({likes})
//     setPop(<LikesList likes={likes}  />)
// },[likes])
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) =>{
    setPop(<LikesList likes={likes}  />)
  }
  if(likes.length === 0) return null
  return (
    <div className={styles.likes}onClick={handleClick}>
    {
      likes.slice(0, 5).map((like, i)=>{
        return <div className='like' key={like.userId} style={{marginLeft: i>0? -15: 0}}>
          <ProfileIcon profileImg={like.profileImg} _id={like.userId} name={like.username} size={24}/>
        </div>
      })
     
    }
     <p>{likes.length} liked your progress</p>
    </div>
  )
}