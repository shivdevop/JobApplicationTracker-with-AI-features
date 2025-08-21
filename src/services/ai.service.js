// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";
// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const getResumeInsights = async (resumeText, jobDescription) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//     const prompt = `Analyze the following resume against the job description and provide detailed insights in JSON format:
//     Resume: ${resumeText}
//     Job Description: ${jobDescription}
    
//     Return a JSON object with these fields:
//     - match_score (number between 0-100)
//     - strengths (list of top strengths relevant to job)
//     - weaknesses (list of missing skills or gaps)
//     - suggestions (how to improve resume for this role)`;

//     const result = await model.generateContent(prompt);
//     const responseText = result.response.text();

//     // Parse Gemini's JSON safely
//     try {
//       return JSON.parse(responseText);
//     } catch (e) {
//       // Fallback: return raw text if parsing fails
//       return { raw: responseText };
//     }
//   } catch (err) {
//     console.error("Gemini API Error:", err);
//     throw new Error("Failed to generate AI insights");
//   }
// };


import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getResumeInsights = async (resumeText, jobDescription) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an AI resume evaluator. Analyze the following resume against the job description.
Provide a **clean JSON response** with the following structure:

{
  "match_score": number, // 0-100
  "overall_summary": string, // short summary of the match
  "skills_analysis": {
    "matching_skills": [string],    // skills present in both resume & JD
    "missing_skills": [string],     // important skills missing in resume
    "recommended_skills": [string]  // extra skills that would boost the profile
  },
  "experience_analysis": {
    "relevant_experience": string,  // summary of relevant experience
    "gaps": [string]                // gaps related to experience if any
  },
  "education_analysis": {
    "meets_requirement": boolean,
    "comments": string
  },
  "suggestions": [string] // practical suggestions to improve resume & chances of selection
}

Make sure to return ONLY valid JSON. Do not include any extra text.

Resume: """${resumeText}"""
Job Description: """${jobDescription}"""
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    try {
      return JSON.parse(responseText);
    } catch (e) {
      console.error("AI returned non-JSON response:", responseText);
      return {
        error: true,
        message: "AI response was not in valid JSON format.",
        raw: responseText,
      };
    }
  } catch (err) {
    console.error("Gemini API Error:", err);
    throw new Error("Failed to generate AI insights");
  }
};

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";

// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const getResumeInsights = async (resumeText, jobDescription) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//     const prompt = `
//     You are an AI assistant that analyzes resumes against job descriptions.
//     Analyze the following resume and job description, then return a well-structured JSON response.
//     Be accurate, concise, and strictly return JSON — no extra text.

//     Resume:
//     """
//     ${resumeText}
//     """

//     Job Description:
//     """
//     ${jobDescription}
//     """

//     JSON Structure:
//     {
//       "match_score": number (0-100),
//       "summary": "A concise 2-3 line overview of candidate fit.",
//       "strengths": ["List of key strengths relevant to the job"],
//       "weaknesses": ["List of missing skills or gaps"],
//       "recommendations": ["Specific actionable tips to improve resume for this job"],
//       "matched_keywords": ["List of keywords from JD found in resume"],
//       "missing_keywords": ["List of important keywords missing from resume"]
//     }

//     IMPORTANT:
//     - Respond ONLY with a valid JSON object.
//     - Do not add explanations or markdown.
//     `;

//     const result = await model.generateContent(prompt);
//     const responseText = result.response.text().trim();

//     try {
//       return JSON.parse(responseText);
//     } catch (error) {
//       console.error("⚠️ JSON Parsing Failed. Raw Gemini Response:", responseText);
//       return {
//         match_score: 0,
//         summary: "Could not analyze resume properly.",
//         strengths: [],
//         weaknesses: [],
//         recommendations: [],
//         matched_keywords: [],
//         missing_keywords: [],
//         raw_response: responseText,
//       };
//     }
//   } catch (err) {
//     console.error("Gemini API Error:", err);
//     throw new Error("Failed to generate AI insights");
//   }
// };
