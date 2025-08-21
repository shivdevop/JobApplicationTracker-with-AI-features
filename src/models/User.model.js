import mongoose,{Schema} from "mongoose"

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})

export const User=mongoose.model("User",userSchema)