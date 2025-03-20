import Day from "../models/day.js";
import { ObjectId } from "mongodb";
const updateProgressLikes = async (req, res) => {
    console.log(req.body);
    const { date, id } = req.body;
    const day = await Day.findOneAndUpdate({ _id: new ObjectId(id), "history.date": date }, { $push: { "history.$.likes": { userId: req.user.id, profileImg: req.user.profileImg, username: req.user.name } } }, { new: true });
    console.log(day);
    res.send(day);
};
const deleteProgressLikes = async (req, res) => {
    console.log(req.query);
    let { timestamp, id } = req.query;
    let date = parseInt(timestamp, 10);
    console.log(date);
    const day = await Day.findOneAndUpdate({ _id: new ObjectId(id), "history.date": date }, { $pull: { "history.$.likes": { userId: req.user._id.toString() } } }, { new: true });
    console.log(day);
    res.send(day);
};
export { updateProgressLikes, deleteProgressLikes };
//# sourceMappingURL=likes.js.map