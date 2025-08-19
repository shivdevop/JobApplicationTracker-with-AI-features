import mongoose,{Schema}  from "mongoose";

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