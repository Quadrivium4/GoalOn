import sendMail from "../utils/sendMail.js";
import User from "../models/user.js";
import { createUnverifiedUser, createUser, verifyUser, findUser, deleteUser, logoutUser } from "../functions/user.js";
import { deleteFile, saveFile } from "../utils/files.js";
const register = async (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;
    const user = await createUnverifiedUser(name, email, password);
    const link = `${process.env.CLIENT_URL}/verify/${user.id}/${user.token}`;
    console.log({ link });
    await sendMail({
        to: user.email,
        subject: "Confirm your email",
        body: `<h1>Confirmation email: </h1>
                <a href="${link}">verify</a>`
    });
    res.send(user);
};
const googleLogin = async (req, res) => {
    res.render("googleLogin", {});
};
// const signInWithGoogle = async (req, res) => {
//     console.log("logging with google...")
//     const token = extractBearerToken(req);
//     if (!token) throw new AppError(1, 403, "Invalid Token");
//     const { user, aToken } = await createOrLoginUserFromGoogle(token);
//     console.log({user, aToken})
//     res.send({user, aToken});
// }
const verify = async (req, res) => {
    console.log(req.body);
    const { id, token } = req.body;
    const { name, email, password } = await verifyUser(id, token);
    console.log({ name, email, password });
    const { user, aToken } = await createUser(name, email, password);
    console.log({ user, aToken });
    res.send({ user, aToken });
};
const login = async (req, res) => {
    const { email, password } = req.body;
    const { user, aToken } = await findUser(email, password);
    res.send({ user, aToken });
};
const profileImgUpload = async (req, res) => {
    console.log(req.files);
    const fileId = await saveFile(req.files.image);
    if (req.user.profileImg)
        deleteFile(req.user.profileImg);
    const user = await User.findByIdAndUpdate(req.user.id, {
        profileImg: fileId
    }, { new: true });
    console.log("profile image updated", { user });
    res.send(fileId);
};
const getUser = async (req, res) => {
    const { id } = req.query;
    console.log("getting user", { id });
    if (!id)
        return res.send(req.user);
    const user = await User.findById(id);
    return res.send({
        _id: user.id,
        name: user.name,
        email: user.email,
        profileImg: user.profileImg,
        goals: user.goals
    });
};
const getUsers = async (req, res) => {
    let { search, index, offset } = req.query;
    if (!index)
        index = 0;
    if (!offset)
        offset = 20;
    console.log("get users query: ", req.query);
    let filter = {};
    if (search) {
        filter = {
            name: { $regex: "(?i)^" + search }
        };
        console.log(filter);
    }
    const users = await User.find(filter).skip(index * offset).limit(offset);
    return res.send(users);
};
const updateUser = async (req, res) => {
};
// const profileImgUpload = async(req, res) =>{
//     const fileId = await saveFile(req.files.image);
//     if(req.user.profileImg) deleteFile(req.user.profileImg);
//     const user = await User.findByIdAndUpdate(req.user.id,{
//         profileImg: fileId
//     },{new: true})
//     console.log("profile image updated",{ user})
//     res.send(fileId)
// }
const deleteAccount = async (req, res) => {
    const deletedUser = await deleteUser(req.user.id);
    console.log("Deleted User", deletedUser.name);
};
const logout = async (req, res) => {
    console.log("logging out");
    const user = await logoutUser(req.user, req.token);
    res.send({ msg: "Successfully logged out!" });
};
export { register, deleteAccount, deleteUser, getUser, getUsers, login, logout, logoutUser, verify, profileImgUpload };
//# sourceMappingURL=user.js.map