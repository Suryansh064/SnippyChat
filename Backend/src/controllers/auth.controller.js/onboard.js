import { upsertStreamUser } from "../../lib/stream.js";
import User from "../../Models/User.js";

export  const board = async (req,res)=>{
    try {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
    return res.status(400).json({
        message: "All fields are required",
        missingFields: [
        !fullName && "fullName",
        !bio && "bio",
        !nativeLanguage && "nativeLanguage",
        !learningLanguage && "learningLanguage",
        !location && "location",
        ].filter(Boolean),
    });
}

    const updatedUser = await User.findByIdAndUpdate(
        userId,
    {
        ...req.body,
        isOnboarded: true,
    },
    { new: true }
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