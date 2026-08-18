<div align="center">

# 🐞 DefectIQ ### Intelligent Defect Management System

From tracking bugs to helping teams understand, assign, resolve, test,
and verify them.







Overview • Features • Milestone
1 • Milestone 2 •
AI • Setup • Demo

</div>

--- ## 📌 Overview **DefectIQ** is a full-stack, AI-assisted
software defect management platform developed to make the complete
defect lifecycle more structured, collaborative, and intelligent.
Instead of treating a bug tracker as only a place to store issues,
DefectIQ connects: **Defect Reporting → Triage → Similarity Detection
→ Assignment → Sprint Planning → Resolution → Testing → Verification →
Audit History** The system is developed incrementally through
milestones. | Milestone | Focus | Status | |---|---|---| |
**Milestone 1** | Core defect-management foundation | ✅ Completed
| | **Milestone 2** | Intelligent workflows + AI-assisted
engineering | ✅ Completed | | **Milestone 3** | Analytics,
CI/CD, AI code review and fix suggestions | 🚀 Planned | --- # 🎯
Problem Statement Traditional defect tracking can require significant
manual effort. Teams often face: - Unstructured bug reports - Manual
priority and severity decisions - Repeated investigation of duplicate
defects - Difficulty selecting the right person for a defect - Limited
visibility into team workload - Time-consuming test-case preparation -
Poor traceability across the defect lifecycle ### 💡 Solution DefectIQ
provides a single workspace where teams can manage defects while using
AI to assist with: - Defect understanding - Classification and triage -
Similarity detection - Resolution guidance - Test-case generation -
Developer/team-member recommendation - Resolution verification > **AI
assists the engineering team; humans remain responsible for the final
decision.** --- # ✨ Key Features





### 🐞 Defect Management - Structured issue creation - Priority and severity - Categories and affected modules - Search and filtering - Status-based issue views

### 👥 Team Management - Team member profiles - Roles and skills - Experience tracking - Workload visibility - Assigned-task tracking

### 🔄 Workflow Management - Controlled defect lifecycle - Assignment - In Progress / Review / Resolution - Verification and closure - Activity history

### 🤖 AI Intelligence - AI defect triage - Semantic duplicate detection - Resolution assistance - Test-case generation - Developer recommendation - Resolution verification

### 🏃 Sprint Planning - Organize defect work into sprints - Plan time-bound work - Track sprint-related defect activity

### 💬 Collaboration - Comments - Attachments - Audit history - Centralized defect context

--- # 🏗️ System Architecture ```text ┌─────────────────────────┐ │
React + Vite │ │ Frontend │ │ │ │ Dashboard | Issues │ │ Team |
Sprints | AI │ └────────────┬────────────┘ │ REST APIs │ ▼
┌─────────────────────────┐ │ Node.js + Express │ │ Backend │ │ │ │
Routes | Controllers │ │ Middleware | Services │
└───────────┬─────┬───────┘ │ │ ┌──────────┘ └──────────┐ ▼ ▼
┌──────────────────┐ ┌──────────────────┐ │ MongoDB + │ │ Gemini AI │ │
Mongoose │ │ Service │ │ │ │ │ │ Issues │ │ Triage │ │ Projects │ │
Similarity │ │ Team Members │ │ Resolution │ │ Sprints │ │ Test
Generation │ │ Activities │ │ Recommendation │ └──────────────────┘ │
Verification │ └──────────────────┘ ``` --- # 🚀 Milestone 1 ##
Core Defect Management Foundation Milestone 1 establishes the foundation
required to manage projects, issues, users, and teams. ### 1. Project
Management - Create and manage projects - Organize defects by project -
Maintain a centralized project workspace ### 2. Structured Issue
Management Each issue can contain: - Title - Description - Category -
Priority - Severity - Project - Status - Reporter - Affected module - AI
analysis information ### 3. Issue Dashboard Users can: - View open and
resolved issues - Search issues - Filter issues - Open detailed issue
information - Access available AI actions ### 4. AI-Assisted Bug
Reporting AI can help turn a raw defect description into a clearer and
more structured report. ### 5. Team Member Management Team profiles
maintain: - Name - Email - Role - Skills - Experience - Workload -
Assigned tasks ### 6. Authentication & Access Control Authenticated
requests are handled through backend middleware and user-specific
ownership checks. ### 7. Activity History Important issue actions can
be recorded for traceability and audit purposes. --- # 🧠 Milestone 2
## Intelligent Defect Management Milestone 2 expands the foundation
into a complete intelligent defect workflow. ### What changed?
```text MILESTONE 1 │ ▼ Structured Bug Tracker │ │ Milestone 2 ▼
┌──────────────────────────┐ │ Intelligent Defect │ │ Management
Workspace │ └──────────────────────────┘ │
┌──────────────┼──────────────┐ ▼ ▼ ▼ Workflow Team AI Management
Collaboration Intelligence ``` --- ## 🔄 Controlled Defect Lifecycle
```text ┌──────────┐ │ Reported │ └────┬─────┘ ▼ ┌──────────┐ │
Assigned │ └────┬─────┘ ▼ ┌────────────┐ │ In Progress│ └────┬───────┘ ▼
┌──────────┐ │ In Review│ └────┬─────┘ ▼ ┌──────────┐ │ Resolved │
└────┬─────┘ ▼ ┌──────────┐ │ Verified │ └────┬─────┘ ▼ ┌────────┐ │
Closed │ └────────┘ ``` | Status | Purpose | |---|---| |
**Reported** | New defect is created | | **Assigned** |
Responsible team member is selected | | **In Progress** |
Investigation/development is underway | | **In Review** | Fix is
ready for review | | **Resolved** | Fix has been completed | |
**Verified** | Fix has been validated | | **Closed** |
Defect lifecycle is complete | --- # ⭐ Priority vs Severity DefectIQ
treats **priority** and **severity** as separate concepts. ###
Priority — How urgent is it? - 🔴 Critical - 🟠 High - 🟡 Medium - 🟢
Low ### Severity — How much does it impact the system/user? - 🔴
Critical - 🟠 High - 🟡 Medium - 🟢 Low This allows a team to
communicate both **business urgency** and **technical/user
impact**. --- # 👥 Team Collaboration & Workload Team members are
managed using: | Attribute | Purpose | |---|---| | **Role**
| Developer, QA Engineer, Tester, Project Manager, etc. | |
**Skills** | Helps determine suitability for an issue | |
**Experience** | Supports assignment decisions | |
**Workload** | Shows current assigned work | | **Assigned
Tasks** | Provides task-level visibility | This information becomes
especially important for the AI developer recommendation feature. --- #
💬 Comments, Attachments & Activity History ### Comments Team members
can discuss: - Investigation findings - Reproduction details - Proposed
solutions - Testing observations ### Attachments Supporting files can
be associated with an issue. ### Activity History Important changes can
be recorded, creating an audit trail. Example: ```text Issue Created
↓ Priority Updated ↓ Assigned to QA Engineer ↓ Status → In Progress ↓
Status → Resolved ↓ Status → Verified ``` --- # 🏃 Sprint Planning
Milestone 2 introduces sprint-based defect organization. Sprints help
teams: - Group related work - Plan time-bound activities - Track defect
work - Connect issue resolution with development planning --- # 🤖 AI
Intelligence The AI layer is integrated through the Gemini service. ##
AI Workflow ```text ┌─────────────┐ │ Raw Defect │ └──────┬──────┘ ▼
┌─────────────┐ │ Triage │ └──────┬──────┘ ▼ ┌─────────────┐ │
Similarity │ └──────┬──────┘ ▼ ┌─────────────┐ │ Assignment │
└──────┬──────┘ ▼ ┌─────────────┐ │ Resolution │ └──────┬──────┘ ▼
┌─────────────┐ │ Test Cases │ └──────┬──────┘ ▼ ┌─────────────┐ │
Verification│ └─────────────┘ ``` --- # 1️⃣ AI-Assisted Defect Triage
The AI can analyze issue information such as: - Title - Description -
Category - Severity - Priority - Affected module The objective is to
make defect understanding and classification faster and more consistent.
--- # 2️⃣ Semantic Duplicate Detection The system can identify defects
that have similar meaning even when their wording is different. ###
Example **Existing issue** > Payment button crashes during
checkout. **New issue** > Checkout payment action causes the
application to crash. The AI can identify the semantic relationship
between the two issues. ### Benefit **Less duplicate investigation →
less repeated debugging → faster engineering workflow** --- # 3️⃣ AI
Resolution Assistance The AI can provide suggestions to help engineers
understand possible causes and approaches to resolving a defect. The AI
output is treated as **assistance**, not an automatic final fix. ---
# 4️⃣ AI-Generated Test Cases The system can generate validation
scenarios from the defect. ### Example: Discount Coupon Defect
```text TC01 → Apply a valid coupon → verify discounted total TC02 →
Apply an expired coupon → verify rejection TC03 → Apply coupon with
minimum purchase condition → verify correct calculation TC04 → Remove
coupon → verify original total ``` This can help QA engineers prepare
regression and validation scenarios faster. --- # 5️⃣ AI Developer
Recommendation One of the key Milestone 2 features is intelligent
team-member recommendation. The system considers: - Issue title and
description - Category - Severity - Priority - Affected module - Team
member role - Skills - Experience - Workload ### Demo Example
```text Issue: Discount coupon validation fails during checkout.
Recommended Team Member: Rahul Kumar Role: QA Engineer AI Match: 95%
``` ### Why? The issue requires: - Validation - Calculation
verification - Regression testing - Test-case creation Rahul's
QA/testing skills make him a strong match for this defect. --- # 6️⃣ AI
Resolution Verification After a resolution is proposed, the platform can
assist in checking whether the resolution addresses the original defect.
```text Defect ↓ Resolution Suggestion ↓ Generate Test Cases ↓
Validate Fix ↓ Verify Resolution ↓ Close Defect ``` --- # 👨‍💻
Human-in-the-Loop DefectIQ follows a **human-in-the-loop** approach.
AI recommendations are not treated as unquestionable decisions.
Engineers remain responsible for: - Reviewing AI recommendations -
Selecting the final assignee - Reviewing proposed resolutions -
Reviewing generated test cases - Validating the fix - Confirming closure
> **AI accelerates engineering work; engineers retain control of the
final decision.** --- # 🔗 End-to-End Milestone 2 Workflow ```text
REPORT │ ▼ TRIAGE │ ▼ SIMILARITY │ ▼ ASSIGN │ ▼ SPRINT │ ▼ RESOLVE │ ▼
TEST │ ▼ VERIFY │ ▼ HISTORY ``` ### Final Outcome A defect becomes
an **actionable engineering workflow**: **Understood → Prioritized
→ Assigned → Planned → Resolved → Tested → Verified → Traced** --- #
📊 Milestone Comparison | Capability | Milestone 1 | Milestone 2 |
|---|:---:|:---:| | Project Management | ✅ | ✅ | | Issue
Management | ✅ | ✅ Enhanced | | Team Management | ✅ | ✅
Enhanced | | Authentication | ✅ | ✅ | | AI Bug Reporting | ✅
| ✅ | | Priority | ✅ | ✅ Structured | | Severity | Basic |
✅ Structured | | Controlled Lifecycle | — | ✅ | | Comments | ✅
| ✅ | | Attachments | ✅ | ✅ | | Activity History | ✅ | ✅
Enhanced | | Sprint Planning | — | ✅ | | Workload Tracking |
Foundation | ✅ | | AI Triage | Foundation | ✅ | | Semantic
Duplicate Detection | — | ✅ | | AI Resolution Assistance | — | ✅
| | AI Test Generation | — | ✅ | | Developer Recommendation | —
| ✅ | | Resolution Verification | — | ✅ | --- # 🛠️ Technology
Stack | Layer | Technologies | |---|---| | **Frontend** |
React.js, Vite, JavaScript, HTML, CSS | | **Backend** | Node.js,
Express.js, REST APIs | | **Database** | MongoDB, Mongoose | |
**AI** | Google Gemini API | | **Authentication** | Backend
authentication middleware | | **Development** | VS Code, npm,
Git, GitHub | --- # 📁 Project Structure ```text BugTrack-AI/ │ ├──
backend/ │ ├── config/ │ ├── controllers/ │ ├── middleware/ │ ├──
models/ │ ├── routes/ │ ├── services/ │ └── server.js │ ├── frontend/ │
├── src/ │ │ ├── components/ │ │ ├── pages/ │ │ ├── services/ │ │ └──
... │ ├── package.json │ └── vite.config.js │ ├── screenshots/ │ ├──
.gitignore └── README.md ``` --- # 📸 Screenshots Application
screenshots are maintained in the [`screenshots`](./screenshots)
directory. Recommended screenshots for the project documentation
include: - Dashboard - Projects - Issues / Defect Board - Create Issue -
Team Members - Assigned Tasks - Sprint Planning - AI Developer
Recommendation - AI Resolution Assistance - Generated Test Cases -
Resolution Verification - Activity History > **Tip:** Keep the
README concise and use the screenshots folder for the detailed UI
evidence of Milestones 1 and 2. --- # ⚙️ Setup ## Prerequisites Make
sure you have: - [Node.js](https://nodejs.org/) installed -
[MongoDB](https://www.mongodb.com/) installed/running - npm - Git - A
Gemini API key --- ## 1. Clone the Repository ```bash git clone
https://github.com/Mehak-2005/BugTrack-AI.git cd BugTrack-AI ``` ---
## 2. Backend Setup ```bash cd backend npm install ``` Create a
`.env` file inside `backend/`: ```env PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bugtrack-ai
GEMINI_API_KEY=your_gemini_api_key JWT_SECRET=your_secret_key ```
### Start the backend ```bash npm run dev ``` Backend: ```text
http://localhost:5000 ``` --- ## 3. Frontend Setup Open another
terminal: ```bash cd frontend npm install npm run dev ```
Frontend: ```text http://localhost:5173 ``` Open the displayed
Vite URL in your browser. --- ## 🔐 Environment Variables Never commit
sensitive credentials. Your `.gitignore` should include:
```gitignore node_modules/ .env .env.* ``` If the project uses
environment-specific frontend variables, configure them according to the
frontend service/API setup. --- # 🧪 Demo Scenario A useful
demonstration for Milestone 2 is the following defect. ### Issue Title
```text Discount coupon validation fails during checkout ``` ###
Description ```text During checkout, the discount coupon is applied
but the final order total does not match the expected discounted amount.
The issue needs validation against the expected calculation and
regression testing for different coupon values. ``` ### Expected AI
Recommendation ```text Rahul Kumar QA Engineer 95% Match ``` ###
Demonstration Flow ```text Create Issue ↓ View Issue ↓ Recommend
Developer ↓ AI recommends Rahul Kumar ↓ Assign Issue ↓ Generate Test
Cases ↓ Resolve Defect ↓ Verify Resolution ↓ Update Status ``` --- #
🎓 Academic Demonstration The project demonstrates the integration of: -
Full-stack web development - REST API development - Database
management - Authentication - Software defect management - Agile sprint
workflow - Team workload management - Generative AI integration -
Human-in-the-loop AI - QA and validation concepts --- # 🔮 Future Scope
— Milestone 3 Planned enhancements include: ### 📊 Analytics - Defect
trends - Resolution time - Team workload metrics - Sprint performance -
Severity/priority distribution ### 🔁 CI/CD - GitHub/GitLab
integration - Automated issue creation from pipeline failures -
Build/test failure tracking ### 🤖 Advanced AI - AI code review - AI
fix suggestions - Root-cause assistance - Smarter defect
prioritization - Automated quality insights ### 📈 Engineering
Intelligence - Defect prediction - Resolution-time prediction - Team
capacity insights - Historical defect pattern analysis --- # 📈 Project
Status

<div align="center">

| Phase | Status | |---|---| | 🏗️ Milestone 1 |
**COMPLETED** ✅ | | 🧠 Milestone 2 | **COMPLETED** ✅ | |
🚀 Milestone 3 | **PLANNED** |

</div>

--- # 👩‍💻 Author

<div align="center">

### **Mehak** **BE – Computer Science Engineering**
**Project:** DefectIQ – Intelligent Defect Management System
**Repository:** `BugTrack-AI`

</div>

--- # ⭐ Project Highlights > **DefectIQ is more than a bug
tracker.** It combines a structured defect lifecycle, team
collaboration, sprint planning, workload-aware assignment, and
Generative AI assistance into one engineering workspace. ### Milestone
1 **Built the foundation.** ### Milestone 2 **Made the foundation
intelligent.** ### Milestone 3 **Will make the platform more
analytics-driven and development-aware.** ---

<div align="center">

### 🐞 DefectIQ **Track smarter. Collaborate better. Resolve
faster.**

</div>
