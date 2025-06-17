import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getFriend } from "../controllers/getfriend.js";
import { getUsers } from "../controllers/getUsers.js";
import { sendRequest ,AcceptRequest,getFriendRequest,getSendRequest} from "../controllers/AllRequests.js";


const router = express.Router();
router.use(protectRoute);

router.get("/",getUsers);
router.get("/friends",getFriend);

router.post("/friend-req/:id",sendRequest);
router.put("/friend-req/:id/accept",AcceptRequest);

router.get("/friend-req",getFriendRequest);
router.get("/send-friend-req",getSendRequest);
export default router;