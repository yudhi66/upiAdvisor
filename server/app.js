import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { errorMiddleware } from "./src/middlewares/error.middleware.js"
import userRouter from "./src/routes/user.routes.js" 

import upiRouter from "./src/routes/upi.routes.js"


const app=express()

app.use(cors({
     origin:process.env.CORS_ORIGIN,
     credentials:true
}))


app.use(express.json({
    limit:"25kb"
}))




app.use(express.urlencoded({extended:true,limit:"16kb"}))

app.use(cookieParser())


 
app.use("/api/v1/users",userRouter)


app.use("/api/v1/upi",upiRouter)






app.use(errorMiddleware);

export {app}
