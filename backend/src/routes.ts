import express, {Request, Response as ExpressResponse} from "express"
import { tryCatch } from "./utils.js";
import { getUser, getUsers, login, logout, profileImgUpload, register, verify } from "./controllers/user.js";
import verifyToken from "./middlewares/verifyToken.js";
import { postGoal } from "./controllers/goals.js";
import { deleteProgress, getDays, getStats, postProgress, updateProgress } from "./controllers/days.js";
import {acceptFriendRequest, cancelFriendRequest, deleteFriend, getFriends, getLazyFriends, sendFriendRequest } from "./controllers/friends.js"
import { TUser } from "./models/user.js";
import { deleteProgressLikes, updateProgressLikes } from "./controllers/likes.js";
import { downloadFile } from "./utils/files.js";

export type ProtectedReq = Request & {user: TUser};
export type Response = ExpressResponse;
const publicRouter = express.Router();
const protectedRouter = express.Router();

publicRouter.post("/register", tryCatch(register));
publicRouter.post("/login", tryCatch(login));
publicRouter.post("/verify", tryCatch(verify));

protectedRouter.use(tryCatch(verifyToken))
protectedRouter
    .get("/user", tryCatch(getUser))
    .get("/users", tryCatch(getUsers))
    .get("/logout", tryCatch(logout))
protectedRouter
    .post("/goals", tryCatch(postGoal))
protectedRouter
    .post("/progress", tryCatch(postProgress))
    .put("/progress", tryCatch(updateProgress))
    .delete("/progress", tryCatch(deleteProgress))
protectedRouter.get("/days", tryCatch(getDays))
protectedRouter.get("/stats/:userId?", tryCatch(getStats))

protectedRouter
    .post("/likes", tryCatch(updateProgressLikes))
    .delete("/likes", tryCatch(deleteProgressLikes))


protectedRouter.get("/lazy-friends", tryCatch(getLazyFriends))
protectedRouter.get("/friend/:id?", tryCatch(getFriends))
protectedRouter.post("/send-friend-request/:id", tryCatch(sendFriendRequest))
protectedRouter.post("/accept-friend-request/:id", tryCatch(acceptFriendRequest))

protectedRouter.delete("/cancel-friend-request/:id", tryCatch(cancelFriendRequest))
protectedRouter.delete("/delete-friend/:id", tryCatch(deleteFriend))

protectedRouter.route("/user/upload-profile-image")
    .post(tryCatch(profileImgUpload))

publicRouter.get("/file/:id", tryCatch(downloadFile))


export {publicRouter, protectedRouter}