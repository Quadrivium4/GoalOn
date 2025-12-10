import { MdOutlineThumbUpOffAlt } from "react-icons/md";
import { colors } from "../../../constants";
import { useUser } from "../../../context/AuthContext";
import { useDays, TMyGoal } from "../../../context/DaysContext";
import { TDay, TProgress, TLike } from "../../../controllers/days";
import { sameDay, getTime, isYesterday, formatDate, getAmountString } from "../../Goals/Goals";
import { normalizePercentage, getPercentage, getProgressColor } from "../../Stats/Graph";
import { sumDoubleDayProgress } from "../Friends";
import styles from "./UserDays.module.css"
import { TGoal } from "../../../controllers/goals";
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
            <div className={styles['single-day']} key={day._id} id={day._id}>
            {
                day.history.length> 0? day.history.map(progress =>{
                    let {date} = progress;
                    console.log("PROGRESS", progress);
                    let dateString = sameDay(date, Date.now())? "Today at "+getTime(date): isYesterday(date)? "Yesterday at "+getTime(date): formatDate(date);
                    let youLiked = Boolean(progress.likes.find(like => like.userId === user._id));
                    return (
                        <div className={styles.progress}>
                            <div className={styles.header}>
                            <p className={styles.date}>{dateString}</p>
                            <p className={styles["progress-added"]}>+{getAmountString(progress.progress, day.goal.type)}</p>
                            </div>
                            <p>{progress.notes}</p>
                            <div className={styles.footer} >
                            <MdOutlineThumbUpOffAlt size={24} color={youLiked? colors.primary : ""} onClick={() =>toggleLikeProgress(progress,youLiked)} className={styles['button-icon']}/>
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
export default function UserDays({ days, goals }: {days: TMyGoal[], goals: TGoal[]}){
    
    return (
        <div className={styles.days}>
        {goals.map(info =>{
            let goal: TMyGoal | undefined = days.find(day => day._id == info._id);
            if(!goal) goal = {
                ...info,
                history: []
            }
            let dayProgress = sumDoubleDayProgress(goal)
            let normalizedPercentage = normalizePercentage(getPercentage(goal.amount, dayProgress));
            return (
                <div className={styles.day} >
                    <div className={styles.header}>
                        <div className={styles['progress-bar']} style={{width: normalizedPercentage+ "%", backgroundColor: getProgressColor(normalizedPercentage)}}></div>
                        <div className={styles['title-box']}>
                            <p className={styles.title}>{goal.title}</p>
                        </div>
                    </div>
                    <p className={styles.subtitle}> {getAmountString(goal.amount, goal.type)}/{goal.frequency == "daily"?"day" : "week"} </p>
                    {
                        goal.history.map(day =><Day day={day}/>)
                    }
                    <div className={styles.footer}><p>Total: {getAmountString(dayProgress, goal.type)}</p></div>
                </div>
            )
        })}
         </div>
    )
}