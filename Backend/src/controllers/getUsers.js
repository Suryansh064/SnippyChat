import User from "../Models/User.js";
export async function getUsers(req,res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;
        const recommendUser = await User.find({
            $and:[
                {_id:{$ne:currentUserId}}, //exclude Current USer 
                {$id:{$nin:currentUser.friends}},
                {isOnboarded :true},
            ]
        })
        res.status(200).json(recommendUser);

    } catch (error) {
        console.log("Error in Recommended Users Controller ",error.message);
        res.status(400).json({message:"Internal Error"});

    }
}