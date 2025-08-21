import express from "express"
import cors from "cors"
import { errorHandler } from "./utils/ErrorHandler.js"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser";

const app=express()
app.use(cors(
    {
         origin:process.env.CORS_ORIGIN
         
    }
))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))


app.use(express.static("public"))
//what this does is, it will allow us to access the static files in public folder 

app.use(cookieParser())

//routes
import userRouter from "./routes/User.routes.js"
import jobRouter from "./routes/Job.routes.js"



app.use("/api/v1/users",userRouter)
app.use("/api/v1/jobs",jobRouter)

app.use(errorHandler)
export {app}
