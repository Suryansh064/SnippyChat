# 📘 SnippyChat Backend Revision Guide

This guide breaks down the core components, logic, and structure of the SnippyChat backend project for quick and effective revision.

---

## 📁 Folder Structure Overview

```
.
├── controllers
│   ├── auth.controller.js
│   │   ├── login.js
│   │   ├── logout.js
│   │   ├── signup.js
│   │   └── onboard.js
│   ├── chat.controller.js
│   │   └── chatController.js
│   └── user.controller.js
│       ├── AllRequests.js
│       ├── getFriend.js
│       └── getUsers.js
├── middleware
│   └── auth.middleware.js
├── models
│   ├── FriendRequest.js
│   └── User.js
├── routes
│   ├── auth.route.js
│   ├── chat.route.js
│   └── user.route.js
├── lib
│   ├── db.js
│   └── stream.js
├── server.js
└── .env
```

---

## 🧠 Core Concepts & Logic

### 1. 🔐 Authentication

- **Strategy:** Uses JSON Web Tokens (JWT), stored in an `httpOnly` cookie.
- **Token:** Signed using `JWT_SECRET_KEY` from `.env` and expires in 7 days.
- **Protection:** `protectRoute` middleware verifies the token for protected routes.

---

### 2. 🚀 Signup & Login Flow

**Signup**
- Validates `fullName`, `email`, and `password`.
- Checks if email already exists.
- Assigns a random avatar.
- Hashes password using `bcryptjs`.
- Creates a new `User` in MongoDB.
- Calls `upsertStreamUser()` to sync with Stream Chat.
- Generates JWT and sends it in `httpOnly` cookie.

**Login**
- Validates email and password.
- Compares password using `bcrypt.compare`.
- On success, returns JWT in `httpOnly` cookie.

---

### 3. 📝 Onboarding Process

- After signup, user has `isOnboarded: false`.
- `/api/auth/onBoard` endpoint lets user update:
  - `bio`, `nativeLanguage`, `learningLanguage`, `location`
- After successful onboarding:
  - `isOnboarded` → `true`
  - Stream Chat profile is updated.

---

### 4. 💬 Chat Integration (Stream)

- Uses **Stream Chat API** for real-time messaging.
- `upsertStreamUser` is called during signup and onboarding.
- `/api/chat/token` → returns short-lived client-side Stream token.

---

### 5. 🧑‍🤝‍🧑 Friend System

- Managed via `FriendRequest` model: `sender`, `receiver`, `status` (`pending`, `accepted`, `rejected`)

**Flow:**
1. Send request: `POST /api/user/friend-req/:id`
2. Accept request: `PUT /api/user/friend-req/:id/accept`
3. On acceptance:
   - Both users are added to each other’s `Friends` array
4. Fetch:
   - Incoming, sent, and current friends via dedicated routes

---

## 🛠 Technologies & Tools

| Purpose              | Tech/Tool               |
|----------------------|-------------------------|
| Backend Framework    | Express.js              |
| Database ORM         | Mongoose (MongoDB)      |
| Authentication       | JWT + cookie-parser     |
| Password Hashing     | bcryptjs                |
| Real-time Chat       | Stream Chat API         |
| Environment Variables| dotenv                  |
| CORS Handling        | cors middleware         |

---

## 🧾 Key Endpoints & Routes

### 🔐 Auth Routes (`/api/auth`)

| Method | Endpoint     | Description                              | Middleware     |
|--------|--------------|------------------------------------------|----------------|
| POST   | `/signup`    | Register a new user                      | —              |
| POST   | `/login`     | Log in a user                            | —              |
| POST   | `/logout`    | Clear authentication cookie              | —              |
| POST   | `/onBoard`   | Complete profile details post-signup     | `protectRoute` |
| GET    | `/me`        | Get logged-in user's details             | `protectRoute` |

---

### 👤 User Routes (`/api/user`)

> All routes are protected by `protectRoute`.

| Method | Endpoint                       | Description                                      |
|--------|--------------------------------|--------------------------------------------------|
| GET    | `/`                            | Get recommended users (not self or friends)      |
| GET    | `/friends`                     | Get current user's friends list                  |
| POST   | `/friend-req/:id`              | Send a friend request                            |
| PUT    | `/friend-req/:id/accept`       | Accept a friend request                          |
| GET    | `/friend-req`                  | Get incoming and accepted friend requests        |
| GET    | `/send-friend-req`             | Get sent friend requests (pending)               |

---

### 💬 Chat Routes (`/api/chat`)

> All routes are protected by `protectRoute`.

| Method | Endpoint     | Description                                   |
|--------|--------------|-----------------------------------------------|
| GET    | `/token`     | Generate Stream Chat API client-side token    |

---

## 🛡 Middleware

### `protectRoute` (Located in `middleware/auth.middleware.js`)

**Functionality:**
- Extracts JWT from cookie.
- Verifies it using `JWT_SECRET_KEY`.
- If valid, attaches user (without password) to `req.user`.
- Else, responds with 401 Unauthorized.

---

## 🧩 Models Summary

### User
- Fields: `fullName`, `email`, `password`, `bio`, `profilePic`, `nativeLanguage`, `learningLanguage`, `location`, `isOnBoarded`, `Friends` (array of User ObjectIds)
- Password is manually hashed in controller (not pre-save hook).

### FriendRequest
- Fields: `sender`, `receiver`, `status` (`pending`, `accepted`, `rejected`)
- Used to track friend request state between users.

---

## 🌐 External Services

### Stream Chat API
- **Purpose:** Real-time messaging service.
- **Integration:** Used during signup, onboarding, and token generation.
- **Credentials in `.env`:**
  ```env
  ChitChat_API_KEY=ffcnj7kzv4eq
  ChitChat_API_SECRET=7xpw8euyfumsd6xn4v432sr79wrzhempu5dhm3u9sbmju6gxetvyv8m9fqnkne5m
  ```

---

## 🔒 .env Essentials

```env
PORT=5001
MONGO_URL=mongodb+srv://<user>:<password>@<cluster-url>/ChitChat_db?retryWrites=true&w=majority
ChitChat_API_KEY=ffcnj7kzv4eq
ChitChat_API_SECRET=7xpw8euyfumsd6xn4v432sr79wrzhempu5dhm3u9sbmju6gxetvyv8m9fqnkne5m
JWT_SECRET_KEY=e8f7361d9b64c4fb769b09d6f5c443e7a2d3c1a57d6f94cf7b
NODE_ENV=production
```

 Full Backend Code (Grouped by Modules)
server.js
JavaScript

import express from "express";
import "dotenv/config";
import { ConnectDb } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "https://snippychat-ohv0.onrender.com",
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    ConnectDb();
});
lib/db.js
JavaScript

import mongoose from "mongoose";

export const ConnectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongo Db Connected");
        // console.log(`Mongo Db Connected : ${connect.connection.host}`);
    } catch (error) {
        console.log("MongoDB Not Connected ", error);
        process.exit(1);
    }
}
lib/stream.js
JavaScript

import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.ChitChat_API_KEY;
const apiSecret = process.env.ChitChat_API_SECRET;

if (!apiKey || !apiSecret) {
    console.log("Stream Api key Or Secret is Missing");
}
const StreamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        await StreamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.log("Error upSerting User");
    }
}

export const generateStreamToken = (userId) => {
    try {
        const Id = userId.toString();
        return StreamClient.createToken(Id);
    } catch (error) {
        console.log("Error in Generating Token", error);
    }
}
middleware/auth.middleware.js
JavaScript

import jwt from "jsonwebtoken";
import User from "../Models/User.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - token error" });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await User.findById(decode.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User Not Found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in ProtectRoute", error);
        return res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
    }
};
models/User.js
JavaScript

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    bio: {
        type: String,
        default: "",
    },
    profilePic: {
        type: String,
        default: "",
    },
    nativeLanguage: {
        type: String,
        default: "",
    },
    learningLanguage: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        default: "",
    },
    isOnBoarded: {
        type: Boolean,
        default: false,
    },
    Friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
models/FriendRequest.js
JavaScript

import mongoose from "mongoose";

const FriendRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    },
}, { timestamps: true });

const FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema);

export default FriendRequest;
routes/auth.route.js
JavaScript

import express from "express";
import Login from "../controllers/auth.controller.js/login.js";
import { Logout } from "../controllers/auth.controller.js/logout.js";
import { signup } from "../controllers/auth.controller.js/signup.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { board } from "../controllers/auth.controller.js/onboard.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", Login);
authRouter.post("/logout", Logout);

authRouter.post("/onBoard", protectRoute, board);

authRouter.get("/me", protectRoute, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

export default authRouter;
routes/user.route.js
JavaScript

import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getFriend } from "../controllers/user.controller.js/getFriend.js";
import { getUsers } from "../controllers/user.controller.js/getUsers.js";
import { sendRequest, AcceptRequest, getFriendRequest, getSendRequest } from "../controllers/user.controller.js/AllRequests.js";

const userRouter = express.Router();
userRouter.use(protectRoute);

userRouter.get("/", getUsers);
userRouter.get("/friends", getFriend);

userRouter.post("/friend-req/:id", sendRequest);
userRouter.put("/friend-req/:id/accept", AcceptRequest);

userRouter.get("/friend-req", getFriendRequest);
userRouter.get("/send-friend-req", getSendRequest);

export default userRouter;
routes/chat.route.js
JavaScript

import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controller.js/chatController.js";

const chatRouter = express.Router();

chatRouter.use(protectRoute);
chatRouter.get("/token", getStreamToken);

export default chatRouter;
controllers/auth.controller.js/
signup.js
JavaScript

import User from "../../Models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { upsertStreamUser } from "../../lib/stream.js";

export async function signup(req, res) {
    const { email, password, fullName } = req.body;
    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailReg.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const idx = Math.floor(Math.random() * 100) + 1;
        const avatar = `https://avatar.iran.liara.run/public/${idx}.png`;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            fullName,
            password: hashedPassword,
            profilePic: avatar,
        });
        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || "",
            });
            console.log(`Stream User Created ${newUser.fullName}`);
        } catch (error) {
            console.log("Error in Creating User ", error);
        }
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "none",
            secure: process.env.NODE_ENV === "production",
        });
        const { password: _, ...userData } = newUser._doc;
        res.status(201).json({ success: true, user: userData, token });
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ message: "Error in server signup" });
    }
}
login.js
JavaScript

import User from "../../Models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

async function Login(req, res) {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailReg.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const existUser = await User.findOne({ email });
        if (!existUser) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, existUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: existUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "none",
            secure: process.env.NODE_ENV === "production",
        });
        const { password: _, ...userData } = existUser._doc;
        res.status(200).json({ success: true, user: userData, token });
    } catch (error) {
        console.log("Error in login", error);
        res.status(500).json({ message: "Error in Server Login" });
    }
}
export default Login;
logout.js
JavaScript

export async function Logout(req, res) {
    res.clearCookie("token", { // Note: Changed from "jwt" to "token" to match login/signup
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
}
onboard.js
JavaScript

import { upsertStreamUser } from "../../lib/stream.js";
import User from "../../Models/User.js";

export const board = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;
        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId, {
                ...req.body,
                isOnboarded: true,
            }, { new: true }
        );
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || "",
            });
            console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
        } catch (streamError) {
            console.log("Error updating Stream user during onboarding:", streamError.message);
        }
        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Onboarding error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
controllers/chat.controller.js/
chatController.js
JavaScript

import { generateStreamToken } from "../../lib/stream.js";

export async function getStreamToken(req, res) {
    try {
        const token = generateStreamToken(req.user.id);
        res.status(200).json({ token });
    } catch (error) {
        console.log("Error in getStreamController", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
controllers/user.controller.js/
AllRequests.js
JavaScript

import FriendRequest from "../../Models/FriendRequest.js";
import User from "../../Models/User.js";

export async function AcceptRequest(req, res) {
    try {
        const Id = req.user.id;
        const { id: senderId } = req.params;
        if (!senderId) {
            return res.status(400).json({ message: "Sender ID is required" });
        }
        const friendRequest = await FriendRequest.findById(senderId);
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend Request Not Found" });
        }
        if (friendRequest.receiver.toString() !== Id) {
            return res.status(404).json({ message: "Not Authorized to Accept Request" });
        }
        friendRequest.status = "accepted";
        await friendRequest.save();
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { Friends: friendRequest.receiver },
        });
        await User.findByIdAndUpdate(friendRequest.receiver, {
            $addToSet: { Friends: friendRequest.sender },
        });
        res.status(200).json({ message: "Friend Request Accepted Successfully" });
    } catch (error) {
        console.error("Error in Accepting Friend Request:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export async function sendRequest(req, res) {
    try {
        const Id = req.user.id;
        const { id: receiverId } = req.params;
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (Id === receiverId) {
            return res.status(400).json({ message: "Can't Send Request To Yourself" });
        }
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(400).json({ message: "Receiver Not Found" });
        }
        if (receiver.Friends.includes(Id)) {
            return res.status(400).json({ message: "Already Friend" });
        }
        const existingReq = await FriendRequest.findOne({
            $or: [
                { sender: Id, receiver: receiverId },
                { sender: receiverId, receiver: Id },
            ],
        });
        if (existingReq) {
            return res.status(400).json({ message: "Friend Request Already Exists" });
        }
        const friendRequest = await FriendRequest.create({
            sender: Id,
            receiver: receiverId,
        });
        res.status(200).json(friendRequest);
    } catch (error) {
        console.log("Error in Sending Request", error.message);
        return res.status(400).json({ message: "Internal Server Error" });
    }
}

export async function getFriendRequest(req, res) {
    try {
        const incomingRequest = await FriendRequest.find({
            receiver: req.user.id,
            status: "pending",
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");
        const acceptedRequest = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted",
        }).populate("receiver", "fullName profilePic");
        res.status(200).json({
            incoming: incomingRequest,
            accepted: acceptedRequest,
        });
    } catch (error) {
        console.log("Error in Get Friend Request Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getSendRequest(req, res) {
    try {
        const outGoingRequest = await FriendRequest.find({
            sender: req.user.id,
            status: "pending",
        }).populate("receiver", "fullName profilePic nativeLanguage learningLanguage");
        res.status(200).json(outGoingRequest);
    } catch (error) {
        console.log("Error in Get OutGoing Friend Request Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
getFriend.js
JavaScript

import User from "../../Models/User.js";

export async function getFriend(req, res) {
    try {
        const user = await User.findById(req.user.id).select("Friends").
        populate("Friends", "fullName  profilePic nativeLanguage learningLanguage");
        res.status(200).json(user.Friends);
    } catch (error) {
        console.log("Error in Get Friends Controller ", error.message);
        res.status(400).json({ message: "Internal Error" });
    }
}
getUsers.js
JavaScript

import User from "../../Models/User.js";

export async function getUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;
        const friendsArray = Array.isArray(currentUser.Friends) ?
            currentUser.Friends :
            [];
        const recommendUser = await User.find({
            $and: [
                { _id: { $ne: currentUserId } },
                { _id: { $nin: friendsArray } },
            ]
        });
        res.status(200).json(recommendUser);
    } catch (error) {
        console.log("Error in Recommended Users Controller", error.message);
        res.status(400).json({ message: "Internal Error" });
    }
}