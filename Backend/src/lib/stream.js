import {StreamChat} from "stream-chat"
import "dotenv/config"

const apiKey = process.env.ChitChat_API_KEY;
const apiSecret = process.env.ChitChat_API_SECRET ;


if(!apiKey || !apiSecret){
    console.log("Stream Api key Or Secret is Missing");
}
const StreamClient = StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser = async (userData) =>{
    try {
        await StreamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.log("Error upSerTing User");
    }
}

export const generateStreamToken = (userId) =>{
    try {
        const Id = userId.toString();
        return StreamClient.createToken(Id);
    } catch (error) {
        console.log("Error in Generating Token",error);
    }
}