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
const Test = require("./models/Test");
const testRoutes = require("./routes/test.routes");
const { recommendationRouter } = require("./routes/recommendationRoutes");
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
app.use("/api/college", collegeRouter);
app.use("/api/courses", courseRouter);
app.use("/api/learning-paths", learningPathRouter);
app.use("/api/company", companyRouter);
app.use("/api/job", jobRouter);
app.use("/api/course", courseRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/recommendation", recommendationRouter);

app.get(/.*/, (req, res) => {
  return res.sendFile(path.join(__dirname, "public", "dist", "index.html"));
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  /*
  const test = new Test({
  "title": "Professional Path Mastery Assessment v3",
  "description": "A fresh 35-question specialized assessment evaluating technical architecture, ethical reasoning, abstract logic, and industry-specific career signals.",
  "category": "Career Assessment",
  "duration": 50,
  "questionCount": 35,
  "totalMarks": 110,
  "createdBy": "650f1a2b3c4d5e6f7a8b9c0f",
  "isActive": true,
  "questions": [
    {
      "questionText": "If a doctor is to a patient what a lawyer is to a client, then a teacher is to a:",
      "type": "MCQ",
      "correctAnswer": "Student",
      "marks": 2,
      "difficulty": "Easy",
      "questionCategory": "Aptitude",
      "competencies": { "verbal": 5, "social": 2 },
      "careerTags": ["Teaching", "Law"],
      "options": [
        { "text": "School", "isCorrect": false },
        { "text": "Student", "isCorrect": true },
        { "text": "Lesson", "isCorrect": false },
        { "text": "Principal", "isCorrect": false }
      ]
    },
    {
      "questionText": "A person looks at a portrait and says, 'Brothers and sisters I have none, but that man's father is my father's son.' Who is in the portrait?",
      "type": "MCQ",
      "correctAnswer": "His son",
      "marks": 4,
      "difficulty": "Hard",
      "questionCategory": "Aptitude",
      "competencies": { "analytical": 5, "verbal": 3 },
      "careerTags": ["Law", "Research"],
      "options": [
        { "text": "Himself", "isCorrect": false },
        { "text": "His son", "isCorrect": true },
        { "text": "His father", "isCorrect": false },
        { "text": "His nephew", "isCorrect": false }
      ]
    },
    {
      "questionText": "What is 12.5% of 800?",
      "type": "Numeric",
      "correctAnswer": 100,
      "marks": 2,
      "difficulty": "Easy",
      "questionCategory": "Aptitude",
      "competencies": { "analytical": 5 },
      "careerTags": ["Finance", "Engineering"],
      "options": []
    },
    {
      "questionText": "Which word is a synonym for 'Meticulous'?",
      "type": "MCQ",
      "correctAnswer": "Precise",
      "marks": 2,
      "difficulty": "Medium",
      "questionCategory": "Aptitude",
      "competencies": { "verbal": 5 },
      "careerTags": ["Medical", "Research"],
      "options": [
        { "text": "Sloppy", "isCorrect": false },
        { "text": "Precise", "isCorrect": true },
        { "text": "Fast", "isCorrect": false },
        { "text": "Cheerful", "isCorrect": false }
      ]
    },
    {
      "questionText": "A car travels at 60 km/h for 2 hours and then 80 km/h for 3 hours. What is the average speed?",
      "type": "Numeric",
      "correctAnswer": 72,
      "marks": 3,
      "difficulty": "Medium",
      "questionCategory": "Aptitude",
      "competencies": { "analytical": 5, "scientific": 2 },
      "careerTags": ["Engineering", "Finance"],
      "options": []
    },
    {
      "questionText": "I feel a strong sense of responsibility to help those who are less fortunate than me.",
      "type": "MCQ",
      "marks": 1,
      "difficulty": "Easy",
      "questionCategory": "Personality",
      "competencies": { "social": 5 },
      "personalityTraits": { "teamwork": 4 },
      "careerTags": ["Medical", "Civil Services"],
      "options": [
        { "text": "Strongly Agree", "weight": 5, "personalityImpact": "Empathetic" },
        { "text": "Agree", "weight": 4 },
        { "text": "Neutral", "weight": 2 }
      ]
    },
    {
      "questionText": "I would rather lead a small, high-performing team than be a member of a large, prestigious organization.",
      "type": "TrueFalse",
      "marks": 2,
      "difficulty": "Medium",
      "questionCategory": "Personality",
      "personalityTraits": { "leadership": 5, "riskTaking": 3 },
      "careerTags": ["Entrepreneurship", "Management"],
      "options": [
        { "text": "True", "weight": 5, "personalityImpact": "Leader" },
        { "text": "False", "weight": 2, "personalityImpact": "Practical" }
      ]
    },
    {
      "questionText": "You discover a colleague has made a minor ethical slip that benefits the company. How do you respond?",
      "type": "Scenario",
      "correctAnswer": "Address it with the colleague directly and encourage them to correct it.",
      "marks": 5,
      "difficulty": "Hard",
      "questionCategory": "Personality",
      "personalityTraits": { "discipline": 5, "leadership": 3 },
      "careerTags": ["Law", "Management", "Finance"],
      "options": [
        { "text": "Ignore it since it helps the company", "weight": 0 },
        { "text": "Address it and encourage correction", "weight": 5, "isCorrect": true, "personalityImpact": "Analytical" },
        { "text": "Report them to HR immediately", "weight": 3, "personalityImpact": "Practical" },
        { "text": "Help them hide it better", "weight": 0 }
      ]
    },
    {
      "questionText": "I enjoy public speaking and presenting my ideas to large audiences.",
      "type": "MCQ",
      "marks": 1,
      "difficulty": "Medium",
      "questionCategory": "Personality",
      "competencies": { "social": 5, "verbal": 4 },
      "careerTags": ["Media", "Teaching", "Management"],
      "options": [
        { "text": "Strongly Agree", "weight": 5, "personalityImpact": "Leader" },
        { "text": "Agree", "weight": 4 },
        { "text": "Disagree", "weight": 1 }
      ]
    },
    {
      "questionText": "I am fascinated by how biological organisms adapt to extreme environments.",
      "type": "TrueFalse",
      "marks": 1,
      "difficulty": "Easy",
      "questionCategory": "Personality",
      "competencies": { "scientific": 5 },
      "careerTags": ["Medical", "Research"],
      "options": [
        { "text": "True", "weight": 5, "personalityImpact": "Analytical" },
        { "text": "False", "weight": 1 }
      ]
    },
    {
      "questionText": "What does the 'S' in SOLID principles of object-oriented design stand for?",
      "type": "MCQ",
      "correctAnswer": "Single Responsibility",
      "marks": 3,
      "difficulty": "Medium",
      "questionCategory": "Technical",
      "competencies": { "technical": 5, "analytical": 3 },
      "careerTags": ["Engineering", "AI"],
      "options": [
        { "text": "Security First", "isCorrect": false },
        { "text": "Single Responsibility", "isCorrect": true },
        { "text": "Scale Efficiency", "isCorrect": false },
        { "text": "System Stability", "isCorrect": false }
      ]
    },
    {
      "questionText": "In a Neural Network, what is the role of an 'Activation Function'?",
      "type": "Descriptive",
      "correctAnswer": "It introduces non-linearity into the output of a neuron, allowing the network to learn complex patterns.",
      "marks": 5,
      "difficulty": "Hard",
      "questionCategory": "Technical",
      "competencies": { "technical": 5, "scientific": 4, "analytical": 3 },
      "careerTags": ["AI", "Research", "Engineering"],
      "options": []
    },
    {
      "questionText": "Which data structure uses the LIFO (Last-In, First-Out) principle?",
      "type": "MCQ",
      "correctAnswer": "Stack",
      "marks": 2,
      "difficulty": "Easy",
      "questionCategory": "Technical",
      "competencies": { "technical": 5 },
      "careerTags": ["Engineering"],
      "options": [
        { "text": "Queue", "isCorrect": false },
        { "text": "Linked List", "isCorrect": false },
        { "text": "Stack", "isCorrect": true },
        { "text": "Heap", "isCorrect": false }
      ]
    },
    {
      "questionText": "A 'Smart Contract' is a self-executing contract with terms written directly into code.",
      "type": "TrueFalse",
      "correctAnswer": true,
      "marks": 3,
      "difficulty": "Medium",
      "questionCategory": "Technical",
      "competencies": { "technical": 5, "analytical": 2 },
      "careerTags": ["Finance", "Law", "Engineering"],
      "options": [
        { "text": "True", "isCorrect": true },
        { "text": "False", "isCorrect": false }
      ]
    },
    {
      "questionText": "What is the primary difference between SQL and NoSQL databases?",
      "type": "Descriptive",
      "correctAnswer": "SQL databases are relational and use structured schemas; NoSQL databases are non-relational and can handle unstructured, dynamic data.",
      "marks": 5,
      "difficulty": "Medium",
      "questionCategory": "Technical",
      "competencies": { "technical": 5 },
      "careerTags": ["Engineering", "AI"],
      "options": []
    },
    {
      "questionText": "Python is a compiled language, whereas C++ is an interpreted language.",
      "type": "TrueFalse",
      "correctAnswer": false,
      "marks": 2,
      "difficulty": "Medium",
      "questionCategory": "Technical",
      "competencies": { "technical": 5 },
      "careerTags": ["Engineering", "AI"],
      "options": [
        { "text": "True", "isCorrect": false },
        { "text": "False", "isCorrect": true }
      ]
    },
    {
      "questionText": "If MARS is coded as 13-1-18-19, how is EARTH coded?",
      "type": "MCQ",
      "correctAnswer": "5-1-18-20-8",
      "marks": 3,
      "difficulty": "Easy",
      "questionCategory": "Analytical",
      "competencies": { "analytical": 5 },
      "careerTags": ["Defense", "Research"],
      "options": [
        { "text": "5-1-18-20-8", "isCorrect": true },
        { "text": "5-2-18-21-9", "isCorrect": false },
        { "text": "4-1-17-19-7", "isCorrect": false },
        { "text": "5-1-19-21-8", "isCorrect": false }
      ]
    },
    {
      "questionText": "A man has 7 daughters and each daughter has a brother. How many children does the man have?",
      "type": "Numeric",
      "correctAnswer": 8,
      "marks": 4,
      "difficulty": "Medium",
      "questionCategory": "Analytical",
      "competencies": { "analytical": 5 },
      "careerTags": ["Management", "Law"],
      "options": []
    },
    {
      "questionText": "Pointing to a man, a woman said, 'His mother is the only daughter of my mother.' How is the woman related to the man?",
      "type": "MCQ",
      "correctAnswer": "Mother",
      "marks": 3,
      "difficulty": "Medium",
      "questionCategory": "Analytical",
      "competencies": { "analytical": 5 },
      "careerTags": ["Law", "Civil Services"],
      "options": [
        { "text": "Sister", "isCorrect": false },
        { "text": "Grandmother", "isCorrect": false },
        { "text": "Mother", "isCorrect": true },
        { "text": "Aunt", "isCorrect": false }
      ]
    },
    {
      "questionText": "Complete the pattern: 3, 9, 27, 81, ...",
      "type": "Numeric",
      "correctAnswer": 243,
      "marks": 2,
      "difficulty": "Easy",
      "questionCategory": "Analytical",
      "competencies": { "analytical": 5 },
      "careerTags": ["Finance", "Engineering"],
      "options": []
    },
    {
      "questionText": "If it is 3:00 PM, what is the angle between the hands of the clock?",
      "type": "Numeric",
      "correctAnswer": 90,
      "marks": 3,
      "difficulty": "Easy",
      "questionCategory": "Analytical",
      "competencies": { "analytical": 5, "scientific": 2 },
      "careerTags": ["Engineering", "Design"],
      "options": []
    },
    {
      "questionText": "A, B, C, and D are sitting in a row. C and D cannot be next to each other. A is at the far left. If B is next to A, where must D be?",
      "type": "MCQ",
      "correctAnswer": "Far right",
      "marks": 5,
      "difficulty": "Hard",
      "questionCategory": "Analytical",
      "competencies": { "analytical": 5 },
      "careerTags": ["Management", "Civil Services"],
      "options": [
        { "text": "Next to B", "isCorrect": false },
        { "text": "Far right", "isCorrect": true },
        { "text": "Next to A", "isCorrect": false },
        { "text": "Cannot determine", "isCorrect": false }
      ]
    },
    {
      "questionText": "Design a 'smart' lunchbox for busy professionals. What are its top 3 features?",
      "type": "Descriptive",
      "correctAnswer": "Evaluated on innovation (e.g., self-heating, nutrition tracking, modular storage).",
      "marks": 5,
      "difficulty": "Medium",
      "questionCategory": "Creative",
      "competencies": { "creative": 5, "technical": 3 },
      "personalityTraits": { "creativity": 5 },
      "careerTags": ["Design", "Entrepreneurship", "Engineering"],
      "options": []
    },
    {
      "questionText": "In visual arts, 'negative space' refers to the space around and between the subjects of an image.",
      "type": "TrueFalse",
      "correctAnswer": true,
      "marks": 2,
      "difficulty": "Easy",
      "questionCategory": "Creative",
      "competencies": { "creative": 5 },
      "careerTags": ["Design", "Media"],
      "options": [
        { "text": "True", "isCorrect": true },
        { "text": "False", "isCorrect": false }
      ]
    },
    {
      "questionText": "Which color scheme uses colors that are directly opposite each other on the color wheel?",
      "type": "MCQ",
      "correctAnswer": "Complementary",
      "marks": 2,
      "difficulty": "Medium",
      "questionCategory": "Creative",
      "competencies": { "creative": 5 },
      "careerTags": ["Design", "Media"],
      "options": [
        { "text": "Analogous", "isCorrect": false },
        { "text": "Monochromatic", "isCorrect": false },
        { "text": "Complementary", "isCorrect": true },
        { "text": "Triadic", "isCorrect": false }
      ]
    },
    {
      "questionText": "Create a metaphor for 'Data Privacy' that a 10-year-old would understand.",
      "type": "Descriptive",
      "correctAnswer": "Evaluated on clarity and imagination (e.g., 'Like a diary with a secret lock that only you have the key to').",
      "marks": 5,
      "difficulty": "Medium",
      "questionCategory": "Creative",
      "competencies": { "creative": 5, "verbal": 4 },
      "careerTags": ["Teaching", "Media", "Law"],
      "options": []
    },
    {
      "questionText": "The term 'Kerning' in typography refers to the vertical space between lines of text.",
      "type": "TrueFalse",
      "correctAnswer": false,
      "marks": 2,
      "difficulty": "Hard",
      "questionCategory": "Creative",
      "competencies": { "creative": 5, "technical": 2 },
      "careerTags": ["Design", "Media"],
      "options": [
        { "text": "True", "isCorrect": false },
        { "text": "False", "isCorrect": true }
      ]
    },
    {
      "questionText": "If you were to brand a new 'High-Speed Rail' service, which animal would you use as the logo and why?",
      "type": "Descriptive",
      "correctAnswer": "Evaluated on symbolism (e.g., Peregrine Falcon for speed, Cheetah for agility).",
      "marks": 4,
      "difficulty": "Medium",
      "questionCategory": "Creative",
      "competencies": { "creative": 5, "social": 2 },
      "careerTags": ["Design", "Media", "Management"],
      "options": []
    },
    {
      "questionText": "A patient arrives with high fever and joint pain after traveling to a tropical region. What is the most likely initial diagnostic step?",
      "type": "MCQ",
      "correctAnswer": "Blood test for Malaria/Dengue",
      "marks": 3,
      "difficulty": "Medium",
      "questionCategory": "Aptitude",
      "competencies": { "scientific": 5, "analytical": 3 },
      "careerTags": ["Medical", "Research"],
      "options": [
        { "text": "X-Ray", "isCorrect": false },
        { "text": "Blood test for Malaria/Dengue", "isCorrect": true },
        { "text": "MRI", "isCorrect": false },
        { "text": "Physical therapy", "isCorrect": false }
      ]
    },
    {
      "questionText": "I enjoy analyzing financial trends and predicting market movements.",
      "type": "MCQ",
      "marks": 1,
      "difficulty": "Medium",
      "questionCategory": "Personality",
      "competencies": { "analytical": 5 },
      "personalityTraits": { "riskTaking": 3, "discipline": 4 },
      "careerTags": ["Finance", "Management"],
      "options": [
        { "text": "Strongly Agree", "weight": 5, "personalityImpact": "Analytical" },
        { "text": "Neutral", "weight": 3 },
        { "text": "Disagree", "weight": 1 }
      ]
    },
    {
      "questionText": "What does 'Habeas Corpus' literally mean in legal terms?",
      "type": "MCQ",
      "correctAnswer": "That you have the body",
      "marks": 3,
      "difficulty": "Hard",
      "questionCategory": "Aptitude",
      "competencies": { "verbal": 5, "social": 2 },
      "careerTags": ["Law", "Civil Services"],
      "options": [
        { "text": "The act of speaking", "isCorrect": false },
        { "text": "That you have the body", "isCorrect": true },
        { "text": "The right to remain silent", "isCorrect": false },
        { "text": "Guilty until proven innocent", "isCorrect": false }
      ]
    },
    {
      "questionText": "In journalism, the 'Inverted Pyramid' style means the most important info is at the end of the article.",
      "type": "TrueFalse",
      "correctAnswer": false,
      "marks": 2,
      "difficulty": "Medium",
      "questionCategory": "Creative",
      "competencies": { "verbal": 4, "creative": 3 },
      "careerTags": ["Media", "Teaching"],
      "options": [
        { "text": "True", "isCorrect": false },
        { "text": "False", "isCorrect": true }
      ]
    },
    {
      "questionText": "Which of these is a core component of 'Agile' project management?",
      "type": "MCQ",
      "correctAnswer": "Iterative development",
      "marks": 2,
      "difficulty": "Easy",
      "questionCategory": "Technical",
      "competencies": { "social": 3, "technical": 2 },
      "careerTags": ["Management", "Engineering"],
      "options": [
        { "text": "Strict 5-year plans", "isCorrect": false },
        { "text": "Iterative development", "isCorrect": true },
        { "text": "No communication between teams", "isCorrect": false },
        { "text": "Manual data entry only", "isCorrect": false }
      ]
    },
    {
      "questionText": "I am comfortable working in environments where I have to strictly follow safety protocols and high-risk procedures.",
      "type": "TrueFalse",
      "marks": 2,
      "difficulty": "Medium",
      "questionCategory": "Personality",
      "personalityTraits": { "discipline": 5 },
      "careerTags": ["Defense", "Medical", "Engineering"],
      "options": [
        { "text": "True", "weight": 5, "personalityImpact": "Practical" },
        { "text": "False", "weight": 1 }
      ]
    },
    {
      "questionText": "Briefly explain the concept of 'Inflation' in economics.",
      "type": "Descriptive",
      "correctAnswer": "The rate at which the general level of prices for goods and services is rising, and subsequently, purchasing power is falling.",
      "marks": 4,
      "difficulty": "Medium",
      "questionCategory": "Technical",
      "competencies": { "analytical": 4 },
      "careerTags": ["Finance", "Civil Services", "Management"],
      "options": []
    }
  ]
});
  await test.save()
  console.log(test)
  // */
  console.log(`Server running on port ${PORT}`);
});
