require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const testRoute = require("./routes/testRoute");
const issueRoutes = require("./routes/issueRoutes");
const projectRoutes = require("./routes/projectRoutes");
const aiRoutes = require("./routes/aiRoutes");
const commentRoutes = require("./routes/commentRoutes");
const attachmentRoutes = require("./routes/attachmentRoutes");
const activityRoutes = require("./routes/activityRoutes");
const sprintRoutes = require("./routes/sprintRoutes");

const app = express();
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/projects",projectRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/attachments", attachmentRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/sprints", sprintRoutes);


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.get("/", (req,res)=>{
    res.send("BugTrack AI Backend Running");
});

const PORT = process.env.PORT || 5000;

console.log(
  "Gemini API key:",
  process.env.GEMINI_API_KEY ? "Loaded" : "Missing"
);



app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`);
});


