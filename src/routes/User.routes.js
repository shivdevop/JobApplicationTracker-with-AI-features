import {Router} from "express"
import { verifyUser } from "../middlewares/auth.middleware.js"
import { loginUser, logoutUser, registerUser } from "../controllers/User.controller.js"

const router=Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyUser,logoutUser)

export default router