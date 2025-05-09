import { RxCross2 } from "react-icons/rx";
import { ProfileIconLink } from "../../../components/ProfileIcon/ProfileIcon";
import Select from "../../../components/Select/Select";
import { TUser, useAuth, useUser } from "../../../context/AuthContext";
import { usePop } from "../../../context/PopContext";
import { RiUserAddLine, RiUserFollowLine } from "react-icons/ri";
import { acceptFriendRequest, cancelFriendRequest, deleteFriend, getFriends, getUsers, sendFriendRequest, unfollow } from "../../../controllers/friends";
import { useEffect, useState } from "react";
import { GenericAbortSignal } from "axios";
import { colors } from "../../../constants";
import { TDay } from "../../../controllers/days";
import styles from "./SearchUser.module.css"
import { wait } from "@testing-library/user-event/dist/utils";
import { useMessage } from "../../../context/MessageContext";
const offset = 20;
export type TFilter = "followers" | "following" | "none" | "";
const useUsers = () =>{
    const [users, setUsers] = useState<TUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [index, setIndex] = useState(0);
    const [searchText, setSearchText] = useState<string>();
    const [filter, setFilter] = useState<TFilter>()
    useEffect(() =>{

        const controller = new AbortController()
        console.log("index changed")
        fetchUsers(searchText, controller.signal);
        return () => {
            controller.abort()
        }
    },[index, searchText, filter])
    const fetchUsers = async(search?: string, signal?: GenericAbortSignal) =>{
        let query = {
            index, offset, search, filter, signal
        }
        console.log(query)
        setLoading(true)
        await wait(1000)
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
    const addFilter = (type: TFilter) =>{
        setUsers([]);
        if(index > 0) setIndex(0)
        setFilter(type)
    }
    return {users, loading, getMore, search,addFilter }
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
            <button className='outline error' onClick={()=> unfollow(id).then(res=> {
                updateUser(res);
                closePop();
                })}>unfollow</button>
            <button onClick={closePop} className='gray outline'>cancel</button>
        </>
    )
}
const iconSize= 24;
type TFriendType = "follower" | "following" | "requested" | "requesting" | "other";

function getFriendType(user: TUser, friend: TUser) {
    if(user.outgoingFriendRequests.includes(friend._id)) return "requested";
    if(user.incomingFriendRequests.includes(friend._id)) return "requesting";
    if(user.following.includes(friend._id)) return "following";
    if(user.followers.includes(friend._id)) return "follower";
  
    return "other"
} 

export function FriendButton({friend}: {friend: TUser}){
    const user = useUser();
    const {setPop} = usePop();
    const {updateUser} = useAuth()
    const {message} = useMessage()
    const type:TFriendType = getFriendType(user, friend);
    console.log("friend type", {type})
    const handleClick = () =>{
        if(type === "following"){
            setPop(<UnfollowPop id={friend._id} name={friend.name} closePop={()=>setPop(undefined)}/>)
        }else if(type === "requested"){
            cancelFriendRequest(friend._id).then(res=>{
                updateUser(res)
            }).catch(err=>{
                message.error(err.message)
            })
        }else if(type === "requesting"){
            acceptFriendRequest(friend._id).catch(err=>{
                message.error(err.message)
            })
        }else if(type === "follower"){
             sendFriendRequest(friend._id).then(res =>
                updateUser(res)
            ).catch(err=>{
                message.error(err.message)
            })
        }else
            {
            sendFriendRequest(friend._id).then(res =>
                updateUser(res)
            ).catch(err=>{
                message.error(err.message)
            })
        }
    }
    return (
        <button className='outline gray' onClick={handleClick}>
        {
            type === "requested"? <><p>requested</p> <RxCross2 size={iconSize} color={colors.error} /></>:
            type === "requesting"? <><p>accept</p> <RiUserFollowLine size={iconSize} color={colors.primary}/> </>:
            type ==="follower"? <><p>follow back</p><RiUserAddLine  size={iconSize}  color={colors.primary} /></>: 
             type ==="following"? <><p>following</p> <RiUserFollowLine  size={iconSize}color={colors.primary} /></>: 
            <><p>request</p><RiUserAddLine  size={iconSize}  color={colors.primary} /></>
        }
        </button>
    )
}

export default function SearchUser(){
    const {users, loading, getMore, search, addFilter} = useUsers();
    const {setPop} = usePop()
    const user = useUser()
    return (
    <> 
        <input type='text' onChange={(e) => search(e.target.value)} placeholder='search' style={{marginTop: 15, marginBottom: 5}}></input>
        <Select options={["following", "followers", "none"]} onSelect={addFilter} placeholder='filter' />
        <div className={styles.people} onScroll={(e) =>{
            const target = e.target as HTMLDivElement;
            const bottom = Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) < 1
            //console.log("scrolling...", bottom, target.scrollHeight, target.scrollTop, target.clientHeight)
            if(bottom) {
                console.log("BOTTOOM")
                getMore()
            }
        }}>
        {loading? <p>loading...</p> 
        :users.length > 0? users.map(randomUser =>{
            //console.log("hey user", user)
            //if(randomUser._id == user._id) return null
            return (
                <div key={randomUser._id} onClick={() =>setPop} className={styles.user}>
                    
                    <ProfileIconLink profileImg={randomUser.profileImg} name={randomUser.name} _id={randomUser._id}/>
                    <div>
                    <p>{randomUser.name}</p>
                    <FriendButton friend={randomUser} />
                    </div>
                </div>
            )
        }):<p>No users matched your search</p>
        }
        
        </div>
        </>)
}