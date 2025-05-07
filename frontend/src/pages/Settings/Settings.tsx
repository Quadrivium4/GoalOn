import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth, useUser } from '../../context/AuthContext';
import { useNavigate, useNavigation } from 'react-router-dom';
import ImageUpload from '../../components/ImageUpload';
import { baseUrl } from '../../constants';
import "./Settings.css"
import ProfileIcon from '../../components/ProfileIcon/ProfileIcon';
import { MdOutlineModeEditOutline } from "react-icons/md";
import Pop from '../../components/Pop/Pop';
import ChangeEmail from '../../components/ChangeEmail';
import EditAccount from './EditAccount';
import { FaBell, FaRegBell } from "react-icons/fa";
import { acceptFriendRequest, getNotifications, ignoreFriendRequest, readNotifications } from '../../controllers/friends';
import { getDate, getTime, isYesterday, sameDay } from '../Goals/Goals';
import { useMessage } from '../../context/MessageContext';
// function OldEditing() {
//   const {editUser} = useAuth();
//   const [pop, setPop] = useState<React.ReactNode>()
//   const user = useUser();
//   const [name, setName] = useState(user.name);
//   const [bio, setBio] = useState(user.bio);
//   const [isEditing, setIsEditing] = useState<"name" | "bio" | false>("bio")

//   const handleChange = () =>{
//       console.log("handle change")
//       editUser({name, bio}).then(()=>{
//         setIsEditing(false);

//       }).catch(err=>{
//         console.log("error editing user")
//       })
//   }
//   return (
//     <>
//     {pop && <Pop children={pop} toggle={() =>setPop(undefined)}/>}
//        <div className='text'>

//           <div className='edit'>
//             {isEditing != "name"?  
//             <>
//             <p onClick={()=>{
//               setIsEditing("name");
//              }}>{name}</p>
//              <MdOutlineModeEditOutline onClick={()=>{
//               setIsEditing("name");
//              }} />
//             </>:<>  <input onChange={(e) =>setName(e.target.value)} autoFocus value={name} placeholder='name'></input>
//               <button className='outline' onClick={handleChange}>save</button>
//               </>
//             }
           
//           </div>
//           <div className='edit' >
//              <p  onClick={() => setPop(<ChangeEmail />)}>{user.email}</p>
//               <MdOutlineModeEditOutline onClick={() => setPop(<ChangeEmail />)} />
//           </div>
//            <div className='edit'>
//             {isEditing != "bio"?  
//             <>
//             <p onClick={()=>setIsEditing("bio")}>{bio}</p>
//              <MdOutlineModeEditOutline onClick={()=>setIsEditing("bio")} />
//             </>:<>  <textarea onChange={(e) =>setBio(e.target.value)} value={bio} placeholder='biography' autoFocus></textarea>
//               <button className='outline' onClick={handleChange}>save</button>
//               </>
//             }
           
//           </div>
         
//         </div>
//     </>
   
//   )
// }

export type TNotification =  {
    _id: string,
    date: number,
    content: string,
    type: "like" | "incoming request" | "accepted request" | "comment", 
    from: {
        name: string,
        userId: string,
    }
    status: "read" | "unread"
}
type TNotificationContextProps = {
  notifications: TNotification[], 
  newNotification: boolean,
  setNotifications: React.Dispatch<React.SetStateAction<TNotification[]>>,
  setNewNotification: React.Dispatch<React.SetStateAction<boolean>>,

}
const isNewNotification = (notifications: TNotification[]) =>{
  let isNew = false;
  for (let i = 0; i < notifications.length && !isNew; i++) {
    if(notifications[i].status == 'unread') isNew = true;
  }
  return isNew
}
export const NotificationContext = createContext<TNotificationContextProps | null>(null)
export const NotificationProvider = ({children}: {children: React.ReactNode}) =>{
  const [notifications, setNotifications] = useState<TNotification[]>([])
  const [newNotification, setNewNotification] = useState(false);
  useEffect(()=>{
      getNotifications().then(res =>{
        console.log(res)
        let isNew = isNewNotification(res)
        if(isNew) setNewNotification(true)
        setNotifications(res)

      }).catch(err =>{
        console.log("err notifications")
      })
  },[])
  
  return <NotificationContext.Provider value={{notifications, newNotification, setNotifications, setNewNotification}}>{children}</NotificationContext.Provider>
}

export function Notifications(){
  const {notifications, setNotifications} = useNotifications();
  const {message} = useMessage()
  const handleIgnore = async(id: string) =>{
    ignoreFriendRequest(id).then(newUser =>{
        setNotifications(newUser.notifications);
    }).catch(err =>{
       console.log(err)
      message.error(err.message)
    }
     
    )
      
    }
  const handleAccept = async(id: string) =>{
    acceptFriendRequest(id).then(newUser =>{
       setNotifications(newUser.notifications);
    }).catch(err =>{
      console.log("err", err)
    })
   
  }
  return (
    <div className='notifications'>
      <h2>Notifications</h2>
      {notifications.length > 0? notifications.sort((a, b)=> b.date -a.date).map(notification =>{
        return (
          <div className='notification' key={notification._id}>
            <p className='date'>{sameDay(notification.date, new Date())? "Today" : isYesterday(notification.date)? "Yesterday": getDate(notification.date)} at {getTime(notification.date)}</p>
            {notification.type === "incoming request"? <>
                <p>{notification.from.name} wants to be friends!</p>
                <div className='buttons' style={{display: "flex"}}>
                  <button className='outline' onClick={()=> handleAccept(notification.from.userId)}>accept</button>
                  <button className='outline gray' onClick={()=>handleIgnore(notification.from.userId)}>ignore</button>
                  <button className='outline gray' onClick={()=>setNotifications([])}>bu</button>
                </div>
                
            </>: 
            <p>{notification.content}</p>}
          </div>

        )
      }): <p>no notifications</p>}
    </div>
  )
}
export function useNotifications(){
  const notificationContext = useContext(NotificationContext);
  if(!notificationContext) throw new Error("notification context must be used inside provider")
  return notificationContext
}

export function NotificationBell({setPop}: {setPop: (content: React.ReactNode)=>void}){
  const {notifications, setNewNotification, newNotification, setNotifications} = useNotifications();
  console.log({notifications})
  const openNotifications = () =>{
    setPop(<Notifications />);
    let ids = notifications.map(not => not._id);
    readNotifications(ids).then(res =>{
      res.map(not => !newNotification && not.status === "unread"? setNewNotification(true) : setNewNotification(false));
      setNotifications(res);
    })
  }
  return (
  <div className='notifications'>
      <FaRegBell size={24} onClick={openNotifications}/>
      {newNotification && <div className='point'></div>}
  </div>)
}
function Settings() {
  const {logout, deleteAccountRequest, editUser} = useAuth();
  const [pop, setPop] = useState<React.ReactNode>()
  const user = useUser();
  const [bio, setBio] = useState(user.bio)
  const [name, setName] = useState(user.name)
  const {updateUserProfileImage} = useAuth();
  const [isEditing, setIsEditing] = useState<"name" | false>();

 
  const handleChange = () =>{
      console.log("handle change")
      editUser({name, bio}).then(()=>{
        setIsEditing(false)
      }).catch(err=>{
        console.log("error editing user")
      })
  }
  return (
    <div id='settings' className='page'>
      
      <div className="header">
        <h1>Account</h1>
           {pop && <Pop children={pop} toggle={() =>setPop(undefined)}/>}
          <NotificationBell setPop={setPop} />
      </div>
      
      <div className='info'>
        <ImageUpload onUpload={(id) => updateUserProfileImage(id)}>
          <ProfileIcon profileImg={user.profileImg} name={user.name} _id={user._id}></ProfileIcon>
        </ImageUpload>
         <div className='text'>
          <div className='edit'>
             {isEditing !== "name"?  
            <>
            <p onClick={()=>{
              setIsEditing("name");
             }}>{name}</p>
             <MdOutlineModeEditOutline onClick={()=>{
              setIsEditing("name");
             }} />
            </>:<>  <input onChange={(e) =>setName(e.target.value)} autoFocus value={name} placeholder='name'></input>
              <button className='outline' onClick={handleChange}>save</button>
              </>
            }
           
          </div>
          <div className='edit'>
                <p onClick={()=>setPop(<ChangeEmail setPop={setPop} />)}>{user.email}</p>
                <MdOutlineModeEditOutline onClick={()=>setPop(<ChangeEmail setPop={setPop} />)} />
            </div>
        </div>

      </div>
      <div className='edit-bio'>
              <textarea className='bio' value={bio} onChange={(e) =>setBio(e.target.value)} placeholder='write something about you...'></textarea>
              
              {user.bio !== bio &&<button onClick={()=> editUser({name: user.name, bio})}>save</button>}
          </div>
     <div className="buttons">
           <button className='outline' onClick={async() =>{
        let res  = await logout();
        console.log("navigating")
   
        window.location.replace("/")
        }}>logout</button>
        <button className="outline error" onClick={async() =>{
        let res  = await deleteAccountRequest();
        console.log("navigating")
   
        window.location.replace("/")
        }}>Delete Account</button>
     </div>
     
    </div>
  );
}

export default Settings;
