import { dataform } from "googleapis/build/src/apis/dataform/index.js";
import Day, { TDay, THistoryEvent } from "../models/day.js";
import { dayInMilliseconds, isOldDay } from "../utils.js";
import User, { TUser } from "../models/user.js";
import { ProtectedReq, Response } from "../routes.js";
import mongoose, { isValidObjectId } from "mongoose";
import { ObjectId } from "mongodb";

let week = dayInMilliseconds *7;
export const getLastSunday = (date: number | Date) =>{
  date = new Date(date);
  date.setDate(date.getDate() - date.getDay());
  return date;
}
export const getLastMonday = (date: number | Date) =>{
  date = new Date(date);
  date.setDate(date.getDate() - date.getDay() + 1);
  return date;
}
export const aggregateDays = (date: number, userId: string | ObjectId) =>[
  {
    $match:
      /**
       * query: The query in MQL.
       */
      {
        userId: userId.toString(),
        $or: [
          {
            $and: [
              {
                date: {
                  $gte: date
                }
              },{
                date: {
                  $lte: date+dayInMilliseconds
                }
          }]
          },
          {
            $and: [
              {
                "goal.frequency": {
                  $eq: "weekly",
                },
              },
              {
                date: {
                  $gte: getLastMonday(date).getTime(),
                },
              },
            ],
          },
        ],
      },
  },
  {
    $group:
      /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */
      {
        _id: "$goal._id",
        title: {$first: "$goal.title"},
        amount: {$first: "$goal.amount"},
        frequency: {$first: "$goal.frequency"},
        type: {$first: "$goal.type"},
        history: {
          $push: {
            _id: "$_id",
            history: "$history",
            date: "$date",
            goal: "$goal",
          },
        },
      },
  },
]
const getDays = async(req: ProtectedReq, res) =>{
    let timestamp: number;
    if(typeof req.query.timestamp == 'string' ) timestamp = parseInt(req.query.timestamp, 10);
    console.log({timestamp}, req.query)
    const date = new Date(timestamp);
    date.setHours(0,0,0,0);
    
    //const days = await Day.find({userId: req.user.id, $or: [{date: {$gte: date.getTime()}}, {$and: [{"goal.frequency":{$eq: "weekly"} }, {date: {$gte: date.getTime() - week}}]}]});
    const days = await Day.aggregate(aggregateDays(date.getTime(), req.user.id));
    console.log("found days: ", days.length, {days}, {goals: req.user.goals})

    if(days.length <req.user.goals.length){
      req.user.goals.map(goal =>{
        let alreadyExists = days.find(day => day._id.toString() === goal._id.toString());
        if(!alreadyExists) days.push({...goal, history: []})
      })
    }
    return res.send(days)
}
const getStats = async(req: ProtectedReq, res: Response) =>{
    let {userId} = req.params;
    console.log(req.params)
    let user: TUser;
    if(userId) {
      console.log({userId})
      user = await User.findById(userId);
      console.log("hello", {user})
    } else {
      userId = req.user.id;
      user = req.user;
    }

    const promises = [];
    user.goals.map(goal =>{
        console.log(goal.id)
        let promise = async() => {
          let days = await Day.find({userId, "goal._id": new ObjectId(goal._id)}).sort({date: 1})
          return {...goal, days}
        }
        promises.push(promise());
    })
    const result = await Promise.all(promises);
    return res.send(result)
}
const postProgress = async(req: ProtectedReq, res: Response) =>{
    console.log(req.body)
    const {date, goalId, progress, notes} = req.body;
    let progressDate = new Date(date);
    progressDate.setHours(0,0,0,0)
    let day = await Day.findOne({$and: [{"goal._id":  new ObjectId(goalId)}, queryDate(progressDate.getTime())] });
    if(!day ){
        console.log("old day");
        let historyEvent: THistoryEvent = {date, progress,notes, likes: []};
        let goal = req.user.goals.find(goal => goalId === goal._id.toString())
        console.log({goal})
        day = await Day.create({goal, date, progress, userId: req.user._id, history: [historyEvent]})
        return res.send(day)
    }
    let totalProgress = day.progress + progress;
    let historyEvent: THistoryEvent = {date, progress,notes, likes: []}
    day = await Day.findByIdAndUpdate(day.id, {
        progress: totalProgress,
        $push: {history: historyEvent}
    },{new: true})
    console.log({day, totalProgress})
    return res.send(day)
}
const queryDate = (date:number) =>{
  let date1 = new Date(date);
  let date2 = new Date(date1);
  date2.setDate(date1.getDate() + 1);
  return {
    $and: [{date: {$gte: date1.getTime()}}, {date: {$lt: date2.getTime()}}]
  }
}
const updateProgress = async(req: ProtectedReq, res: Response) =>{
    console.log(req.body)
    const {date, id, progress, notes, newDate} = req.body;
    let oldDay = await Day.findById(id);
    let newDateObj = new Date(newDate);
    let dateObj = new Date(oldDay.date);
    dateObj.setHours(0,0,0,0);
    newDateObj.setHours(0,0,0,0);
    let day: TDay;
    if(newDateObj.getTime() == dateObj.getTime())
      day = await Day.findOneAndUpdate({_id: new ObjectId(id), "history.date": date}, {$set: {"history.$.progress": progress, "history.$.notes": notes, "history.$.date": newDate}},{new: true});
    else{
      let historyEvent: THistoryEvent = {date: newDate, progress,notes, likes: []};
      // Remove old progress from day
      await Day.findOneAndUpdate({_id: new ObjectId(id), "history.date": date}, {$pull: {history: {date}}},{new: true});

      // Add progress to the new day if exists
      console.log(queryDate(newDateObj.getTime()), oldDay.goal)
      day= await Day.findOneAndUpdate({$and: [queryDate(newDateObj.getTime()), {userId: req.user.id, "goal._id": new ObjectId(oldDay.goal._id)}]}, {$push: {history: historyEvent}},{new: true} )
      console.log("updated day", day)
      // Create another day if it doesn't 
      if(!day) day = await Day.create({goal: oldDay.goal, date: newDateObj.getTime(), progress: 0, userId: req.user.id, history: [historyEvent]})
    }
    console.log(day)
    res.send(day)
}
const deleteProgress = async(req: ProtectedReq, res: Response) =>{
    console.log(req.query)
    let {date, id} = req.query;
    let dateNumber = parseInt(date as string, 10);
    const day = await Day.findOneAndUpdate({_id: new ObjectId(id as string)}, {$pull: {history: {date: dateNumber}}},{new: true});
    console.log(day)
    res.send(day)
}
export {
    getDays,
    postProgress,
    getStats,
    updateProgress,
    deleteProgress
}