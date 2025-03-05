import mongoose from "mongoose";
const GoalSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    type: {
        type: String,
        trim: true,
        required: true
    },
    frequency: {
        type: String,
        trim: true,
    },
    description: {
        type: String
    },
    amount: {
        type: Number
    }
});
const Goal = mongoose.model("Goal", GoalSchema);
export default Goal;
//# sourceMappingURL=goal.js.map