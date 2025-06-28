import express from "express";
import Login from "../controllers/auth.controller.js/login.js"
import { Logout } from "../controllers/auth.controller.js/logout.js"
import { signup } from "../controllers/auth.controller.js/signup.js"
import { protectRoute } from "../middleware/auth.middleware.js";
import { board } from "../controllers/auth.controller.js/onboard.js"
const authRouter = express.Router();

authRouter.post("/signup",signup)
authRouter.post("/login",Login)
authRouter.post("/logout",Logout)

authRouter.post("/onBoard",protectRoute, board);


authRouter.get("/me" ,protectRoute ,(req,res)=>{
    res.status(200).json({success :true , user:req.user});
})

export default authRouter;