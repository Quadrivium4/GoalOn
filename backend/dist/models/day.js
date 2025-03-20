import mongoose from "mongoose";
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
const Day = mongoose.model("Day", DaySchema);
export default Day;
//# sourceMappingURL=day.js.map