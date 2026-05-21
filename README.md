# 🚀 CareerFinder — AI-Powered Career Guidance & Opportunity Platform

## 🌐 Live Demo

👉 [https://careerfinder-qbs2.onrender.com/](https://careerfinder-qbs2.onrender.com/)

---

# 📌 Overview

CareerFinder is a full-stack AI-powered career guidance platform designed to help students, colleges, and companies connect in one intelligent ecosystem.

The platform provides:

* 🎯 AI-based career recommendations
* 🧠 Aptitude testing and guidance
* 🏫 College and course exploration
* 💼 Company and job management
* 👨‍🎓 Student dashboards and learning paths
* 🔐 Secure authentication system
* 📊 Personalized recommendations and analytics

This project is built using the MERN Stack with modern React frontend architecture and Express/MongoDB backend services.

---

# ✨ Core Features

## 👨‍🎓 Student Features

* Student authentication and profile management
* AI-powered career recommendation system
* Aptitude assessment module
* Personalized learning path suggestions
* Explore colleges and courses
* View detailed course information
* Browse company job opportunities
* Dashboard with recommendations and progress

---

## 🏫 College Features

* College dashboard management
* Add and manage colleges
* Manage courses and course details
* Edit college profiles
* Upload and manage educational data
* Showcase available programs

---

## 💼 Company Features

* Company dashboard
* Create and manage jobs
* Edit job listings
* Manage company profiles
* Publish opportunities for students

---

## 🤖 AI Features

* AI-based career guidance system
* Smart recommendation engine
* Student interest mapping
* Recommendation cleanup and ranking
* Career path analysis
* AI chat integration using Groq SDK

---

# 🛠️ Tech Stack

| Category         | Technologies                               |
| ---------------- | ------------------------------------------ |
| Frontend         | React 19, Vite, Tailwind CSS, React Router |
| Backend          | Node.js, Express.js                        |
| Database         | MongoDB, Mongoose                          |
| Authentication   | JWT, bcryptjs                              |
| AI Integration   | Groq SDK                                   |
| UI & Animation   | Framer Motion, Lucide React                |
| Charts & Reports | Recharts, jsPDF                            |
| Testing          | Jest, React Testing Library                |

---

# 📂 Project Structure

```bash
career-finder-main/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── Layout/
│   │   ├── pages/
│   │   └── App.jsx
│   └── vite.config.js
│
└── README.md
```

---

# 🧩 Frontend Modules

## 📌 Main Pages

### Student Pages

* Dashboard
* Aptitude Test
* Result Recommendations
* Courses & College Explorer
* Guidance Resources & Learning Paths
* Profile & Settings

### College Pages

* College Dashboard
* Manage Colleges
* Course Management
* College Details

### Company Pages

* Company Dashboard
* Manage Jobs
* Job Editor
* Company Listings

### Authentication

* Login
* Register
* Protected Routes

---

# ⚙️ Backend Architecture

The backend follows a structured Express.js architecture.

## 📁 Backend Layers

| Layer       | Purpose                               |
| ----------- | ------------------------------------- |
| Routes      | API endpoint definitions              |
| Controllers | Business logic handling               |
| Models      | MongoDB schemas                       |
| Middleware  | Authentication & validation           |
| Services    | AI and utility services               |
| Utils       | Recommendation & similarity utilities |

---

# 🔐 Authentication System

The platform uses JWT-based authentication.

### Features

* User registration
* Secure password hashing using bcryptjs
* Login authentication
* Protected routes
* Role-based access handling

---

# 🧠 AI Recommendation Engine

The AI system helps students discover suitable:

* Career paths
* Courses
* Colleges
* Learning resources
* Opportunities

### AI Services Included

* Career recommendation mapping
* Similarity scoring
* Recommendation cleaning
* AI chat support
* Personalized guidance generation

---

# 📊 Dashboard System

Different dashboards are implemented for:

| User Type | Dashboard                         |
| --------- | --------------------------------- |
| Students  | Career guidance & recommendations |
| Colleges  | College/course management         |
| Companies | Job & hiring management           |

---

# 📱 Modern UI Features

* Responsive design
* Animated components using Framer Motion
* Clean dashboard layouts
* Interactive cards and sections
* Modern navigation flow
* Professional landing page

---

# 🚀 Getting Started

## 1️⃣ Clone Repository

```bash
git clone <your-repository-url>
cd career-finder-main
```

---

# 🔧 Backend Setup

```bash
cd backend
npm install
```

## Create `.env` File

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
```

## Run Backend

```bash
npm run dev
```

---

# 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# 🌍 Environment Variables

## Backend

| Variable     | Description               |
| ------------ | ------------------------- |
| PORT         | Backend server port       |
| MONGO_URI    | MongoDB connection string |
| JWT_SECRET   | JWT authentication secret |
| GROQ_API_KEY | Groq AI API key           |

---

# 📦 Important Dependencies

## Frontend

* React 19
* React Router DOM
* Framer Motion
* Recharts
* Axios
* Lucide React
* jsPDF

## Backend

* Express.js
* Mongoose
* JWT
* bcryptjs
* Groq SDK
* dotenv
* cors

---

# 🧪 Testing

Frontend testing support included using:

```bash
npm test
```

Libraries:

* Jest
* React Testing Library

---

# 📈 Future Improvements

* Real-time chat system
* Resume analysis
* AI interview preparation
* Placement analytics
* Admin dashboard
* Notification system
* Advanced recommendation engine
* AI-generated learning roadmap

---

# 💡 Use Cases

This platform is suitable for:

* Students searching for career guidance
* Colleges promoting courses
* Companies hiring fresh talent
* Career mentorship ecosystems
* Educational guidance systems

---

# 🏗️ System Architecture

```text
Frontend (React + Vite)
        ↓
Express.js Backend API
        ↓
MongoDB Database
        ↓
AI Recommendation Services (Groq SDK)
```

---

# 📄 License

This project is open-source and available for educational and learning purposes.

---

# 👨‍💻 Developer Notes

CareerFinder demonstrates:

* Full-stack MERN development
* AI integration in web applications
* Modern React architecture
* MongoDB data modeling
* Secure authentication systems
* Dashboard-based application structure
* Career recommendation workflows

---

# ⭐ Final Thoughts

CareerFinder is a modern AI-enhanced career ecosystem platform that combines career guidance, educational discovery, and job opportunities into one intelligent system.

It showcases practical implementation of:

* MERN Stack Development
* AI-powered recommendations
* Role-based dashboards
* Real-world educational workflows
* Scalable frontend-backend architecture
