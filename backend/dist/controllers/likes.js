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
import Day from "../models/day.js";
import { ObjectId } from "mongodb";
import { addNotification } from "../functions/friends.js";
var updateProgressLikes = function(req, res) {
    return _async_to_generator(function() {
        var _req_body, date, id, day;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    console.log(req.body);
                    _req_body = req.body, date = _req_body.date, id = _req_body.id;
                    return [
                        4,
                        Day.findOneAndUpdate({
                            _id: new ObjectId(id),
                            "history.date": date
                        }, {
                            $push: {
                                "history.$.likes": {
                                    userId: req.user.id,
                                    profileImg: req.user.profileImg,
                                    username: req.user.name
                                }
                            }
                        }, {
                            new: true
                        })
                    ];
                case 1:
                    day = _state.sent();
                    addNotification(day.userId, {
                        type: "like",
                        from: {
                            userId: req.user.id,
                            name: req.user.name
                        },
                        status: "unread",
                        date: Date.now(),
                        content: req.user.name + " liked your activity"
                    });
                    console.log(day);
                    res.send(day);
                    return [
                        2
                    ];
            }
        });
    })();
};
var deleteProgressLikes = function(req, res) {
    return _async_to_generator(function() {
        var _req_query, timestamp, id, date, day;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    console.log(req.query);
                    _req_query = req.query, timestamp = _req_query.timestamp, id = _req_query.id;
                    date = parseInt(timestamp, 10);
                    console.log(date);
                    return [
                        4,
                        Day.findOneAndUpdate({
                            _id: new ObjectId(id),
                            "history.date": date
                        }, {
                            $pull: {
                                "history.$.likes": {
                                    userId: req.user._id.toString()
                                }
                            }
                        }, {
                            new: true
                        })
                    ];
                case 1:
                    day = _state.sent();
                    console.log(day);
                    res.send(day);
                    return [
                        2
                    ];
            }
        });
    })();
};
export { updateProgressLikes, deleteProgressLikes };
