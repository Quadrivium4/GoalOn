import { dataform } from "googleapis/build/src/apis/dataform/index.js";
import Day, { THistoryEvent } from "../models/day.js";
import { dayInMilliseconds, isOldDay } from "../utils.js";
import { TUser } from "../models/user.js";
import { ProtectedReq, Response } from "../routes.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const updateProgressLikes = async(req: ProtectedReq, res: Response) =>{
    console.log(req.body)
    const {date, id} = req.body;
    const day = await Day.findOneAndUpdate({_id: new ObjectId(id), "history.date": date}, {$push: {"history.$.likes": {userId: req.user.id, profileImg: req.user.profileImg, username: req.user.name}}},{new: true});
    console.log(day)
    res.send(day)
}
const deleteProgressLikes = async(req: ProtectedReq, res: Response) =>{
    console.log(req.query)
    let {timestamp, id} = req.query;
    let date = parseInt(timestamp as string, 10)
    console.log(date)
    const day = await Day.findOneAndUpdate({_id: new ObjectId(id as string), "history.date": date}, {$pull: {"history.$.likes": {userId: req.user._id.toString()}}},{new: true});
    console.log(day)
    res.send(day)
}
export {
    updateProgressLikes,
    deleteProgressLikes
}