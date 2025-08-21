import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../models/User.model.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { userRegisterSchema } from "../validators/user.validation.js"



export const registerUser=asyncHandler(async(req,res)=>{
    const {username,email,password}=req.body 

     const parsed=userRegisterSchema.safeParse(
        {username,email,password}
    )

    if (!parsed.success){
        throw new ApiError(400,parsed.error.issues[0].message)
    } 

    const existing=await User.findOne({$or:[{username},{email}]})
    if (existing){
        throw new ApiError(400,"user already exists")
    }

    const hashedPassword=await bcrypt.hash(password,10)
    const user=await User.create({
        username,
        email,
        password:hashedPassword
    })

    if(!user){
        throw new ApiError(500,"user not created ")
    }

    return res.status(201).json(
        new ApiResponse(201,user,"user created successfully")
    )
})


export const loginUser=asyncHandler(async(req,res)=>{
    const {username,password}=req.body
    if (!username || !password){
        throw new ApiError(400,"username or password is required")
    }
    const user=await User.findOne({username})
    if(!user){
        throw new ApiError(400,"user not found")
    }

    const isPasswordValid=await bcrypt.compare(password,user.password)
    
    if(!isPasswordValid){
        throw new ApiError(400,"invalid password")
    }

    const accessToken=jwt.sign({userId:user._id},process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })

    const options={
        httpOnly:true,
        secure:true,
    }

    return res.status(200).cookie("accessToken",accessToken,options).json(
        new ApiResponse(200,user,"user logged in successfully")
    )

})

//logout user 
export const logoutUser=asyncHandler(async(req,res)=>{
    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200).clearCookie("accessToken",options).json(
        new ApiResponse(200, null,"user logged out successfully" )
    )
})