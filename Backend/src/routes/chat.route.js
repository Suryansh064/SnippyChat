import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controller.js/chatController.js";
const chatRouter = express.Router();


chatRouter.use(protectRoute);

chatRouter.get("/token",getStreamToken)

export default chatRouter;