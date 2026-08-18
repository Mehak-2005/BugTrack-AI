## DefectIQ — Intelligent Defect Management System ## 

An AI-powered software defect management platform for reporting, organizing, assigning, resolving, testing, and verifying software defects.

DefectIQ transforms traditional bug tracking into a structured engineering workflow by combining defect lifecycle management, team collaboration, sprint planning, workload-aware assignment, and AI-assisted engineering features.

## 📌 Project Overview ##

Software teams often lose time because defect information, team assignments, testing activities, and resolution discussions are spread across different tools.

DefectIQ brings these activities into one workspace.

## Core workflow ##

Report → Triage → Prioritize → Assign → Plan → Resolve → Test → Verify → Close → Track History

The project is implemented through milestones:

Milestone

Focus

Status

## Milestone 1 ## 

Core defect-management foundation

✅ Completed

Milestone 2

Intelligent defect management, team workflow, sprint planning and AI assistance

✅ Completed

Milestone 3

Analytics, CI/CD, AI code review and AI fix suggestions

🔜 Planned

🎯 Objectives

## DefectIQ is designed to:  ## 

Provide a centralized workspace for software defects.

Create a controlled and traceable defect lifecycle.

Capture structured defect information.

Separate priority from severity.

Improve collaboration between developers, testers and project managers.

Manage team members using role, skills, experience and workload.

Organize defect work using sprints.

Reduce manual triage and investigation effort using AI.

Generate useful testing and resolution assistance.

Recommend suitable team members for specific defects.

Maintain an activity history for traceability and auditing.

## 🐞 Milestone 1 — Core Defect Management Foundation ## 

Milestone 1 establishes the complete foundation required to create and manage software defects.

1. Authentication & Protected Access

The system provides authenticated access to the application and protects user-specific project and defect information.

Purpose:

Secure access to the platform.

Associate created data with the logged-in user.

Restrict team/project information to the appropriate owner.

2. Project Management

Projects provide the main workspace in which defects are organized.

Project capabilities

Create projects.

Store project information.

Associate defects with projects.

View project-related defect information.

3. Structured Defect Creation

Users can create defects with meaningful information instead of storing only a title.

Defect information includes

Issue title

Description

Category

Priority

Severity

Affected module

Project

Reporter

Status

This structured information also becomes the foundation for the AI features introduced in Milestone 2.

4. Defect Dashboard & Issue Management

The issue workspace provides an organized view of defects.

Supported capabilities

View defects.

Search defects.

Filter defects.

View issues according to their status.

View priority and severity.

Open individual issue details.

Access AI actions from issue cards.

5. Priority Management

Defects can be assigned a priority based on business urgency.

Priority levels

Critical

High

Medium

Low

Priority answers:

How urgently should the team handle this issue?

6. Severity Management

Severity represents the impact of the defect.

Severity levels

Critical

High

Medium

Low

Severity answers:

How seriously does this defect affect the system or user?

Priority vs Severity

DefectIQ intentionally keeps these concepts separate.

For example:

A defect can have High severity because it affects an important feature, while its priority may be Medium because there is a temporary workaround.

7. Defect Status Management

The platform provides status-based issue organization.

The controlled lifecycle is expanded in Milestone 2 to:

Reported → Assigned → In Progress → In Review → Resolved → Verified → Closed

8. Team Member Management

Milestone 1 establishes team-member information used later for intelligent assignment.

Team members can have:

Name

Email

Role

Skills

Experience

Workload

Assigned tasks

Example roles include:

Frontend Developer

Backend Developer

QA Engineer

Tester

Project Manager

9. Comments & Attachments

Defects can contain supporting collaboration information.

Comments

Used to keep discussions directly connected to the defect.

Attachments

Used to associate supporting files or evidence with an issue.

10. Activity History

Important actions can be recorded in an activity/audit history.

This improves:

Traceability

Accountability

Debugging of workflow changes

Understanding of what happened to a defect

11. AI-Assisted Bug Reporting Foundation

Milestone 1 establishes the initial AI-assisted defect analysis foundation, which is expanded significantly in Milestone 2.

## 🧠 Milestone 2 — Intelligent Defect Management ##

Milestone 2 builds on the Milestone 1 foundation and adds an intelligent engineering workflow.

The focus is:

From simply tracking defects → to helping teams understand, assign, resolve, test and verify them.

🔄 1. Controlled Defect Lifecycle

Milestone 2 introduces a clearly defined defect workflow:

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

Status definitions

Status

Meaning

Reported

A new defect has been created.

Assigned

An owner has been selected.

In Progress

Development/investigation is taking place.

In Review

The completed work is being reviewed.

Resolved

The fix has been completed.

Verified

QA/testing has validated the fix.

Closed

The defect lifecycle is complete.

This prevents uncontrolled status changes and makes the defect lifecycle easier to understand.

⭐ 2. Priority & Severity Workflow

Milestone 2 makes priority and severity meaningful parts of the defect workflow.

Priority

Critical → High → Medium → Low

Used to communicate urgency and business impact.

Severity

Critical → High → Medium → Low

Used to communicate technical/user impact.

Together they help the team decide:

What needs attention first, and how serious is the impact?

👥 3. Team Assignment & Workload Management

Milestone 2 adds actual assignment and workload visibility.

Each team member can have:

Role

Skills

Experience

Current workload

Assigned tasks

Assignment flow

Defect
  ↓
Select Team Member
  ↓
Assign Issue
  ↓
Task Added to Member
  ↓
Workload Recalculated

This helps prevent assignments from being made without considering the existing workload.

🤖 4. AI Developer / Team-Member Recommendation

One of the key Milestone 2 features is intelligent developer recommendation.

The recommendation considers information such as:

Issue title

Issue description

Category

Severity

Priority

Affected module

Team-member skills

Experience

Workload

Example

Defect:

Discount coupon validation fails during checkout.

AI recommendation:

Rahul Kumar — QA Engineer — 95% Match

Why?

The issue requires:

Validation

Regression testing

Test-case creation

Verification of checkout calculations

Rahul's QA-related skills make him a suitable candidate.

The recommendation is an AI-assisted suggestion, not an automatic final decision.

🧩 5. Semantic Duplicate Detection

Traditional duplicate detection may depend heavily on matching words.

DefectIQ introduces semantic similarity so that defects with different wording but similar meaning can be identified.

Example

Issue A

Payment button crashes during checkout.

Issue B

Checkout payment action causes the application to crash.

Although the wording is different, the underlying problem is similar.

Benefit

Reduces repeated investigation.

Helps identify existing solutions.

Saves engineering time.

Keeps the defect database cleaner.

🧠 6. AI-Assisted Defect Triage

AI can analyze the available defect context to help the team understand a newly reported issue.

The analysis can use:

Title

Description

Category

Severity

Priority

Affected module

Triage workflow

New Defect
    ↓
Understand Context
    ↓
Classify / Analyze
    ↓
Identify Relevant Information
    ↓
Support Engineering Decision

🔧 7. AI Resolution Assistance

DefectIQ provides AI-assisted resolution guidance.

The system can use the defect context to suggest:

Possible causes

Areas that may require investigation

Possible resolution approaches

Engineering considerations

The developer reviews the suggestions before applying any change.

🧪 8. AI-Generated Test Cases

Milestone 2 provides AI-generated testing assistance.

For example, for:

Discount coupon validation fails during checkout

AI can help generate scenarios such as:

TC01 — Apply a valid coupon
Expected: Correct discounted total.

TC02 — Apply an expired coupon
Expected: Coupon should be rejected.

TC03 — Apply a coupon below the minimum purchase amount
Expected: Coupon should not be applied.

TC04 — Remove an applied coupon
Expected: Original order total should be restored.

TC05 — Apply multiple/invalid coupon combinations
Expected: The system should follow the defined coupon rules.

Benefit

QA engineers can use the generated cases as a starting point for validation and regression testing.

👨‍💻 9. Recommended Developer / QA Assignment

The platform supports intelligent assignment for different engineering roles.

For example:

Development defect

A backend API defect can be matched with a backend developer based on relevant skills.

Testing defect

A defect requiring regression testing can be recommended to a QA engineer.

This makes assignment more meaningful than simply selecting the first available team member.

✅ 10. AI Resolution Verification

After a fix is completed, DefectIQ supports AI-assisted verification.

Workflow

Defect
  ↓
Resolution Assistance
  ↓
Generate Test Cases
  ↓
Fix Implemented
  ↓
Test / Validate
  ↓
AI Resolution Verification
  ↓
Verified
  ↓
Closed

The final validation remains the responsibility of the engineering/QA team.

💬 11. Comments, Attachments & Activity History

Milestone 2 strengthens collaboration around defects.

Comments

Keep technical discussion with the issue.

Attachments

Keep evidence and supporting files with the issue.

Activity History

Records meaningful changes and actions for traceability.

This creates a single source of context for the defect.

🏃 12. Sprint Planning

Milestone 2 introduces sprint-based organization of defect work.

Sprint planning helps teams

Group work into time-bound cycles.

Plan defect resolution.

Organize assigned tasks.

Improve visibility of planned work.

Connect defect management with development planning.

Workflow

Defect
   ↓
Assign
   ↓
Add to Sprint
   ↓
Plan Work
   ↓
Resolve
   ↓
Test
   ↓
Verify

🔍 13. Search & Filtering

The issue workspace supports finding relevant defects through:

Title

Description

Category

Project

Priority

This becomes especially useful as the number of tracked defects increases.

## 🔗 End-to-End Milestone 2 Workflow ## 

Milestone 2 connects the features into one complete workflow:

┌─────────┐
│ Report  │
└────┬────┘
     ↓
┌─────────┐
│ Triage  │  ← AI-assisted understanding
└────┬────┘
     ↓
┌────────────┐
│ Similarity │  ← Detect related/duplicate issues
└────┬───────┘
     ↓
┌────────┐
│ Assign │  ← Skills + experience + workload
└────┬───┘
     ↓
┌────────┐
│ Sprint │  ← Plan work
└────┬───┘
     ↓
┌─────────┐
│ Resolve │  ← AI resolution assistance
└────┬────┘
     ↓
┌────────┐
│  Test  │  ← AI-generated test cases
└────┬───┘
     ↓
┌────────┐
│ Verify │  ← Resolution verification
└────┬───┘
     ↓
┌─────────┐
│ History │  ← Full traceability
└─────────┘

## 🧑‍🔬 Human-in-the-Loop AI ## 

DefectIQ follows a human-in-the-loop approach.

AI recommendations are intended to assist engineers rather than replace engineering judgment.

AI can assist with

Triage

Similarity analysis

Resolution suggestions

Test-case generation

Team-member recommendation

Resolution verification

Humans remain responsible for

Reviewing AI output

Selecting the final assignee

Approving resolution decisions

Reviewing generated test cases

Validating fixes

Closing defects

AI accelerates the workflow; engineers make the final decisions.

## 🏗️ System Architecture ## 

                    ┌──────────────────────┐
                    │      React + Vite    │
                    │       Frontend       │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ↓
                    ┌──────────────────────┐
                    │  Node.js + Express   │
                    │       Backend        │
                    └───────┬───────┬──────┘
                            │       │
                 ┌──────────┘       └──────────┐
                 ↓                             ↓
       ┌──────────────────┐          ┌──────────────────┐
       │ MongoDB +        │          │ Gemini AI        │
       │ Mongoose         │          │ Service          │
       └──────────────────┘          └──────────────────┘

## 🛠️ Technology Stack ## 

Layer

Technology

Frontend

React.js

Build Tool

Vite

Backend

Node.js

Server Framework

Express.js

Database

MongoDB

ODM

Mongoose

API Style

REST API

AI

Google Gemini

Authentication

JWT / authentication middleware

Version Control

Git & GitHub

Development

VS Code

 ## 📁 Project Structure ## 

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
├── screenshots/
│
├── .gitignore
└── README.md 

⚙️ Installation & Setup

Prerequisites

Make sure the following are installed:

Node.js

npm

MongoDB

Git

A Gemini API key is required for AI functionality.

1. Clone the repository

git clone https://github.com/Mehak-2005/BugTrack-AI

cd BugTrack-AI

2. Install backend dependencies

cd backend
npm install

Create a .env file inside backend/:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bugtrack-ai

GEMINI_API_KEY=your_gemini_api_key

JWT_SECRET=your_secret_key

Start the backend:

npm run dev

Backend:

http://localhost:5000

3. Install frontend dependencies

Open another terminal:

cd frontend
npm install
npm run dev

Frontend:

http://localhost:5173

Your exact scripts or environment variable names may differ if they are defined differently in the project configuration.

🧪 Demonstration Scenario

A useful Milestone 2 demonstration is the following defect.

Defect

Title:
Discount coupon validation fails during checkout

Description:

During checkout, the discount coupon is applied but the final order
total does not match the expected discounted amount. The issue needs
validation against the expected calculation and regression testing
for different coupon values.

Priority: High

Severity: High

Category: Functional / Checkout

Affected Module: Checkout / Payment

AI Recommendation

Recommended Team Member
------------------------
Rahul Kumar
Role: QA Engineer
Match: 95%

Reason

The defect requires:

Calculation validation

Regression testing

Test-case creation

Checkout verification

Rahul's QA skills make him a strong candidate.

Demonstration Flow

Create Defect
     ↓
AI Triage
     ↓
Check Similar Defects
     ↓
Recommend Team Member
     ↓
Assign Rahul Kumar
     ↓
Add to Sprint
     ↓
Generate Test Cases
     ↓
Resolve Defect
     ↓
Verify Resolution
     ↓
Close Defect

🔐 Security & Configuration

Never commit secrets to GitHub.

Your .gitignore should include:

node_modules/
.env
.env.*

Keep API keys, database credentials and JWT secrets inside environment variables.

📸 Screenshots

The repository contains a screenshots/ directory for application screenshots.

Recommended screenshots for documentation:

Dashboard

Projects

Issues

Create Issue

Team Members

Assigned Tasks

Sprint Planning

AI Developer Recommendation

AI Resolution Assistance

Generated Test Cases

Resolution Verification

Activity History

## 🔮 Future Scope — Milestone 3 ## 

The planned next stage can extend DefectIQ with:

📊 Analytics & Metrics

Defect trends

Resolution-time metrics

Team workload analytics

Sprint performance

Priority/severity distribution

Quality dashboards

🔁 CI/CD Integration

Pipeline integration

Automated defect creation from build/test failures

Test failure tracking

Continuous quality monitoring

🤖 Advanced AI

AI code review

AI fix suggestions

Improved root-cause analysis

Intelligent defect prioritization

Historical defect learning

📈 Project Status

Milestone 1  ████████████████████ 100%  ✅

Milestone 2  ████████████████████ 100%  ✅

Milestone 3  ░░░░░░░░░░░░░░░░░░░░ Planned

## 👩‍💻 Author ## 

Mehak
BE — Computer Science Engineering

Project: DefectIQ — Intelligent Defect Management System
Repository: BugTrack-AI

<div align="center">

🐞 DefectIQ

Track smarter. Collaborate better. Resolve faster.

</div>
