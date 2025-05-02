import express from "express";
import authMiddleware from '../Middleware/authMiddleware.js';
import authorize from '../Middleware/authorize.js';
import { getChatBot, updateChatBot, createChatBot } from "../Controllers/chatBotController.js";

const chatBotRouter = express.Router();

chatBotRouter.get("/design", getChatBot);
chatBotRouter.put("/design", authMiddleware, authorize('captain-admin', 'admin'), updateChatBot);
chatBotRouter.post("/design", authMiddleware, authorize('captain-admin', 'admin'), createChatBot);

export default chatBotRouter;