import express from "express";
import "dotenv/config";
import { ConnectDb } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser"
import userRoutes from "./routes/user.route.js"
import chatRoutes from "./routes/chat.route.js"
import ragRoutes from "./routes/rag.route.js";
import cors from 'cors'
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    // origin: "http://localhost:5173",
    origin: "https://snippychat-ohv0.onrender.com",
    credentials: true
}));

app.use("/api/auth", authRoutes); 
app.use("/api/user", userRoutes); 
app.use("/api/chat", chatRoutes); 
app.use("/api/rag", ragRoutes);
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    ConnectDb();
});
