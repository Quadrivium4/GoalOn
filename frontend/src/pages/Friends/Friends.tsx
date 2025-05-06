import React,{ReactNode, useEffect, useState} from 'react';
import { TUser, useAuth, useUser } from '../../context/AuthContext';
import Pop from '../../components/Pop/Pop';
import Select from '../../components/Select/Select';
import Input from '../../components/Input/Input';
import { getRandomColor, getRandomUserColor } from '../../utils';
import AddGoal from '../../components/AddGoal';
import AddProgress from '../../components/AddProgress';
import { TMyGoal, useDays } from '../../context/DaysContext';
import { MdOutlineModeEditOutline , MdOutlineThumbUpOffAlt} from "react-icons/md";
import EditGoal from '../../components/EditGoal';
import { TDay, TGoalAmountType, TLike, TProgress } from '../../controllers/days';
import { acceptFriendRequest, cancelFriendRequest, deleteFriend, getFriends, getLazyFriends, getUsers, sendFriendRequest, TLazyFriendsResponse } from '../../controllers/friends';
import { RiUserAddLine } from "react-icons/ri";
import { RiUserUnfollowLine } from "react-icons/ri";
import { RiUserSearchLine } from "react-icons/ri";
import { RiUserFollowLine } from "react-icons/ri";
import "./Friends.css"
import { baseUrl, colors } from '../../constants';
import { RxCross2 } from "react-icons/rx";
import { RiSearchLine } from "react-icons/ri";
import { formatDate, getAmountString, getTime, isYesterday, sameDay, sumDayProgress } from '../Goals/Goals';
import { getPercentage, normalizePercentage, getProgressColor} from '../Stats/Graph';
import { GenericAbortSignal } from 'axios';
import { postLike } from '../../controllers/likes';
import ProfileIcon from '../../components/ProfileIcon/ProfileIcon';
import { Link } from 'react-router-dom';
const offset = 20;
const useUsers = () =>{
    const [users, setUsers] = useState<TUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [index, setIndex] = useState(0);
    const [searchText, setSearchText] = useState<string>();
    useEffect(() =>{
        const controller = new AbortController()
        console.log("index changed")
        fetchUsers(searchText, controller.signal);
        return () => {
            controller.abort()
        }
    },[index, searchText])
    const fetchUsers = async(search?: string, signal?: GenericAbortSignal) =>{
        let query = {
            index, offset, search, signal
        }
        console.log(query)
        setLoading(true)
        getUsers(query).then(res =>{
            console.log("getting more users", index, offset, searchText)
            
                        
            setUsers(users => {
                if(users.length > 20){
                    // console.log("slicing")
                    // return [...(users.slice(10)), ...res]
                }return [...users, ...res]})
            setLoading(false)
        }).catch(err =>{
            console.log(err)
        })
    }
    const search = async(text: string) =>{
        setUsers([])
        setSearchText(text)
        if(index > 0) setIndex(0)
        else {
            //fetchUsers(text, )
        }
    }
    const getMore = () =>{
        console.log("more requested")
        setIndex(index + 1)
    }
    return {users, loading, getMore, search}
}
const useFriends = () =>{
    const [friends, setFriends] = useState<TUser[]>([]);
    const [friendsDays, setFriendsDays] = useState<TDay[]>([]);
    const [incomingFriendRequests,setIncomingFriendRequests] = useState<TUser[]>([]);
    const [outgoingFriendRequests,setOutgoingFriendRequests] = useState<TUser[]>([]);
        useEffect(() =>{
        getFriends().then(result => {
            setFriends(result.friends);
            setIncomingFriendRequests(result.incomingFriendRequests);
            setOutgoingFriendRequests(result.outgoingFriendRequests);
            setFriendsDays(result.friendDays)
    })
    },[])
    return {
        friends,
        incomingFriendRequests,
        outgoingFriendRequests,
        friendsDays
    }

}
function AddFriend({friendId}:{friendId: string}) {
    const sendFriendRequest = async() =>[

    ]
    return (
        <>
            <h1>Add Friend:</h1>

        </>
    )
}
function hasSentFriendRequest(id: string, outgoingFriendRequests: string[]){
    outgoingFriendRequests.includes(id)
}
const UnfollowPop = ({id, name, closePop}: {id:string, name: string, closePop:()=>void}) =>{
    const {updateUser} = useAuth()
    return (
        <>
            <h2>Unfollow {name}?</h2>
            <button className='outline error' onClick={()=> deleteFriend(id).then(res=> {
                updateUser(res);
                closePop();
                })}>unfollow</button>
            <button onClick={closePop} className='gray outline'>cancel</button>
        </>
    )
}
const iconSize= 24;
type TFriendType = "friend" | "requested" | "requesting" | "other";
function getFriendType(user: TUser, friend: TUser) {
    if(user.outgoingFriendRequests.includes(friend._id)) return "requested";
    if(user.incomingFriendRequests.includes(friend._id)) return "requesting";
    if(user.friends.includes(friend._id)) return "friend";
    return "other"
} 
function FriendButton({friend, setPop}: {friend: TUser, setPop: (pop:any) =>void}){
    const user = useUser();
    const {updateUser} = useAuth()
    const type:TFriendType = getFriendType(user, friend);
    const handleClick = () =>{
        if(type === "friend"){
            setPop(<UnfollowPop id={friend._id} name={friend.name} closePop={()=>setPop(undefined)}/>)
            }else if(type === "requested"){
                cancelFriendRequest(friend._id).then(res=>{
                    updateUser(res)
                })
            }else if(type === "requesting"){
                acceptFriendRequest(friend._id)
            }else{
                sendFriendRequest(friend._id).then(res =>
                updateUser(res)
            )
            }
    }
    return (
        <button className='outline gray' onClick={handleClick}>
        {
            type === "requested"? <><p>requested</p> <RxCross2 size={iconSize} color={colors.error} /></>:
            type === "requesting"? <><p>accept</p> <RiUserFollowLine size={iconSize} color={colors.primary}/> </>:
            type ==="friend"? <><p>following</p> <RiUserFollowLine  size={iconSize}color={colors.primary} /></>: 
            <><p>request</p><RiUserAddLine  size={iconSize}  color={colors.primary} /></>
        }
        </button>
    )
}

function SearchUser({setPop}: {setPop: (body: any)=>void}){
    const {users, loading, getMore, search} = useUsers();
    const user = useUser()
    return (
    <> 
        <input type='text' onChange={(e) => search(e.target.value)} placeholder='search' style={{marginTop: 15}}></input>
        <div className='people' onScroll={(e) =>{
            const target = e.target as HTMLDivElement;
            const bottom = Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) < 1
            //console.log("scrolling...", bottom, target.scrollHeight, target.scrollTop, target.clientHeight)
            if(bottom) {
                console.log("BOTTOOM")
                getMore()
            }
        }}>
        {users.map(randomUser =>{
            //console.log("hey user", user)
            if(randomUser._id == user._id) return null
            else return (
                <div key={randomUser._id} onClick={() =>setPop} className='user'>
                    
                    <ProfileIcon profileImg={randomUser.profileImg} name={randomUser.name} _id={randomUser._id}/>
                    <div>
                    <p>{randomUser.name}</p>
                    <FriendButton friend={randomUser} setPop={setPop}/>
                    </div>
                </div>
            )
        })
        }
        {loading && <p>loading...</p>}
        </div>
        </>)
}
function useLazyFriends (){
    const [friends, setFriends] = useState<TLazyFriendsResponse>([]);
    const [index, setIndex] = useState(0)
    useEffect(()=>{
        const controller = new AbortController();
        getLazyFriends(index,controller.signal).then(newFriends =>{
            console.log(newFriends)
            setFriends(prev => {
                if(prev.length > 10){
                    console.log("slicing")
                    return [...newFriends, ...(prev.slice(5))]
                }return [...newFriends, ...prev]
            }
            )
        }).catch(err =>{
            console.log("hello error", err)
            //setFriends([])
        })
        return () =>{
            controller.abort();
        }
    }, [index])
    useEffect(() =>{
        return () => {
            console.log("unmount")
            setFriends([])
        }
    },[])
    const getMore = () => setIndex(i =>i++)
    return {friends, getMore, index}
}
export function sumDoubleDayProgress(goal: TMyGoal){
    let amount = 0;
    for (let i = 0; i < goal.history.length; i++) {
        let element = goal.history[i];
        for (let j = 0; j < element.history.length; j++) {
            amount += element.history[j].progress;
        }
        
    }
    return amount;
}
// export function deleteLike(likes: TLike[], userId: string){
//     let newLikes = [];
//     for (let i = 0; i < likes.length; i++) {
//         if(likes[i].userId !=userId ){
//             newLikes.push(likes[i])
//         }
        
//     }
//     return newLikes
// }
export function Day({day}: {day: TDay}){
    const user = useUser();
    const {unlikeProgress, likeProgress} = useDays();
    const toggleLikeProgress = async(progress: TProgress, isLiked: boolean) =>{
        if(isLiked){
            // unlikeProgress({id: day._id, ...progress}).then(res =>{
            //     console.log("unliked")
                
            //     day.history= day.history.map(pgr =>{
            //         if(pgr.date == progress.date){
            //             let likes: TLike[] = deleteLike(pgr.likes, user._id)
            //             return {...pgr, likes}
            //         }
            //         return pgr
                        
            //     })
            // })
        }else{
            likeProgress({id: day._id, ...progress}).then(res =>{
                console.log("liked");
                 day.history= day.history.map(pgr =>{
                    if(pgr.date == progress.date){
                        let likes: TLike[] = [...pgr.likes, {userId: user._id, username: user.name, profileImg: user.profileImg}];
                        return {...pgr, likes}
                    }
                    return pgr
                        
                })
            })
        }
            
    }
    return (
            <div className='single-day' key={day._id} id={day._id}>
            {
                day.history.length> 0? day.history.map(progress =>{
                    let {date} = progress;
                    console.log("PROGRESS", progress);
                    let dateString = sameDay(date, Date.now())? "Today at "+getTime(date): isYesterday(date)? "Yesterday at "+getTime(date): formatDate(date);
                    let youLiked = Boolean(progress.likes.find(like => like.userId === user._id));
                    return (
                        <div className='progress'>
                            <div className='header'>
                            <p className='date'>{dateString}</p>
                            <p className='progress-added'>+{getAmountString(progress.progress, day.goal.type)}</p>
                            </div>
                            <p>{progress.notes}</p>
                            <div className='footer' >
                            <MdOutlineThumbUpOffAlt size={24} color={youLiked? colors.primary : ""} onClick={() =>toggleLikeProgress(progress,youLiked)} className='button-icon'/>
                            <p>{progress.likes.length>0? progress.likes.length : null}</p>
                            </div>
                        </div>
                    )
                }): <div className='progress'>
                            <div className='header'>
                            <p className='date'>{sameDay(day.date, Date.now())? "Today": isYesterday(day.date)? "Yesterday": new Date(day.date).toLocaleDateString("en-US", {month: "long", day: "numeric"})}</p>
                            </div>
                            <p>no progress...</p>

                        </div>
            }
            </div>
    )
}
export function Goal({ goal }: {goal: TMyGoal}){
    let dayProgress = sumDoubleDayProgress(goal)
    let normalizedPercentage = normalizePercentage(getPercentage(goal.amount, dayProgress));
    return (
        <div className='day' >
            <div className='header'>
                <div className='progress-bar' style={{width: normalizedPercentage+ "%", backgroundColor: getProgressColor(normalizedPercentage)}}></div>
                <div className='title-box'>
                    <p className='title'>{goal.title}</p>
                </div>
            </div>
            <p className='subtitle'> {getAmountString(goal.amount, goal.type)}/{goal.frequency == "daily"?"day" : "week"} </p>
            {
                goal.history.map(day =>{
                    console.log("hello day", day)
                    return <Day day={day}/>
                    
                })
            }
            <div className='footer'><p>Total: {getAmountString(dayProgress, goal.type)}</p></div>
        </div>
    )
}
function Friends() {
    const user = useUser();
    const {updateUser} = useAuth()
    const {goals } = user;
    //const {days, today, addProgress} = useDays();
    const [pop, setPop] = useState<ReactNode>();
    const {friends, getMore, index} = useLazyFriends();
  
    useEffect(()=>{
        //console.log("user changed", user)
    },[user])
    return (
        <div className='page' id='friends' style={{overflow: "hidden"}}>
            {pop && <Pop toggle={() => setPop(undefined)}>{pop}</Pop>}
            <div className='header'>
               <h1>Friends</h1>
                <div className='search'>
                    <RiSearchLine onClick={() => {
                        
                        setPop(<SearchUser setPop={setPop}  />)
                    }} size={30} color={colors.primary} />
                </div>
                
            </div>
            <div className='friends-lazy' >
                {
                    friends.map(friend =>{
                        let goalsString = friend.goalsInfo.map((goal, i) =>  {
                            //console.log("hhhh", goal)
                            let title = goal.title;
                            let firstLetter = title[0].toUpperCase();
                            title = firstLetter + title.substring(1);
                            return i < friend.goals.length -1? title+= ", " : title+= "."
                        });
                        return (
                            <div className='friend' key={friend._id} id={friend._id}>
                                <div className='header'>
                                    <Link to={"/user/" + friend._id}>
                                        <ProfileIcon name={friend.name} profileImg={friend.profileImg} _id={friend._id}/>
                                    </Link>
                                    
                                    <div>
                                    <h3>{friend.name}</h3>
                                    <p><span className='goals'>{goalsString}</span></p>
                                    </div>
                                </div>
                                <div className="days">
                                    {
                                        friend.goalsInfo.map(gl =>{
                                            let goal = friend.goals.find(goal => goal._id === gl._id);
                                            if(!goal) return <Goal goal={{...gl, history: []}} key={gl._id}/>
                                            return (<Goal goal={goal} key={goal._id} />)
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default Friends;
