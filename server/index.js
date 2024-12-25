 import dotenv from "dotenv"
import { app } from "./app.js"
import dbConnection from "./src/db/index.js"


 


 dotenv.config({
    path: './.env'
 })
 dbConnection().then(()=>{
    app.listen(process.env.PORT || 8000 ,()=>{

        console.log(`server running on port:${process.env.PORT}`)
    })
 }).catch((error)=>{
    console.log(`MONGODB connection failed`,error);
 })