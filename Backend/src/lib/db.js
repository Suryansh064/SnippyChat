import mongoose from "mongoose";

export const ConnectDb = async () =>{

    try {
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongo Db Connected")
        // console.log(`Mongo Db Connected : ${connect.connection.host}`);
    } catch (error) {
        console.log("MongoDB Not Connected ",error);
        process.exit(1) 

    }
}