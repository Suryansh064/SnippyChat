import User from "../Models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function Login(req, res) {
    const { email, password } = req.body;

    try {
        // Input validation
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

        // Check user existence
        const existUser = await User.findOne({ email });
        if (!existUser) {
            return res.status(400).json({ message: "User does not exist" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, existUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = jwt.sign({ userId: existUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });

        // Set cookie
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        const { password: _, ...userData } = existUser._doc;

        res.status(200).json({ success: true, user: userData,token });

    } catch (error) {
        console.log("Error in login", error);
        res.status(500).json({ message: "Error in Server Login" });
    }
}
