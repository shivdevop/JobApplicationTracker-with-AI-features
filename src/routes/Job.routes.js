import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { createJob, deleteJob, getAllJobs, getJobById,resumeEvaluation, updateJob } from "../controllers/Job.controller.js";
import {upload} from "../middlewares/multer.middleware.js";


const router=Router()

router.route("/createJob").post(upload.single("resume"),verifyUser,createJob)
router.route("/getJobs").get(verifyUser,getAllJobs)
router.route("/getJob/:jobid").get(verifyUser,getJobById)
router.route("/updateJob/:jobid").patch(upload.single("resume"),verifyUser,updateJob)
router.route("/deleteJob/:jobid").delete(verifyUser,deleteJob)
router.route("/getResumeInsights/:jobId").get(verifyUser,resumeEvaluation)

export default router