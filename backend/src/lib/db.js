import monngoose from "mongoose";
import {ENV} from "./env.js";

export const connectDB = async()=>{
    try{
      const conn=  await monngoose.connect(ENV.DB_URL);
        console.log("MongoDB connected successfully ",conn.connection.host);    
    }catch(err){
        console.log("Error connecting to MongoDB ",err);
        process.exit(1);
    }
}