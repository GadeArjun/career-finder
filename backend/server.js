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
app.use("/api/college", collegeRouter);
app.use("/api/courses", courseRouter);
app.use("/api/learning-paths", learningPathRouter);
app.use("/api/company", companyRouter);
app.use("/api/job", jobRouter);
app.use("/api/course", courseRoutes);

app.get(/.*/, (req, res) => {
  return res.sendFile(path.join(__dirname, "public", "dist", "index.html"));
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
