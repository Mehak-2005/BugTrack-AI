DefectIQ -- Intelligent Defect Management System

An AI-powered software defect tracking and management platform that
transforms bug reporting into a structured, collaborative, and
intelligent engineering workflow.

📌 Project Overview

DefectIQ is a full-stack intelligent defect management system designed
to help software teams report, organize, prioritize, assign, resolve,
test, and verify software defects from a single workspace.

The project is developed through milestones:

Milestone 1: Core defect-management foundation

Milestone 2: Intelligent defect management, team workflow,
sprint planning, and AI-assisted engineering features

Milestone 3: Planned future enhancements such as analytics,
CI/CD integration, AI code review, and AI fix suggestions

🎯 Objectives

Provide a centralized workspace for software defect management.

Create a controlled and traceable defect lifecycle.

Manage priority and severity separately.

Improve team collaboration using comments, attachments, and activity
history.

Manage team members using role, skills, experience, and workload.

Use Generative AI to assist with defect analysis and resolution.

Detect semantically similar/duplicate defects.

Generate test cases for validation.

Recommend suitable team members for defects.

Keep engineers responsible for final decisions through a
human-in-the-loop approach.

🏗️ System Architecture

React + Vite Frontend
        |
        | REST APIs
        v
Node.js + Express Backend
        |
        +-------------------+
        |                   |
        v                   v
MongoDB + Mongoose     Gemini AI Service
                            |
                  +---------+---------+
                  |         |         |
                Triage  Similarity  Resolution
                  |         |         |
               Tests   Developer   Verification
                       Recommendation

🚀 Milestone 1 -- Core Defect Management Foundation

Milestone 1 establishes the basic platform for projects, teams,
structured defects, authentication, and activity tracking.

1. Project Management

Create and manage projects.

Organize defects by project.

Provide a centralized project workspace.

2. Defect / Issue Management

Issues can contain:

Title

Description

Category

Priority

Severity

Project

Status

Reporter

Affected module

AI analysis information

3. Issue Dashboard

Users can:

View open defects.

View resolved defects.

Search issues.

Filter issues.

Open issue details.

Access AI-assisted actions.

4. AI-Assisted Bug Reporting

AI helps convert raw bug information into a clearer and more structured
defect report.

This improves:

Clarity

Completeness

Consistency

Classification

Defect understanding

5. Team Member Management

Team members can be maintained with:

Name

Email

Role

Skills

Experience

Workload

Assigned tasks

6. Authentication and Access Control

Authenticated users are identified through backend middleware, and
user-specific resources are protected using the logged-in user's
context.

7. Activity History

Important actions can be recorded for traceability, such as issue
creation, status changes, and assignment-related changes.

🧠 Milestone 2 -- Intelligent Defect Management

Milestone 2 extends the basic bug tracker into an intelligent
engineering workspace.

Main focus

From simply tracking bugs to helping the engineering team
understand, assign, resolve, test, and verify them.

🔄 Controlled Defect Lifecycle

Reported
   ↓
Assigned
   ↓
In Progress
   ↓
In Review
   ↓
Resolved
   ↓
Verified
   ↓
Closed

Status        Meaning

Reported      A new defect has been created
Assigned      An owner has been selected
In Progress   Development or investigation is in progress
In Review     The fix is ready for review
Resolved      The fix has been completed
Verified      The fix has been validated
Closed        The defect lifecycle is complete

⭐ Priority and Severity

Priority

Represents business urgency:

Critical

High

Medium

Low

Severity

Represents technical/user impact:

Critical

High

Medium

Low

Separating priority and severity gives the team a clearer understanding
of both urgency and impact.

👥 Team Collaboration

Team members can be managed using:

Role

Skills

Experience

Workload

Assigned tasks

The system provides visibility into current assignments and workload.

💬 Comments and Attachments

Comments

Team members can discuss investigation details directly inside an issue.

Attachments

Relevant supporting files can be associated with defects so that
issue-related context stays in one place.

📜 Activity / Audit History

Meaningful defect actions can be recorded to provide:

Traceability

Accountability

Historical context

Easier investigation

Example:

Issue Created
      ↓
Priority Changed
      ↓
Assigned to QA Engineer
      ↓
In Progress
      ↓
Resolved
      ↓
Verified

🏃 Sprint Planning

Milestone 2 introduces sprint-based organization of defect work.

This helps teams:

Plan work.

Group related issues.

Track sprint progress.

Connect defect resolution with development planning.

🤖 AI Intelligence Layer

The AI layer provides:

AI-assisted defect triage

Semantic duplicate detection

AI resolution assistance

AI-generated test cases

AI developer recommendation

AI-assisted resolution verification

AI Workflow

Raw Defect
    ↓
AI Triage
    ↓
Semantic Similarity
    ↓
Resolution Assistance
    ↓
Test Generation
    ↓
Developer Recommendation
    ↓
Resolution Verification

1. AI-Assisted Defect Triage

The AI analyzes issue information such as:

Title

Description

Category

Severity

Priority

Affected module

It helps make defect analysis faster and more consistent.

2. Semantic Duplicate Detection

The system can identify defects with similar meaning even when their
wording is different.

Example:

Existing:
Payment button crashes during checkout.

New:
Checkout payment action causes the application to crash.

The AI can recognize that these issues are related.

Benefits

Less duplicate investigation

Reduced repeated debugging

Better use of engineering time

3. AI Resolution Assistance

The AI can provide assistance for understanding and resolving a defect
based on its available issue context.

The recommendation is presented as engineering assistance rather than an
automatic final decision.

4. AI-Generated Test Cases

The system can generate test cases from a defect description.

Example for a discount coupon defect:

Test Case 1:
Apply a valid coupon and verify the discounted total.

Test Case 2:
Apply an expired coupon and verify that it is rejected.

Test Case 3:
Apply a coupon with a minimum purchase condition.

Test Case 4:
Remove the coupon and verify that the original total is restored.

5. AI Developer Recommendation

The AI considers:

Team member role

Skills

Experience

Workload

Issue category

Severity

Priority

Affected module

Defect description

Example

Issue:
Discount coupon validation fails during checkout.

Recommendation:
Rahul Kumar
Role: QA Engineer
Match: 95%

Why Rahul?

The defect requires:

Validation

Calculation verification

Regression testing

Test-case creation

Rahul's QA skills make him a suitable candidate.

The recommendation can therefore change depending on the nature of the
defect.

For example:

Checkout validation defect
        ↓
QA Engineer

React checkout UI crash
        ↓
Frontend Developer

6. AI Resolution Verification

After a proposed resolution, AI assistance can be used to verify whether
the resolution addresses the reported defect.

Defect
  ↓
Resolution Suggestion
  ↓
Generate Tests
  ↓
Validate
  ↓
Verify Resolution

👨‍💻 Human-in-the-Loop Principle

AI recommendations are treated as assistance and hypotheses, not
automatic final decisions.

Developers and testers remain responsible for:

Reviewing AI suggestions

Modifying recommendations

Selecting the final assignee

Reviewing proposed fixes

Reviewing generated test cases

Confirming the final resolution

🧩 Milestone 2 Deliverables

Workflow & Collaboration

Issue prioritization and severity

Controlled defect lifecycle

Defect assignment

Workload tracking

Comments

Attachments

Activity / audit history

Sprint planning

Issue search and filtering

AI & Resolution Intelligence

AI-assisted defect triage

Semantic duplicate detection

AI resolution assistance

AI-generated test cases

Developer recommendation

AI-assisted resolution verification

🔗 End-to-End Workflow

Report
  ↓
Triage
  ↓
Similarity
  ↓
Assign
  ↓
Sprint
  ↓
Resolve
  ↓
Test
  ↓
Verify
  ↓
History

Result

A defect becomes an actionable engineering workflow:

Understood by AI → assigned to a suitable team member → planned in a
sprint → resolved with assistance → validated with tests → verified
and fully traceable.

🛠️ Technology Stack

Frontend

React.js

Vite

JavaScript

HTML

CSS

Backend

Node.js

Express.js

REST APIs

Database

MongoDB

Mongoose

AI

Google Gemini API

AI-assisted defect analysis

Semantic similarity

AI resolution assistance

AI-generated test cases

Developer recommendation

Resolution verification

Development Tools

Visual Studio Code

Git

GitHub

npm

📁 Project Structure

BugTrack-AI/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md

⚙️ Installation and Setup

Prerequisites

Install:

Node.js

npm

MongoDB

Git

A Gemini API key is required for AI features.

1. Clone

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd BugTrack-AI

2. Backend

cd backend
npm install

Create .env:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bugtrack-ai
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_secret_key

Do not commit .env or API keys.

Start backend:

npm start

or:

npm run dev

Backend:

http://localhost:5000

3. Frontend

Open another terminal:

cd frontend
npm install
npm run dev

Frontend:

http://localhost:5173

🧪 Demo Scenario

Sample Issue

Title

Discount coupon validation fails during checkout

Description

During checkout, the discount coupon is applied but the final order
total does not match the expected discounted amount. The issue needs
validation against the expected calculation and regression testing
for different coupon values.

AI Result

Recommended Developer: Rahul Kumar
Role: QA Engineer
Match: 95%

The AI recommendation is based on the testing and validation
requirements together with the team member's role and skills.

📊 Milestone Comparison

Feature                          Milestone 1     Milestone 2

Project Management                        ✅              ✅
Issue Management                          ✅     ✅ Enhanced
Team Management                           ✅     ✅ Enhanced
Authentication                            ✅              ✅
AI Bug Reporting                          ✅              ✅
Priority                                  ✅   ✅ Structured
Severity                               Basic   ✅ Structured
Defect Lifecycle                       Basic   ✅ Controlled
Comments                                  ✅              ✅
Attachments                               ✅              ✅
Activity History                          ✅     ✅ Enhanced
Sprint Planning                          ---              ✅
Workload Management               Foundation              ✅
AI Triage                         Foundation              ✅
Semantic Duplicate Detection             ---              ✅
Resolution Assistance                    ---              ✅
Test Generation                          ---              ✅
Developer Recommendation                 ---              ✅
Resolution Verification                  ---              ✅

🌟 Benefits

Developers

Better defect understanding

AI-assisted resolution

Relevant team-member recommendations

Reduced duplicate investigation

QA Engineers

Structured defect information

AI-generated test cases

Easier validation

Better traceability

Project Managers

Team workload visibility

Sprint planning

Defect prioritization

Centralized project information

Entire Team

Centralized workspace

Better collaboration

Faster defect handling

Clear ownership

Improved traceability

AI-assisted engineering decisions

🔮 Future Enhancements -- Milestone 3

Planned enhancements include:

Analytics and engineering metrics

Advanced dashboards

CI/CD integration

AI code review

AI fix suggestions

Defect trend analysis

Resolution-time analytics

Team performance insights

Automated quality metrics

📌 Project Status

Milestone 1 → COMPLETED ✅
Milestone 2 → COMPLETED ✅
Milestone 3 → PLANNED 🚀

Milestone 2 transforms the project from a conventional defect tracker
into an AI-assisted intelligent defect management platform.

👩‍💻 Project Information

Project: DefectIQ -- Intelligent Defect Management System
Repository Folder: BugTrack-AI
Developer: Mehak
Project Type: Full-Stack + Generative AI
Completed Milestones: 1 and 2

📄 License

This project is developed for academic/project demonstration purposes.
