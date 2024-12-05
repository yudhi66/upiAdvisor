import mongoose,{Schema} from "mongoose"

const upiSchema=new Schema({ 
     baseUpi:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        index:true, 
     },reportedBy:[{
        type:Schema.Types.ObjectId,
        ref:"User"
     }],
     associatedUpi:[{
        type:String,
        trim:true,
     }],count:{
        type:Number,
        default: 0,
     }

      



},{timestamps:true})








export const Upi=mongoose.model("Upi",upiSchema)


