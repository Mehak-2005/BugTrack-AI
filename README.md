# 🐞 BugTrack AI

BugTrack AI is an AI-powered Bug Lifecycle Management Platform designed to simplify bug reporting, tracking, prioritization, collaboration, and issue management.

The platform combines traditional bug tracking features with AI-assisted bug reporting to help developers create structured reports and manage issues throughout their lifecycle.

---

## 📌 Project Overview

Managing bugs manually can become difficult as projects grow. BugTrack AI provides a centralized platform where users can create projects, report issues, manage their status and priority, collaborate through comments and attachments, and maintain a complete history of issue changes.

The platform also includes AI-assisted bug report generation to convert user-provided descriptions into structured bug reports.

---

## ✨ Features

### Milestone 1 — Core Bug Tracking

The first milestone establishes the core functionality of the platform.

- User Registration and Login
- JWT-based Authentication
- Project Creation and Management
- Issue Creation and Management
- AI-assisted Bug Report Generation
- Structured Bug Reports
- Issue Dashboard
- Issue Status Management
- Priority Management
- Severity Management
- Category Management

---

### Milestone 2 — Workflow Automation & Collaboration

Milestone 2 extends the platform with workflow and collaboration capabilities.

#### Issue Prioritization

Issues can be classified using:

- Priority
- Severity
- Category

Severity levels include:

`Critical` | `High` | `Medium` | `Low`

#### Issue Workflow

Issues can move through different stages of the bug lifecycle:

`Open → In Progress → In Review → Resolved`

Changes are automatically recorded in the activity history.

#### Comments

Users can add comments to issues to record updates and collaborate during debugging.

Comment activity is also recorded in the Activity History.

#### File Attachments

Users can:

- Upload attachments
- View uploaded attachments
- Preview supported files inside the application
- Delete attachments

Attachment uploads and deletions are automatically recorded in Activity History.

#### Activity History

The platform maintains an activity timeline containing important issue events such as:

- Issue Created
- Issue Deleted
- Status Changed
- Priority Changed
- Severity Changed
- Category Changed
- Comment Added
- Attachment Uploaded
- Attachment Deleted

The Activity History page also provides search and filtering functionality.

---

## 🤖 AI Integration

BugTrack AI includes AI-assisted bug reporting.

A user can provide a bug description and the system can generate a structured bug report containing useful information for debugging and issue management.

This reduces the effort required to manually prepare detailed bug reports.

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express.js
- REST APIs

### Database

- MongoDB
- Mongoose

### Authentication

- JWT Authentication

### Development Tools

- Git
- GitHub
- VS Code
- Postman

---

## 📁 Project Structure

```text
BugTrack-AI/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd BugTrack-AI
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Add any AI API configuration required by the project to the `.env` file.

Do not commit the `.env` file to GitHub.

Start the backend:

```bash
npm start
```

If the project uses nodemon during development:

```bash
npm run dev
```

### 3. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

The backend will normally run on:

```text
http://localhost:5000
```

---

## 📸 Screenshots

### Dashboard

Add dashboard screenshot here.

### Issues Page

Add issues page screenshot here.

### Activity History

Add activity history screenshot here.

### Attachment Preview

Add attachment preview screenshot here.

> Screenshots will be added as the project development progresses.

---

## 🚧 Pending Milestone 2 Features

The following Milestone 2 features are planned for further development:

### Sprint Planning

Develop a basic Sprint Planning module that allows issues to be assigned to specific sprints.

### Intelligent Auto-Triaging

Use Natural Language Processing to analyze bug descriptions and automatically suggest:

- Bug Category
- Severity Level

### Duplicate Bug Detection

Implement semantic search using vector embeddings to compare newly reported bugs with existing issues and warn users when a similar issue may already exist.

---

## 🔮 Future Improvements

Future versions of BugTrack AI can include:

- Sprint Management
- Intelligent AI Auto-Triaging
- Semantic Duplicate Detection
- Advanced Search and Filtering
- Team Collaboration and Role Management
- Notifications
- Analytics and Reporting
- CI/CD Integration
- Cloud Deployment

---

## 🔐 Security

Sensitive information such as database credentials, JWT secrets, API keys, uploaded runtime files, and environment configuration should not be committed to the repository.

The `.gitignore` file is configured to exclude files such as:

```text
.env
node_modules/
uploads/
backend/uploads/
```

---

## 📊 Development Status

**Milestone 1:** Completed  
**Milestone 2:** In Progress

Completed Milestone 2 functionality includes issue prioritization, workflow state transitions, comments, attachments, attachment preview, and activity history.

Pending work includes Sprint Planning, AI Auto-Triaging, and Semantic Duplicate Detection.

---

## 👩‍💻 Author

**Mehak**

Bachelor of Engineering — Computer Science Engineering  
T John Institute of Technology, Bengaluru

GitHub: Mehak-2005

---

## 📄 Project Purpose

This project is being developed as part of the **Infosys Bug Lifecycle Management Platform project**, focusing on building a practical full-stack bug management system and gradually introducing AI-powered capabilities.
