import User from "../Models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { upsertStreamUser } from "../lib/stream.js";
export async function signup(req, res) {
    const { email, password, fullName } = req.body;

    try {
        // Validation
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

        // Check if user already exists
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Avatar
        const idx = Math.floor(Math.random() * 100) + 1;
        const avatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        // 🔐 Manually hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            email,
            fullName,
            password: hashedPassword,
            profilePic: avatar,
        });
        
        try {
            await upsertStreamUser({
                id:newUser._id.toString(),
                name : newUser.fullName,
                image : newUser.profilePic ||"",
            })
            console.log(`Stream User Created ${newUser.fullName}`)
        } catch (error) {
            console.log("Error in Creating User ",error);
        }


        // Generate JWT
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });

        // Set JWT cookie
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        const { password: _, ...userData } = newUser._doc;

        res.status(201).json({ success: true, user: userData,token });
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ message: "Error in server signup" });
    }
}