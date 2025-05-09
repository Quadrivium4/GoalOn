import { useState, useEffect, useContext, createContext} from "react"
import { FaRegBell } from "react-icons/fa"
import { useMessage } from "../../../context/MessageContext"
import { getNotifications, ignoreFriendRequest, acceptFriendRequest, readNotifications } from "../../../controllers/friends"
import { sameDay, isYesterday, getDate, getTime } from "../../Goals/Goals"
import styles from "./Notifications.module.css";
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
  <div className={styles["notification-bell"]}>
      <FaRegBell size={24} onClick={openNotifications}/>
      {newNotification && <div className={styles.point}></div>}
  </div>)
}