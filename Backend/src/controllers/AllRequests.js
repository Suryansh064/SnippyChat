import FriendRequest from "../Models/FriendRequest.js";
import User from "../Models/User.js";

export async function AcceptRequest(req, res) {
    try {
        const Id = req.user.id; 
        const { id: senderId } = req.params; 

        // Validate sender ID
        if (!senderId) {
            return res.status(400).json({ message: "Sender ID is required" });
        }

        const friendRequest = await FriendRequest.findById(senderId);

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend Request Not Found" });
        }
        
        if(friendRequest.receiver.toString() !==Id){
            return res.status(404).json({ message: "Not Authorized to Accept Request" });
        }
        friendRequest.status = "accepted";
        await friendRequest.save();


        // Add Each User To Friends Array
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { Friends: friendRequest.receiver},

            // addtoSet adds elements to an Array only if they do not Already Exists
        });

        // Add receiver to sender's friends list
        await User.findByIdAndUpdate(friendRequest.receiver, {
            $addToSet: { Friends: friendRequest.sender },
        });

        res.status(200).json({ message: "Friend Request Accepted Successfully" });
    }
    catch (error) {
        console.error("Error in Accepting Friend Request:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
export async function sendRequest(req,res) {
    try {
        const  Id = req.user.id;
        const {id : receiverId} = req.params;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if(Id === receiverId) {
            return res.status(400).json({message:"Can't Send Request To Yourself"});
        }


        const receiver = await User.findById(receiverId);
        if(!receiver){
            return res.status(400).json({message:"Receiver Not Found"});
        }
        // If Already Friends
        if(receiver.Friends.includes(Id)){
            return  res.status(400).json({message:"Already Friend"});
        }
        // If u have already sended the request
        const existingReq = await FriendRequest.findOne({
            $or :[
                {sender :Id , receiver:receiverId},
                {sender :receiverId, receiver:Id},
            ],
        })
        if(existingReq){
            return res.status(400).json({message:"Friend Request Already Exists"});
        }

        const friendRequest = await FriendRequest.create({
            sender:Id,
            receiver:receiverId,
        })
        res.status(200).json(friendRequest)
    } catch (error) {
        console.log("Error in Sending Request",error.message);
        return res.status(400).json({message :"Internal Server Error"});
    }
}
export async function getFriendRequest(req,res){
    try {
        const incomingRequest = FriendRequest.find({
            receiver :req.user.id,
            status:"pending",
        }).populate("sender","fullName profilePic nativeLanguage learningLanguage");

        const AcceptedRequest = FriendRequest.find({
            sender :req.user.id,
            status:"accepted",
        }).populate("receiver","fullName profilePic");

        res.status(200).json(incomingRequest,AcceptedRequest);

    } catch (error) {
        console.log("Error in Get Friend Request Controller");
        res.status(500).json({message :"Internal Server Error"});
    }
}

export async function getSendRequest(req,res){
    try {
        const outGoingRequest = FriendRequest.find({
            sender :req.user.id,
            status:"pending",
        }).populate("sender","fullName profilePic nativeLanguage learningLanguage");
        res.status(200).json(outGoingRequest);

    } catch (error) {
        console.log("Error in Get  OutGoing Friend Request Controller");
        res.status(500).json({message :"Internal Server Error"});
    }
}


