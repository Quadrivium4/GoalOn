import { useEffect, useState } from 'react';
import { RiSearchLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import ProfileIcon from '../../components/ProfileIcon/ProfileIcon';
import { colors } from '../../constants';
import { useAuth, useUser } from '../../context/AuthContext';
import { TMyGoal } from '../../context/DaysContext';
import { usePop } from '../../context/PopContext';
import { getLazyFriends, TLazyFriendsResponse } from '../../controllers/friends';
import "./Friends.css";
import SearchUser from './SearchUser/SearchUser';
import UserDays from './UserDays/UserDays';

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

function Friends() {
    const user = useUser();
    const {updateUser} = useAuth()
    const {goals } = user;
    //const {days, today, addProgress} = useDays();
    const {setPop}= usePop()
    const {friends, getMore, index} = useLazyFriends();
  
    useEffect(()=>{
        //console.log("user changed", user)
    },[user])
    return (
        <div className='page' id='friends' style={{overflow: "hidden"}}>
            <div className='header'>
               <h1>Friends</h1>
                <div className='search'>
                    <RiSearchLine onClick={() =>setPop(<SearchUser />)} size={30} color={colors.primary} />
                </div>
                
            </div>
            <div className='friends-lazy' >
                {
                    friends.length > 0? friends.map(friend =>{
                        let goalsString = friend.goalsInfo.map((goal, i) =>  {
                            //console.log("hhhh", goal)
                            let title = goal.title;
                            let firstLetter = title[0].toUpperCase();
                            title = firstLetter + title.substring(1);
                            return i < friend.goalsInfo.length -1? title+= ", " : title+= "."
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
                                <UserDays days={friend.goals} />
                                {/* <div className="days">
                                    {
                                        friend.goalsInfo.map(gl =>{
                                            let goal = friend.goals.find(goal => goal._id === gl._id);
                                            if(!goal) return <UserDays goal={{...gl, history: []}} key={gl._id}/>
                                            return (<UserDays goal={goal} key={goal._id} />)
                                        })
                                    }
                                </div> */}
                            </div>
                        )
                    }): <>
                    <p style={{marginBottom: 5}}>No friends yet!</p> <button onClick={() =>setPop(<SearchUser />)}>search now</button>
                    </>
                    
                }
            </div>
        </div>
    );
}

export default Friends;
