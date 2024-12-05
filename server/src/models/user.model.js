import mongoose,{Schema} from "mongoose"
import { ApiError } from "../utils/ApiError.js";
const userSchema=new Schema({ 
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true, 
      },
      email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
      },
      password:{
        type:String,
        required:[true,'Password is required']
      },refreshToken:{
          type:String
      }

      



},{timestamps:true})



userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      next(new ApiError( 400,"Provide unique username or email"))
    } else {
      next();
    }
  });
  




export const User=mongoose.model("User",userSchema)


