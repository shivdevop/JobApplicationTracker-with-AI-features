import dotenv from "dotenv"
import { connectDB } from "./db/connection.js"
import {app} from "./app.js"

dotenv.config({
    path:"./.env"
})

connectDB().then(()=>{
    app.listen(process.env.port,()=>{
        console.log(`Server is running on port ${process.env.port}`)
    })
}).catch((err)=>{
    console.log("mongodb connection faled",err)
})
