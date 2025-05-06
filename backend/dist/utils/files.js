function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _ts_generator(thisArg, body) {
    var f, y, t, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
import dotenv from "dotenv";
dotenv.config();
import { DB } from "../db.js";
import AppError from "./appError.js";
import { Readable } from "stream";
import { ObjectId } from "mongodb";
var saveFile = function(file) {
    return _async_to_generator(function() {
        var stream, result;
        return _ts_generator(this, function(_state) {
            stream = Readable.from(file.data);
            result = stream.pipe(DB.files.openUploadStream(file.name));
            console.log(result.id);
            return [
                2,
                result.id
            ];
        });
    })();
};
var saveFiles = function(files) {
    return _async_to_generator(function() {
        var promises, fileIds;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    promises = files.map(function(file) {
                        return saveFile(file);
                    });
                    return [
                        4,
                        Promise.all(promises)
                    ];
                case 1:
                    fileIds = _state.sent();
                    return [
                        2,
                        fileIds
                    ];
            }
        });
    })();
};
var getFile = function(id) {
    return _async_to_generator(function() {
        var cursor, values;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (id) cursor = DB.files.find({
                        _id: new ObjectId(id)
                    });
                    else {
                        cursor = DB.files.find({});
                    }
                    return [
                        4,
                        cursor.toArray()
                    ];
                case 1:
                    values = _state.sent();
                    return [
                        2,
                        values
                    ];
            }
        });
    })();
};
var downloadFile = function(req, res) {
    return _async_to_generator(function() {
        var id, stream;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    id = req.params.id;
                    if (!ObjectId.isValid(id)) throw new AppError(1, 400, "invalid id: " + id);
                    return [
                        4,
                        DB.files.openDownloadStream(new ObjectId(id))
                    ];
                case 1:
                    stream = _state.sent();
                    stream.on("error", function(err) {
                        return res.send({
                            err: err.message
                        });
                    });
                    return [
                        2,
                        stream.pipe(res)
                    ];
            }
        });
    })();
};
var deleteFile = function(id) {
    return _async_to_generator(function() {
        var stream, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!id) throw new AppError(1, 400, "invalid id");
                    if (!ObjectId.isValid(id)) throw new AppError(1, 400, "invalid id");
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        3,
                        ,
                        4
                    ]);
                    return [
                        4,
                        DB.files.delete(new ObjectId(id))
                    ];
                case 2:
                    stream = _state.sent();
                    return [
                        3,
                        4
                    ];
                case 3:
                    err = _state.sent();
                    console.log({
                        err: err
                    });
                    return [
                        3,
                        4
                    ];
                case 4:
                    console.log(stream);
                    return [
                        2,
                        stream
                    ];
            }
        });
    })();
};
export { saveFiles, getFile, downloadFile, deleteFile, saveFile };
