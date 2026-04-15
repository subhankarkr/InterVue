import express from "express"
import {ENV} from "./lib/env.js"
import path from "path"
import cors from "cors"
import {serve} from "inngest/express"
import {inngest} from "./lib/inngest.js"
import { connectDB } from "./lib/db.js";    
import { functions } from "./lib/inngest.js"
const app =express();
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(ENV.PORT)
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}));
app.use(express.json());

app.use("/api/inngest",serve({client:inngest,functions}));
app.get("/health",(req,res)=>{
    res.status(200).json({msg:"app is up and running"});
});
app.get("/books",(req,res)=>{
    res.status(200).json({msg:"this is books endpoint   "});
});
if(ENV.NODE_ENV == "production"){
    app.use(express.static(path.join(__dirname,"../../frontend/dist")))
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../../frontend","dist","index.html"));
    })
}
 
const startServer = async()=>{
    try{
        await connectDB();
        app.listen(ENV.PORT,()=>{console.log("Server is running on port ",ENV.PORT)});
    }catch(err){
        console.log("Error starting server ",err);
    }
}
startServer();