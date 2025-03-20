import Day from "../models/day.js";
import Goal, { TGoal } from "../models/goal.js"
import User from "../models/user.js";
import { ObjectId } from "mongodb";

const postGoal = async(req, res) =>{
    let {goalForm, date} = req.body;
    //const goal = await Goal.create(goalForm);
    let objectId = new ObjectId();
    const goal: TGoal = {
        _id: objectId,
        ...goalForm
    }
    const user = await User.findByIdAndUpdate(req.user.id, {
        $push: {goals: goal}
    })
    // let latestDay = await Day.findOne({userId: user.id}, null, {sort: {date: -1}})
    // if(!latestDay) {
    //     latestDay = await Day.create({goal: goalForm, date: date });
    // }
    // else if(latestDay.date < date) {
    //     latestDay = await Day.create({goal: goalForm, date: date });
    // }else {
    //     latestDay = await Day.create({goal: goalForm, date: date });
    // }
    let day = await Day.create({goal: goal, date: date, userId: user.id});
    return res.send(day)
}
const putGoal = async(req, res) =>{
    
}
export {
    postGoal
}