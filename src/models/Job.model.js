import mongoose,{Schema}  from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"


const JobSchema=new Schema({
    title: {
      type: String,
      required: [true, "Job title is required"],
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
    },
    description: {
      type: String,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    salary:{
        type:Number,
        required:[true,"Salary is required"]
    },
    jobType:{
        type:String,
        required:[true,"Job type is required"]
    },
    status: {
      type: String,
      enum: ["applied", "interview", "offer", "rejected"],
      default: "applied",
    },
    resumePath: {
      type: String, // will store cloud url 
      required:true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
},{timestamps:true})

JobSchema.plugin(mongooseAggregatePaginate)

export const Job=mongoose.model("Job",JobSchema)