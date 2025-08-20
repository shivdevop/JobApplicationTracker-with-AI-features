import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getResumeInsights = async (resumeText, jobDescription ) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analyze the following resume against the job description and provide insights:
    Resume: ${resumeText}
    Job Description: ${jobDescription}`;

    const result = await model.generateContent(prompt);

    res.status(200).json({
      success: true,
      insights: result.response.text(),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
