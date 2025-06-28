import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getFriend } from "../controllers/user.controller.js/getFriend.js"
import { getUsers } from "../controllers/user.controller.js/getUsers.js"
import { sendRequest ,AcceptRequest,getFriendRequest,getSendRequest} from "../controllers/user.controller.js/AllRequests.js"


const userRouter = express.Router();
userRouter.use(protectRoute);

userRouter.get("/",getUsers);
userRouter.get("/friends",getFriend);

userRouter.post("/friend-req/:id",sendRequest);
userRouter.put("/friend-req/:id/accept",AcceptRequest);

userRouter.get("/friend-req",getFriendRequest);
userRouter.get("/send-friend-req",getSendRequest);
export default userRouter;