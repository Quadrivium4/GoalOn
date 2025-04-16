import mongoose from "mongoose";
import { TGoal } from "./user.js";

export type THistoryEvent = {
    progress: number,
    date: number,
    notes: string,
    likes: []
}
export type TDay = {
    userId: string,
    date: number,
    goal: TGoal,
    progress: number,
    history: THistoryEvent[],
    status: "completed" | "in progress" | "unfinished"
}
const DaySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        trim: true,
        required: true
    },
    goal: {
        type: Object,
        trim: true,
        required: true
    },
    progress: {
        type: Number,
        trim: true,
        default: 0
    },
    history: {
        type: Array, 
        default: []
    },
    status: {
        type: String
    }
});

const Day = mongoose.model<TDay>("Day", DaySchema);
export default Day