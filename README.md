# 🐞 DefectIQ — Intelligent Defect Management & Quality Platform

AI-powered defect tracking, team collaboration, sprint delivery analytics, automated test synthesis, and architectural risk intelligence.

DefectIQ is a full-stack software quality assurance and engineering intelligence platform built with the **MERN stack** and **Google Gemini API**. It transforms bug tracking from a static issue log into an active, predictive engineering copilot that covers the defect lifecycle from reporting to release.

---

## 📌 Milestones & Delivery Status

| Milestone | Focus Domain | Status |
| :--- | :--- | :---: |
| **Milestone 1** | Core defect management foundation, projects, team members, and role tracking | ✅ Completed |
| **Milestone 2** | Controlled defect lifecycle, sprint planning, and core AI engineering triage | ✅ Completed |
| **Milestone 3** | Skill-based developer recommendation, workload balancing, and RAG root cause assistance | ✅ Completed |
| **Milestone 4** | Hotspot fragility heatmaps, Playwright test generation, release notes, and QA audit exports | ✅ Completed |

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Problem Statement & Solution](#-problem-statement--solution)
- [System Architecture](#-system-architecture)
- [Comprehensive Feature Matrix](#-comprehensive-feature-matrix)
- [Algorithmic Innovation: Module Fragility Index](#-algorithmic-innovation-module-fragility-index)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation and Setup](#-installation-and-setup)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [End-to-End Demo Workflow](#-end-to-end-demo-workflow)
- [Reliability & Defensive Fault Tolerance](#-reliability--defensive-fault-tolerance)
- [CI/CD Automation](#-cicd-automation)
- [Security & Best Practices](#-security--best-practices)
- [Author & Acknowledgments](#-author--acknowledgments)

---

## 📖 Project Overview

DefectIQ provides a centralized workspace where engineering teams can:
- **Triage & Manage:** Create structured defects categorized by severity, priority, and affected subsystem.
- **Enforce Quality Gates:** Catch duplicate reports early using semantic vector comparisons.
- **Balance Workload:** Route issues to developers based on domain skills, past resolution history, and capacity.
- **Accelerate Resolution:** Use AI-assisted root cause analysis and context-aware debugging guidance.
- **Synthesize Tests:** Auto-generate executable Playwright end-to-end tests directly from defect symptoms.
- **Monitor Delivery:** Track sprint delivery risks via the AI Health Radar.
- **Analyze Architecture:** Pinpoint codebase technical debt through the Defect Hotspot Heatmap.
- **Executive Reporting:** Generate changelogs and export one-click QA audit summaries.

---

## 🎯 Problem Statement & Solution

### Traditional Challenges
- **Unstructured Bug Reports:** Inconsistent issue descriptions slow down triage.
- **Duplicate Investigation:** Teams waste sprint cycles debugging problems that have already been documented.
- **Suboptimal Assignment:** Issues are assigned without considering developer domain expertise or workload.
- **Manual Test Writing:** Writing reproduction tests for every bug is labor-intensive.
- **Hidden Technical Debt:** Teams lack visibility into which modules fail repeatedly under high severity.

### The DefectIQ Solution
DefectIQ bridges issue management with AI-assisted software engineering. By combining role-based access, automated triaging, deterministic fallbacks, and Google Gemini, the platform reduces defect lead time and improves delivery confidence.

---

## 🏛️ System Architecture

┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React / Vite)                  │
│   • Recharts Analytics Visualizer    • Kanban Drag & Drop   │
│   • Playwright Test Script Runner    • Sprint Health Modals │
│   • QA Audit Exporter Modal          • Release Notes Modal  │
└──────────────────────────────┬──────────────────────────────┘
│ REST APIs (JWT Auth / Axios)
┌──────────────────────────────▼──────────────────────────────┐
│                  Backend (Node.js / Express)                │
│   • Issue & Sprint Controllers      • RBAC Auth Middleware  │
│   • Rate Limiting & Helmet Sec      • Heuristic Fallbacks   │
└──────────────┬──────────────────────────────┬───────────────┘
│                              │
┌──────────────▼──────────────┐┌──────────────▼───────────────┐
│     MongoDB (Mongoose)      ││       Google Gemini API       │
│ • Compound Query Indexes    ││ • Structured JSON Schemas    │
│ • Sprint & Defect Entities  ││ • Defect Analysis & Synthesis│
└─────────────────────────────┘└──────────────────────────────┘

---

## 🚀 Comprehensive Feature Matrix

### 🐞 Core Defect Lifecycle
- **Structured Issue Ingestion:** Captures title, description, category, affected module, priority, and severity.
- **Separation of Concerns:** Distinguishes between **Priority** (business urgency) and **Severity** (technical impact).
- **Controlled Lifecycle:** Issues transition through:
  $$\text{Open} \longrightarrow \text{In Progress} \longrightarrow \text{In Review} \longrightarrow \text{Resolved} \longrightarrow \text{Closed}$$
- **Full Traceability:** Preserves discussion threads, attachment evidence, and immutable audit activity logs.

### 🤖 AI Engineering Services
- **Automated Bug Triage:** Auto-infers severity, priority, and module classification from unstructured user reports.
- **Semantic Deduplication:** Uses semantic vector comparison to identify duplicate issues before submission.
- **Developer Recommendation:** Suggests the best-suited team member by scoring role, skills, experience, and real-time workload percentage.
- **RAG Root Cause Assistance:** Analyzes stack traces and symptoms to propose verified debugging and remediation playbooks.
- **Playwright Test Synthesizer:** Auto-generates ready-to-run `@playwright/test` scripts containing inferred DOM locators, interactions, and assertions.
- **AI Sprint Delivery Health Radar:** Computes live delivery risk scores, velocity bottlenecks, and mitigation steps.
- **Executive Release Notes Generator:** Transforms closed sprint tickets into executive summaries, categorized bug fixes, and markdown changelogs.
- **AI Defect Hotspot Heatmap:** Calculates module fragility and delivers architectural technical debt assessments.
- **1-Click Executive QA Audit Exporter:** Produces formatted Markdown reports and printable PDF executive briefs.

---

## 📐 Algorithmic Innovation: Module Fragility Index

DefectIQ avoids simple bug counting. It computes an architectural vulnerability score using a **severity-weighted vulnerability model**:

$$\text{Weighted Score} = (N_{\text{Critical}} \times 4) + (N_{\text{High}} \times 3) + (N_{\text{Medium}} \times 2) + (N_{\text{Low}} \times 1)$$

$$\text{Module Fragility Index (\%)} = \min\left(100, \left\lfloor \frac{\text{Weighted Score}}{\text{Max Workspace Score} \times 1.2} \times 100 \right\rfloor\right)$$

- **$\ge 75\%$ (Critical Fragility):** High concentration of critical flaws; triggers refactoring advisories.
- **$50\% - 74\%$ (Moderate Risk):** Warning threshold requiring additional unit test coverage.
- **$< 50\%$ (Stable):** Subsystem functioning within acceptable quality tolerances.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Recharts, Axios, CSS Modules
- **Backend:** Node.js, Express.js (v5), JSON Web Tokens (JWT), Helmet, Express Rate Limit
- **Database:** MongoDB 7.0 via Mongoose (with compound query indexing)
- **AI Integration:** Google Gemini API (`gemini-3-flash-preview` / `gemini-1.5-flash-latest`) using strict JSON schema output contracts
- **Testing & Tooling:** Jest, Supertest, Playwright, Git, GitHub Actions

---

## 📁 Project Structure

BugTrack-AI/
├── .github/
│   └── workflows/
│       └── ci.yml                   # GitHub Actions CI/CD Pipeline
├── backend/
│   ├── config/                      # Database & environment configurations
│   ├── controllers/                 # Route handling logic (issues, sprints, auth)
│   ├── middleware/                  # JWT auth, RBAC, and error handlers
│   ├── models/                      # Mongoose schemas (Issue, Sprint, User, Team)
│   ├── routes/                      # REST API endpoints
│   ├── services/
│   │   ├── geminiService.js         # Core triage, deduplication & RAG assistant
│   │   ├── autoReproduceService.js  # Playwright test generation
│   │   ├── hotspotService.js        # Module fragility & heatmap analytics
│   │   ├── releaseNotesService.js   # Sprint release notes & changelogs
│   │   └── auditExportService.js    # System-wide QA audit compilation
│   ├── tests/                       # Jest & Supertest automated test suites
│   ├── server.js                    # Express application entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/              # Reusable UI (Modals, Charts, Navbar)
│   │   ├── pages/                   # Views (Dashboard, Issues, Sprints, Projects)
│   │   ├── services/                # Axios API service layers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── screenshots/                     # Platform execution screenshots
└── README.md

---

## ⚙️ Installation and Setup

### Prerequisites
- **Node.js**: v20.x or higher
- **MongoDB**: Local installation or MongoDB Atlas URI
- **Google Gemini API Key**: Acquired via [Google AI Studio](https://aistudio.google.com/)

---

### 1. Clone the Repository
```bash
git clone [https://github.com/Mehak-2005/BugTrack-AI.git](https://github.com/Mehak-2005/BugTrack-AI.git)
cd BugTrack-AI
```
### 2. Backend Configuration
cd backend
npm install
---
### 3. Create a .env file in the backend/ directory:
---
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/defectiq
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
---

### 4.Frontend Configuration
---
cd frontend
npm install
npm run dev
Application interface accessible at http://localhost:5173
---

## End-to-End Demo Workflow
To demonstrate DefectIQ during project evaluation or review:

Bug Ingestion: Navigate to Create Issue. Input an unstructured bug report:

Title: "Checkout coupon fails during payment"

Description: "Applying code SAVE20 succeeds visually, but transaction payload sends full price."

AI Triage & Deduplication: Gemini classifies the issue into Functional, High Priority, Critical Severity, and identifies the Payment/Checkout module while checking for duplicate tickets.

Smart Routing: The system evaluates team members and assigns a developer with matching skills (e.g., checkout workflows) and manageable workload.

Kanban & RAG Assistance: Move the ticket to In Progress. Open the defect to view root-cause analysis and remediation suggestions.

Auto-Reproduce Test: Click Auto-Reproduce to synthesize an end-to-end Playwright reproduction script.

Sprint Radar & Release Notes: In the Sprints page, evaluate the AI Health Radar delivery risk, resolve the ticket, and generate an Executive Release Changelog.

Architectural Heatmap & QA Audit: On the Dashboard, view the updated Module Fragility Index and click 📄 Export QA Audit to print or copy the audit summary.

## 🛡️ Reliability & Defensive Fault Tolerance
Zero Single-Point-of-Failure (SPOF): Every Gemini-driven service (hotspotService, releaseNotesService, autoReproduceService) includes deterministic heuristic fallbacks. If the API hits rate limits or network issues, rule-based algorithms supply valid test scripts, release notes, and fragility indices without crashing the UI.

Strict JSON Contract: API calls use responseMimeType: "application/json" with schema definitions, preventing broken JSON responses.

## 🔄 CI/CD Automation
DefectIQ includes a full GitHub Actions CI/CD pipeline (.github/workflows/ci.yml):

Spawns an isolated MongoDB 7.0 Docker service container.

Installs platform dependencies across environments.

Executes automated Jest test suites and validates backend routes.

Compiles the React/Vite production build to ensure deployment readiness.

## 🔐 Security & Best Practices
Role-Based Access Control (RBAC): Restricts administrative actions, sprint transitions, and issue assignments to authorized roles.

Defensive API Security: Uses Helmet to secure HTTP headers and Express Rate Limit to prevent brute-force attacks.

Secret Isolation: All credentials, keys, and connection strings are managed through environment variables and excluded via .gitignore.

## 👩‍💻 Author & Acknowledgments
Developer: Mehak (@Mehak-2005)
