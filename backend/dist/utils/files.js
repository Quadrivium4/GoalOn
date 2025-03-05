import dotenv from "dotenv";
dotenv.config();
import { DB } from "../db.js";
import AppError from "./appError.js";
import { Readable } from "stream";
import { ObjectId } from "mongodb";
const saveFile = async (file) => {
    let stream = Readable.from(file.data);
    let result = stream.pipe(DB.files.openUploadStream(file.name));
    console.log(result.id);
    return result.id;
};
const saveFiles = async (files) => {
    const promises = files.map(file => saveFile(file));
    const fileIds = await Promise.all(promises);
    return fileIds;
};
const getFile = async (id) => {
    let cursor;
    if (id)
        cursor = DB.files.find({ _id: new ObjectId(id) });
    else {
        cursor = DB.files.find({});
    }
    const values = await cursor.toArray();
    return values;
};
const downloadFile = async (req, res) => {
    let id = req.params.id;
    if (!ObjectId.isValid(id))
        throw new AppError(1, 400, "invalid id: " + id);
    let stream = await DB.files.openDownloadStream(new ObjectId(id));
    stream.on("error", (err) => {
        return res.send({ err: err.message });
    });
    return stream.pipe(res);
};
const deleteFile = async (id) => {
    if (!id)
        throw new AppError(1, 400, "invalid id");
    if (!ObjectId.isValid(id))
        throw new AppError(1, 400, "invalid id");
    let stream;
    try {
        stream = await DB.files.delete(new ObjectId(id));
    }
    catch (err) {
        console.log({ err });
        //throw new AppError(1, 404, err.message)
    }
    console.log(stream);
    return stream;
};
export { saveFiles, getFile, downloadFile, deleteFile, saveFile };
//# sourceMappingURL=files.js.map