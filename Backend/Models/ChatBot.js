import mongoose from "mongoose";
const { Schema } = mongoose;

const chatBotSchema = new Schema({
    headerColor: { type: String, enum: ['white', 'black', '#33475B'], default: "#33475B" },
    backgroundColor: { type: String, enum: ['white', 'black', '#FAFBFC'], default: "#FAFBFC" },
    customMessages: [{ type: String, required: true }],
    welcomeMessage: { type: String, required: true },
    missedChatTimer: { type: String, match: /^\d{2}:\d{2}:\d{2}$/, default: "01:00:00" },
});

export default mongoose.model("ChatBot", chatBotSchema);