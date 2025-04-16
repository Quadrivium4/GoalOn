import { queryDate } from "../functions/days.js";
import Day from "../models/day.js";
import User from "../models/user.js";
import { ObjectId } from "mongodb";
import { eqOid } from "../utils.js";
import AppError from "../utils/appError.js";
const postGoal = async (req, res) => {
    let { goalForm, date } = req.body;
    //const goal = await Goal.create(goalForm);
    let objectId = new ObjectId();
    const goal = {
        _id: objectId,
        ...goalForm
    };
    const user = await User.findByIdAndUpdate(req.user.id, {
        $push: { goals: goal }
    });
    // let latestDay = await Day.findOne({userId: user.id}, null, {sort: {date: -1}})
    // if(!latestDay) {
    //     latestDay = await Day.create({goal: goalForm, date: date });
    // }
    // else if(latestDay.date < date) {
    //     latestDay = await Day.create({goal: goalForm, date: date });
    // }else {
    //     latestDay = await Day.create({goal: goalForm, date: date });
    // }
    let day = await Day.create({ goal: goal, date: date, userId: user.id });
    return res.send(day);
};
export const queryDayDate = (date) => {
    date = new Date(date);
    date.setHours(0, 0, 0, 0);
    return queryDate(date.getTime());
};
const putGoal = async (req, res) => {
    const { title, amount, frequency, _id, date } = req.body;
    console.log(req.body, queryDate(date));
    let newGoal;
    const newGoals = req.user.goals.map(goal => {
        if (eqOid(goal._id, _id)) {
            newGoal = { ...goal, title, amount, frequency };
            return newGoal;
        }
        return goal;
    });
    const newUser = await User.findByIdAndUpdate(req.user.id, { goals: newGoals }, { new: true });
    if (!newGoal)
        throw new AppError(1, 401, "invalid id");
    // Change Today with new Goal
    let day = await Day.findOneAndUpdate({ $and: [{ userId: req.user.id }, queryDayDate(date)] }, { goal: newGoal }, { new: true });
    console.log("day updated", day);
    if (!day) {
        console.log("creating new day");
        day = await Day.create({ goal: newGoal, date: date, userId: req.user.id });
    }
    res.send(day);
};
const completeGoal = async (req, res) => {
};
const deleteGoal = async (req, res) => {
    const { id } = req.query;
    await Day.deleteMany({ "goal._id": new ObjectId(id) });
    let newGoals = req.user.goals.filter(goal => !eqOid(goal._id, id));
    let user = await User.findByIdAndUpdate(req.user.id, { goals: newGoals }, { new: true });
    res.send(user);
};
export { postGoal, putGoal, deleteGoal };
//# sourceMappingURL=goals.js.map