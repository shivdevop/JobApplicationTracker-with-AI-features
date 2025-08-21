// import { v2 as cloudinary } from 'cloudinary';
// import fs from "fs" //importing fs to delete local files after upload
// import dotenv from "dotenv";
// dotenv.config(); // ✅ ensures env vars are available here

// console.log(process.env.CLOUDINARY_API_KEY)
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const uploadOnCloudinary = async (localFilePath) =>{
//     try{
//         if (!localFilePath) return null
//         //upload file to cloudinary
//         const response=await cloudinary.uploader.upload(localFilePath,{
//             resource_type:"auto" //this will automatically detect the kind of file uploaded
//         })
//         console.log("file uploaded on cloudinary", response.url)
        
//         // ✅ Clean up local file after success
//         if (fs.existsSync(localFilePath)) {
//         fs.unlinkSync(localFilePath);
//         }
//         return response
        
//     }catch(error){
//         console.error("Cloudinary Upload Error:", error);

//         if (fs.existsSync(localFilePath)) {
//           fs.unlinkSync(localFilePath);
//         }

//         return null;
//     }
// }

// const deleteFromCloudinary = async (publicId, resourceType) => {
//     return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
// };


// export {uploadOnCloudinary,deleteFromCloudinary}

import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv";
import mime from 'mime-types';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    console.log("Called uploadOnCloudinary with:", localFilePath);
    if (!localFilePath) return null;
    console.log("Local file path received:", localFilePath);
    console.log("File type detected:", mime.lookup(localFilePath)); // should return application/pdf


    // ✅ Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "raw", // ✅ Auto-detects PDFs & serves them properly
      type: "upload",           // ← ensures it's an ordinary public asset
      access_mode: "public"     // ← ensures public delivery (Key setting!)
    });

    console.log("✅ File uploaded on Cloudinary:", response.secure_url);

    // ✅ Delete local file after success
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;  // <-- return the whole response instead of just URL
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);

    // ✅ Delete local file on failure too
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

const deleteFromCloudinary = async (publicId, resourceType) => {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

export { uploadOnCloudinary, deleteFromCloudinary };
