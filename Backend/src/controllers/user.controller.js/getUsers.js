import User from "../../Models/User.js";

export async function getUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const friendsArray = Array.isArray(currentUser.Friends || currentUser.friends)
            ? currentUser.Friends || currentUser.friends
        : [];

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
