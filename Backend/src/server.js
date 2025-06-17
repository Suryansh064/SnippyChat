import express from "express";
import "dotenv/config";
import { ConnectDb } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser"
import userRoutes from "./routes/user.route.js"
import chatRoutes from "./routes/chat.route.js"
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes); 
app.use("/api/auth", userRoutes); 
app.use("/api/auth", chatRoutes); 

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    ConnectDb();
});
