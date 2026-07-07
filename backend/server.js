const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { userRouter } = require("./routes/userRoutes");
const path = require("path");
const { collegeRouter } = require("./routes/collegeRoutes");
const { courseRouter } = require("./routes/courseRoutes");
const { learningPathRouter } = require("./routes/learningPathRoutes");
const companyRouter = require("./routes/companyRoutes");
const jobRouter = require("./routes/jobRoutes");
const courseRoutes = require("./routes/course.routes");
const testRoutes = require("./routes/test.routes");
const { recommendationRouter } = require("./routes/recommendationRoutes");
const testAdminRoutes = require("./routes/test.admin.routes")
const userAdminRoutes = require("./routes/user.admin.routes");
const {
  getDashboardInsights,
} = require("./controllers/studentDashboard.controller");
const { protect } = require("./middleware/auth");
const { chat, getHistory } = require("./controllers/chat.controller");
// const recommendationRoutes = require("./routes/recommendationRoutes")

// Load env vars
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public", "dist")));

// Routes
app.use("/api/users", userRouter);
app.use("/api/admin/users", userAdminRoutes);
app.use("/api/college", collegeRouter);
app.use("/api/courses", courseRouter);
app.use("/api/learning-paths", learningPathRouter);
app.use("/api/company", companyRouter);
app.use("/api/job", jobRouter);
app.use("/api/course", courseRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/admin/test",testAdminRoutes)
app.use("/api/recommendation", recommendationRouter);
app.get("/api/student/dashboard", protect, getDashboardInsights);
app.post("/api/ai/chat", protect, chat);
app.get("/api/ai/history", protect, getHistory);

// For any route not starting with /api, serve React
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dist", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});
