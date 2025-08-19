import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import jwt from "jsonwebtoken"
import { User } from "../models/User.model.js"

export const verifyUser=asyncHandler(async(req,res,next)=>{
    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"unauthorized request")
        }
    
        //if token present, we will verify it !!!
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        if(!decodedToken){
            throw new ApiError(401,"invalid access token")
        }
    
        const user=await User.findById(decodedToken.userId).select("-password")
        if(!user){
            throw new ApiError(401,"user not found")
        }
    
        req.user=user
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid access token")
    }



})