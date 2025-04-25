const userModule = await import("./models/user.js");
const dayModule = await import("./models/day.js");
const {queryDate }= await import("./functions/days.js")
const {ObjectId} = await import("mongodb")
//console.log(ObjectId)
const User = userModule.default;
const Day = dayModule.default;
console.log("logging", queryDate, Day)
let now = new Date();
now.setHours(0,0,0,0)
now.setDate(now.getDate() )
const query = queryDate(now.getTime());

const users = await Day.find({ $and: [query, { "goal._id": new ObjectId("66fd896cd4a0ba5788613473")}]});
console.log(users, query)
console.log("dsjs", users)
//console.log(susers);