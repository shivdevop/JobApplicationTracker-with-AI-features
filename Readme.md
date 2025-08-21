# Job Application Tracker with AI Features

A full-stack web application to manage job applications, upload resumes, and leverage AI-powered resume insights. Built with Node.js, Express, MongoDB, Cloudinary, and integrates AI services for resume evaluation.

## Features
- User authentication (register, login, logout)
- Create, update, delete, and view job applications
- Upload resumes (PDF/DOCX) to Cloudinary
- Extract and analyze resume text using AI
- Filter and search jobs by status, type, and keywords
- Secure RESTful API with JWT authentication

## Technologies Used
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **File Storage:** Cloudinary
- **AI Integration:** Custom AI service for resume evaluation using Gemini 2.5 flash model
- **Authentication:** JWT, Cookies
- **Validation:** Express middleware

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or Atlas)
- Cloudinary account

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/JobApplicationTracker-with-AI-features.git
   cd JobApplicationTracker-with-AI-features
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. Start the server:
   ```bash
   npm run dev
   # or
   npm start
   ```

## API Endpoints

### Auth
- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - Login user
- `POST /api/v1/users/logout` - Logout user

### Jobs
- `POST /api/v1/jobs/createJob` - Create a job (with resume upload)
- `GET /api/v1/jobs/getJobs` - Get all jobs (with filters)
- `GET /api/v1/jobs/getJob/:jobid` - Get job by ID
- `PATCH /api/v1/jobs/updateJob/:jobid` - Update job (optionally update resume)
- `DELETE /api/v1/jobs/deleteJob/:jobid` - Delete job

### Resume Evaluation using Gemini 2.5 flash model
- `GET /api/v1/jobs/getResumeInsights/:jobId` - Get resume insights by job ID




## Resume Upload & AI Insights
- Resumes are uploaded to Cloudinary and stored securely.
- Supported formats: PDF, DOCX
- AI service extracts text and provides actionable insights for job seekers.

## Project Structure
```
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── ...
├── .env
├── package.json
└── README.md
```

## Troubleshooting
- **PDF fails to load:** Ensure the uploaded file is a valid PDF and Cloudinary URL is accessible.
- **Resume extraction errors:** Check Cloudinary credentials and file format. See server logs for details.
- **Authentication issues:** Verify JWT secret and cookie settings.
- **Database errors:** Confirm MongoDB URI and connection.

## Future Enhancements
- **Get Json Response:** Get resume insights in a much more structured JSON format.
- **AI Model Integration:** Upgrade to a more advanced AI model for resume evaluation.
- **User Profiles:** Allow users to create and manage their profiles with additional information.
- **Job Listings:** Integrate with job portals to fetch real-time job listings.
- **Notifications:** Add email or SMS notifications for job application status updates.



## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
MIT

## Contact
For questions or support, open an issue or contact [shivamagarwalla05@gmail.com].