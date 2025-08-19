import express from "express"
import cors from "cors"
import { errorHandler } from "./utils/ErrorHandler.js"
import cookieParser from "cookie-parser"

const app=express()
app.use(cors(
    {
        origin:process.env.CORS_ORIGIN
    }
))

app.use(express.json({
    limit:"16kb"
}))
app.use(express.urlencoded({ extended: true }))

app.use(express.static("public"))
//what this does is, it will allow us to access the static files in public folder 

app.use(cookieParser())

//routes

app.use(errorHandler)
export {app}
