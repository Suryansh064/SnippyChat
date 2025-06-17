import express from "express";
import { Login } from "../controllers/login.js";
import { Logout } from "../controllers/logout.js";
import { signup } from "../controllers/signup.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { board } from "../controllers/onboard.js";
const router = express.Router();

router.post("/signup",signup)
router.post("/login",Login)
router.post("/logout",Logout)

router.post("/onBoard",protectRoute, board);


router.get("/me" ,protectRoute ,(req,res)=>{
    res.status(200).json({success :true , user:req.user});
})

export default router;