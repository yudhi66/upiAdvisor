import mongoose,{Schema} from "mongoose"

const commentSchema=new Schema({ 
     associatedUpi:{
        type:Schema.Types.ObjectId,
        ref:"Upi"
     },owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
     },
      content:{
        type:String,
        required:true,
        minlength: 1,
        maxlength: 500
      }

      



},{timestamps:true})







export const Comment = mongoose.model("Comment", commentSchema);
