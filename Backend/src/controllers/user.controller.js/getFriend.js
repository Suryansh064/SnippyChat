import User from "../../Models/User.js";
export async function getFriend(req,res) {
    try {
        const user = await User.findById(req.user.id).select("Friends").
        populate("Friends","fullName  profilePic nativeLanguage learningLanguage");
        res.status(200).json(user.Friends);
    } catch (error) {
        console.log("Error in  Get Friends Controller ",error.message);
        res.status(400).json({message:"Internal Error"});
    }
}