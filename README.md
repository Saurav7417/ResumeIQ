# ResumeIQ ⚡ | AI-Powered Resume Analyzer & ATS Optimizer

ResumeIQ is a premium, full-stack SaaS web application designed to help job seekers optimize their resumes for modern automated Applicant Tracking Systems (ATS). The application features a sleek dark-themed interface inspired by Vercel, Linear, and Notion.

## 🚀 Key Features

- **JWT Authentication**: Secure user registration, login, and profile tracking.
- **Dynamic Dashboard**: Beautiful cards displaying resume metrics, upload histories, profile completeness, and ATS trend lines.
- **Resume Upload & Parsing**: Drag-and-drop interface supporting PDF, DOCX, and TXT documents. Extract text and analyze details instantly.
- **AI-Powered Diagnostics**:
  - Technical & Soft Skills identification
  - Numerical ATS compatibility score (0-100)
  - Word-level grammar/syntax suggestion tables
  - Core resume strengths, weaknesses, and improvement lists
  - Missing keywords mapping
  - Target job role and experience level prediction
- **Job Description Matching**: Paste specific target job specs to compute compatibility percentage, missing skills, and recommended certifications.
- **Interactive Analytics**: Historical score charts, skill distribution graphs, and a resume quality Radar chart (powered by Recharts).
- **Admin Control Center**: Monitor registered users, global parsed resume counts, and Gemini API token traffic.
- **Offline / Resilient Design**: Dynamically degrades to run entirely in **In-Memory Mock Mode** if MongoDB or external Gemini API keys are not locally configured.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS v4.0, Recharts, Lucide React, Framer Motion, Axios.
- **Backend**: Node.js, Express, Mongoose, Multer, PDF-Parse, Mammoth, JSONWebToken, BcryptJS.
- **Database**: MongoDB (with fallback in-memory arrays).
- **AI Integrations**: Gemini 1.5 Flash (via `@google/generative-ai` SDK).

---

## 🏃 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org) installed on your local computer.

### Step 1: Install Dependencies
Navigate to the root directory and run the helper install script:
```bash
npm run install:all
```

### Step 2: Configure Environment Variables
Create a `.env` file in the `/backend` folder (a template is already provided):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/resumeiq
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```
*Note: If no database or AI key is specified, the application automatically launches in **Mock/Demo mode** for immediate evaluation.*

### Step 3: Run the Development Server
Start the frontend and backend concurrently:
```bash
npm run dev
```
- **React Frontend**: `http://localhost:5173`
- **Express Backend**: `http://localhost:5000`

---

## 🔑 Demo Account Credentials
For testing the Admin Panel and overall dashboard telemetry features:
- **Admin Email**: `admin@resumeiq.com`
- **Admin Password**: `AdminPass123!`
