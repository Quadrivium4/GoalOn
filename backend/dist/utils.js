import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Day from "./models/day.js";
import { ObjectId } from "mongodb";
import { queryDayDate } from "./controllers/goals.js";
export const dayInMilliseconds = 1000 * 60 * 60 * 24;
const validateEmail = (email) => {
    const expression = /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])/i;
    return expression.test(String(email).toLowerCase());
};
const tryCatch = (controller) => async (req, res, next) => {
    try {
        await controller(req, res, next);
    }
    catch (error) {
        console.log("error in try catch");
        return next(error);
    }
};
const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err)
                reject(err);
            resolve(hash);
        });
    });
};
const comparePassword = (password, hashedPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashedPassword, (err, result) => {
            if (err)
                reject(err);
            resolve(result);
        });
    });
};
const createTokens = (id, email) => {
    const aToken = jwt.sign({ email, id }, process.env.JWT_A_TOKEN_KEY);
    const rToken = jwt.sign({ email, id }, process.env.JWT_R_TOKEN_KEY);
    return { aToken, rToken };
};
function extractBearerToken(req) {
    if (!req.headers.authorization)
        return false;
    if (!req.headers.authorization.startsWith("Bearer "))
        return false;
    const token = req.headers.authorization.split(" ")[1];
    return token;
}
function isOldDay(dayDate, date) {
    console.log("is Old day?", { dayDate }, date);
    const date1 = new Date(dayDate);
    const date2 = new Date(date);
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);
    if (date1.getTime() < date2.getTime()) {
        console.log("yes");
        return true;
    }
    console.log("false");
    return false;
}
function eqOid(id1, id2) {
    id1 = new ObjectId(id1);
    id2 = new ObjectId(id2);
    return id1.toString() === id2.toString();
}
async function deleteAllDaysInDate(date) {
    const deleted = await Day.deleteMany(queryDayDate(date));
    console.log({ deleted });
}
export { validateEmail, tryCatch, hashPassword, comparePassword, createTokens, extractBearerToken, isOldDay, eqOid, deleteAllDaysInDate };
//# sourceMappingURL=utils.js.map