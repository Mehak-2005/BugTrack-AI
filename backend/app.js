const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");

const authRoutes = require("./routes/authRoutes");
const testRoute = require("./routes/testRoute");
const issueRoutes = require("./routes/issueRoutes");
const ragRoutes = require("./routes/ragRoutes");
const projectRoutes = require("./routes/projectRoutes");
const aiRoutes = require("./routes/aiRoutes");
const commentRoutes = require("./routes/commentRoutes");
const attachmentRoutes = require("./routes/attachmentRoutes");
const activityRoutes = require("./routes/activityRoutes");
const sprintRoutes = require("./routes/sprintRoutes");
const teamMemberRoutes = require("./routes/teamMemberRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const invitationRoutes = require("./routes/invitationRoutes");
const swaggerSpec = require("./config/swagger");

const app = express();

// 1. Security Headers (Place before routes, allow Swagger & upload previews)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

// 2. Global Rate Limiter (Place before /api routes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP
  message: { success: false, message: "Too many requests, please try again later." }
});
app.use("/api/", limiter);

// 3. Core Middleware
app.use(cors());
app.use(express.json());

// 4. Static Uploads
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// 5. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/rag", ragRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/attachments", attachmentRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/sprints", sprintRoutes);
app.use("/api/team", teamMemberRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/test", testRoute);

// 6. Swagger Docs & Health Check
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.get("/", (req, res) => {
  res.send("DefectIQ Backend Running");
});

module.exports = app;