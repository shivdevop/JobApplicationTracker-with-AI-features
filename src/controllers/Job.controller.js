import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Job from "../models/Job.model.js";
import { getResumeInsights } from "../services/ai.service.js";
import { extractResumeText } from "../utils/extractResumeText.js";



//create job
export const createJob=asyncHandler(async(req,res)=>{
       const { title, company, description, location, salary, jobType, status } = req.body;
       const userid=req.user._id
       if(!userid){
        throw new ApiError(400,"user not found")
       }

    // ✅ Validation
    if (!title || !company || !location || !salary || !jobType) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // ✅ Check if resume exists
    if (!req.file) {
      return res.status(400).json({ message: "Resume is required" });
    }

    const resumeUpload=await uploadOnCloudinary(req.file.path)
    if(!resumeUpload){
        throw new ApiError(500,"resume upload failed")
    }
    const newJob=await Job.create({
        title,
        company,
        description,
        location,
        salary,
        jobType,
        status,
        resumePath:resumeUpload.url,
        createdBy:userid

    })

    if(!newJob){
        throw new ApiError(500,"job creation failed")
    }

    return res.status(201).json(
        new ApiResponse(201,newJob,"new job tracker added successfully")
    )
})


//get all jobs 
export const getAllJobs=asyncHandler(async(req,res)=>{
    const userid=req.user._id 
    if (!user){
        throw new ApiError(400,"user not found")
    }

    const {status,jobType,search,page=1,limit=10}=req.query
    //create match filter 
    const match={createdBy:userid}
    if(status) match.status=status
    if (jobType) match.jobType=jobType
    if (search) match.title={$regex:search,$options:"i"}  //case insensitive search

    //create aggregate pipeline
    const aggregateQuery= await Job.aggregate([
        {$match:match},
        {$sort:{
            createdAt:-1
        }}
    ])

    //use pagination
    const options={
        page:Number(page),
        limit:Number(limit)

    }

    const jobs=await Job.aggregatePaginate(aggregateQuery,options)
    if (!jobs){
        throw new ApiError(400,"jobs not found")
    }

    return res.status(200).json(
        new ApiResponse(200,
            {
                jobs:jobs.docs,
                totaljobs:jobs.totalDocs,
                totalPages:jobs.totalPages,
                currentPage:jobs.page
            },
            "jobs fetched successfully"
        )
    )
})


//get job by id 
export const getJobById=asyncHandler(async(req,res)=>{
    const user=req.user._id
    if(!user){
        throw new ApiError(400,"USER NOT FOUND")
    }

    const {jobid}=req.params
    const job=await Job.findById(jobid)
    if(!job){
        throw new ApiError(400,"job not found")
    }
    if (job.createdBy.toString()!==user.toString()){
        throw new ApiError(400,"you are not authorized to access this job")
    }

    return res.status(200).json(
        new ApiResponse(200,job,"job fetched successfully")
    )
})




//update job 
export const updateJob=asyncHandler(asyncHandler(async(req,res)=>{
    const userid=req.user._id
    if(!userid){
        throw new ApiError(400,"user not found")
    }
    const {jobid}=req.params
    const job=await Job.findById(jobid)
    if(!job){
        throw new ApiError(400,"job not found")
    }
    if (job.createdBy.toString()!==userid.toString()){
        throw new ApiError(400,"you are not authorized to update this job")
    }

    const { title, company, description, location, salary, jobType, status } = req.body;
    if(title) job.title=title
    if(company) job.company=company
    if(description) job.description=description
    if(location) job.location=location
    if(salary) job.salary=salary
    if(jobType) job.jobType=jobType
    if(status) job.status=status

    if(req.file){

        //delete old file
        // Extract public_id from existing resume URL
        const oldResumeUrl = job.resumePath;
        const oldPublicId = oldResumeUrl.split("/").pop().split(".")[0];
        const deleteExistingResume=await deleteFromCloudinary(oldPublicId, "auto");
        if(!deleteExistingResume){
            throw new ApiError(500,"old resume deletion failed")
        }

        const resumeupload=await uploadOnCloudinary(req.file.path)
        if(!resumeupload){
            throw new ApiError(500,"resume upload failed")
        }
        job.resumePath=resumeupload.url

    }

    const updatedJob=await job.save()
    if(!updatedJob){
        throw new ApiError(500,"job update failed")
    }

    return res.status(200).json(
        new ApiResponse(200,updatedJob,"job updated successfully")
    )
}))


//delete job 
export const deleteJob=asyncHandler(async(req,res)=>{
    const userid=req.user._id
    if(!userid){
        throw new ApiError(400,"user not found")
    }

    const {jobid}=req.params
    const job=await Job.findById(jobid).lean()
    if(!job){
        throw new ApiError(400,"job not found")
    }

    if (job.createdBy.toString()!==userid.toString()){
        throw new ApiError(400,"you are not authorized to delete this job")
    }

    //delete resume from cloudinary
    if(job.resumePath){
      try {
          const oldResumeUrl = job.resumePath;
          const oldPublicId = oldResumeUrl.split("/").pop().split(".")[0];
          await deleteFromCloudinary(oldPublicId, "auto");
          console.log(`✅ Resume deleted from Cloudinary: ${oldPublicId}`);
      } catch (error) {
        console.log(`❌ Error deleting resume from Cloudinary: ${error.message}`);
      }
    }
  

    const deleteJob=await Job.findByIdAndDelete(jobid)
    if(!deleteJob){
        throw new ApiError(500,"job deletion failed")
    }

    return res.status(200).json(
        new ApiResponse(200,deleteJob,"job deleted successfully")
    )

})


export const getResumeInsights = asyncHandler(async (req, res) => {
  const {jobId} = req.params;

  if (!jobId) throw new ApiError(400, "jobId is required");

  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, "Job not found");

  if (job.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized for this job");
  }

  if (!job.resumePath) {
    throw new ApiError(400, "No resume uploaded for this job");
  }

  // Use provided JD override or the job's own description
  const jd = job.description || "";
  if (!jd.trim()) throw new ApiError(400, "Job description is required");

  // 1) Extract resume text from Cloudinary URL
  const resumeText = await extractResumeText(job.resumePath);

  if (!resumeText || !resumeText.trim()) {  
    throw new ApiError(400, "Failed to extract text from resume");
  }


  // 2) Generate AI insights
  const insights = await getResumeInsights(resumeText,jd)

  // 3) (Optional) Save to DB if fields exist
//   const update = {};
//   if (typeof insights.match_score === "number") update.matchScore = insights.match_score;
//   update.aiInsights = insights;

//   try {
//     await Job.findByIdAndUpdate(jobId, update, { new: true });
//   } catch {
//     // Non-blocking: even if save fails, still return insights
//   }

  return res
    .status(200)
    .json(new ApiResponse(200, insights, "Resume insights generated"));
});
