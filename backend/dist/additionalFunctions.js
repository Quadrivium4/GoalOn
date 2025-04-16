const userModule = await import("./models/user.js");
const dayModule = await import("./models/day.js");
const {queryDate }= await import("./functions/days.js")
const User = userModule.default;
const Day = dayModule.default;
console.log("logging", queryDate, Day)
let now = new Date(1744504004331);
now.setHours(0,0,0,0)
const query = queryDate(now.getTime());

const users = await Day.find({date:{$gte: now.getTime()}});
console.log(users, query)
//console.log(users);