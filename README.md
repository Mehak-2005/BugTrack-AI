🐞 DefectIQ — Intelligent Defect Management System

<p align="center">
<b>AI-powered defect tracking, team collaboration, sprint planning, and
intelligent resolution assistance.</b>
</p>
<p align="center">
<img src="https://img.shields.io/badge/Milestone%201-Completed-success?style=for-the-badge" alt="Milestone 1">
<img src="https://img.shields.io/badge/Milestone%202-Completed-success?style=for-the-badge" alt="Milestone 2">
<img src="https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
<img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
<img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
<img src="https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini">
</p>

📌 Table of Contents

About the Project

Problem Statement

Objectives

Key Features

Milestone 1

Milestone 2

AI Features

Defect Lifecycle

Technology Stack

Project Structure

Installation & Setup

Demo Scenario

Future Scope

Project Status

Author

🚀 About the Project

DefectIQ is a full-stack, AI-assisted software defect management
platform designed to manage the complete software defect lifecycle in
one centralized workspace.

The platform goes beyond basic bug tracking by combining:

Defect Reporting → Triage → Similarity Detection → Assignment →
Sprint Planning → Resolution → Testing → Verification → History

The project is being developed in milestones.

Milestone

Description

Status

Milestone 1

Core defect-management foundation

✅ Completed

Milestone 2

Intelligent workflow, team collaboration and AI-assisted engineering

✅ Completed

Milestone 3

Analytics, CI/CD, AI code review and AI fix suggestions

🔜 Planned

🎯 Problem Statement

Traditional defect tracking systems often require teams to perform many
activities manually.

Common problems

Bug reports may be incomplete or unclear.

Priority and severity decisions can be inconsistent.

Similar or duplicate defects may require repeated investigation.

Selecting the right developer or QA engineer can be difficult.

Team workload may not be visible while assigning defects.

Preparing test cases can take additional time.

Resolution and verification activities may not be fully traceable.

💡 Proposed Solution

DefectIQ provides a centralized workspace that helps teams:

Create structured defects.

Organize and prioritize issues.

Manage the complete defect lifecycle.

Collaborate through comments and attachments.

Manage team skills, experience and workload.

Plan defect work using sprints.

Use AI for triage, similarity analysis, resolution assistance, test
generation and developer recommendation.

AI provides recommendations and assistance. The final engineering
decision remains with the human team member.

🎯 Objectives

Provide a centralized workspace for software defect management.

Create a controlled and traceable defect lifecycle.

Manage priority and severity separately.

Improve collaboration using comments, attachments and activity
history.

Manage team members using role, skills, experience and workload.

Organize defect-related work into sprints.

Reduce manual effort using AI-assisted engineering features.

Support QA engineers with AI-generated test cases and verification
assistance.

Recommend suitable team members based on issue requirements and team
information.

✨ Key Features

🐞 Defect Management

Structured issue creation

Issue title and description

Category and affected module

Priority and severity

Project association

Status tracking

Search and filtering

Open and resolved issue views

👥 Team Management

Team member profiles

Role-based information

Skills and experience

Workload tracking

Assigned task visibility

Issue assignment

Team-member removal

🔄 Workflow Management

Controlled defect lifecycle

Assignment workflow

In-progress tracking

Review and resolution stages

Verification and closure

Activity/audit history

💬 Collaboration

Comments

Attachments

Issue-specific activity history

Centralized defect context

🏃 Sprint Planning

Create and organize sprints

Plan time-bound defect work

Associate work with sprint planning

Track sprint-related tasks

🤖 AI-Assisted Engineering

AI defect triage

Semantic duplicate detection

AI resolution assistance

AI-generated test cases

AI developer recommendation

AI resolution verification

🏗️ Milestone 1 — Core Foundation

Milestone 1 established the basic defect-management foundation required
for the platform.

Main capabilities

1. Project Management

Projects provide a structured workspace for organizing software defects.

2. Issue Management

Users can create and manage defects with structured information such as:

Title

Description

Category

Priority

Severity

Project

Status

Reporter

Affected module

3. Dashboard & Issue Views

The system provides an organized view of issues, including searching,
filtering and status-based organization.

4. Team Management

Team members can be maintained with information such as:

Name

Role

Skills

Experience

Workload

Assigned tasks

5. Authentication

Authenticated users can access protected project and issue
functionality.

6. Collaboration

Comments, attachments and activity history provide centralized issue
context.

7. Initial AI Assistance

The foundation for AI-powered bug analysis was established.

🧠 Milestone 2 — Intelligent Defect Management

Milestone 2 extends the foundation into a more intelligent and
collaborative engineering workflow.

What Milestone 2 adds

Area

Milestone 2 Capability

Workflow

Controlled defect lifecycle

Priority

Structured priority handling

Severity

Structured severity handling

Team

Assignment and workload visibility

Sprint

Sprint planning

AI

Triage and intelligent analysis

Similarity

Semantic duplicate detection

Resolution

AI resolution assistance

QA

AI-generated test cases

Assignment

AI developer recommendation

Verification

AI-assisted resolution verification

Traceability

Activity/audit history

🔄 Defect Lifecycle

DefectIQ uses a controlled lifecycle:

┌──────────┐
│ Reported │
└────┬─────┘
     ↓
┌──────────┐
│ Assigned │
└────┬─────┘
     ↓
┌────────────┐
│ In Progress│
└────┬───────┘
     ↓
┌──────────┐
│ In Review│
└────┬─────┘
     ↓
┌──────────┐
│ Resolved │
└────┬─────┘
     ↓
┌──────────┐
│ Verified │
└────┬─────┘
     ↓
┌────────┐
│ Closed │
└────────┘

Status meaning

Status

Meaning

Reported

A new defect has been created.

Assigned

An owner has been selected.

In Progress

Investigation or development work is ongoing.

In Review

The completed fix is being reviewed.

Resolved

The fix has been completed.

Verified

QA/testing has validated the fix.

Closed

The defect lifecycle is complete.

⭐ Priority vs Severity

DefectIQ treats priority and severity as separate values.

Priority — How urgent is the issue?

Critical

High

Medium

Low

Severity — How serious is the impact?

Critical

High

Medium

Low

This separation helps the team understand both:

Business urgency and technical/user impact.

👥 Team Assignment & Workload

Milestone 2 improves assignment by maintaining team-member information.

The system considers:

Role

Skills

Experience

Current workload

Assigned tasks

This information supports both manual assignment and AI-assisted
developer/team-member recommendation.

Example

Issue:
Discount coupon validation fails during checkout

Recommended:
Rahul Kumar

Role:
QA Engineer

AI Match:
95%

The issue requires validation, regression testing and test-case
creation, making a QA engineer a suitable candidate.

🏃 Sprint Planning

Sprint planning allows defect-related work to be organized into
time-bound development cycles.

Benefits

Organizes work

Helps teams plan defect resolution

Provides visibility into sprint tasks

Connects issue management with development planning

🤖 AI Features

The AI layer is integrated through the project’s Gemini service.

1. AI Defect Triage

The AI analyzes available defect information such as:

Title

Description

Category

Severity

Priority

Affected module

The goal is to help the team understand and classify defects faster.

2. Semantic Duplicate Detection

The system can identify defects that have similar meaning even when the
wording is different.

Example

Existing defect

Payment button crashes during checkout.

New defect

Checkout payment action causes the application to crash.

The AI can identify that the two reports may describe the same
underlying problem.

Benefit

Less duplicate investigation and faster defect handling.

3. AI Resolution Assistance

The AI can provide suggestions that help developers understand:

Possible causes

Areas to investigate

Possible resolution approaches

The suggestions are reviewed by engineers before being used.

4. AI-Generated Test Cases

AI can generate test scenarios from a defect.

Example: Discount Coupon Defect

TC01 — Apply a valid coupon
Expected: Correct discounted total

TC02 — Apply an expired coupon
Expected: Coupon should be rejected

TC03 — Apply coupon with minimum purchase condition
Expected: Correct eligibility and calculation

TC04 — Remove coupon
Expected: Original total should be restored

This helps QA engineers prepare validation and regression scenarios more
efficiently.

5. AI Developer Recommendation

The system can recommend a suitable team member using:

Issue title

Issue description

Category

Severity

Priority

Affected module

Team member skills

Experience

Workload

Demonstration Result

Rahul Kumar
QA Engineer
95% Match

The recommendation explains why the member is suitable instead of simply
selecting a person randomly.

6. AI Resolution Verification

After a defect is resolved, AI-assisted verification can help check
whether the proposed resolution addresses the original issue.

Defect
  ↓
Resolution Assistance
  ↓
Generate Test Cases
  ↓
Validate Fix
  ↓
Verify Resolution
  ↓
Close Defect

🧑‍💻 Human-in-the-Loop Approach

DefectIQ does not treat AI output as an automatic final decision.

The engineering team remains responsible for:

Reviewing recommendations

Selecting the final assignee

Reviewing resolution suggestions

Reviewing generated test cases

Validating the fix

Confirming the final status

AI accelerates engineering work while humans retain control over the
final decision.

🔗 End-to-End Workflow

REPORT
   ↓
TRIAGE
   ↓
SIMILARITY
   ↓
ASSIGN
   ↓
SPRINT
   ↓
RESOLVE
   ↓
TEST
   ↓
VERIFY
   ↓
HISTORY

Result

A raw defect is transformed into an actionable engineering workflow:

Understood → Prioritized → Assigned → Planned → Resolved → Tested →
Verified → Traced

🛠️ Technology Stack

Layer

Technologies

Frontend

React.js, Vite, JavaScript, HTML, CSS

Backend

Node.js, Express.js

API

REST APIs

Database

MongoDB

ODM

Mongoose

AI

Google Gemini API

Authentication

Authentication middleware

Development

VS Code, npm

Version Control

Git, GitHub

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
├── screenshots/
│
├── .gitignore
└── README.md

⚙️ Installation & Setup

Prerequisites

Install:

Node.js

npm

MongoDB

Git

You will also need a Gemini API key for the AI features.

1. Clone the Repository

git clone https://github.com/Mehak-2005/BugTrack-AI.git
cd BugTrack-AI

2. Backend Setup

cd backend
npm install

Create a .env file in the backend folder.

Example:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bugtrack-ai
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_secret_key

Start the backend:

npm run dev

Backend runs on:

http://localhost:5000

3. Frontend Setup

Open a new terminal:

cd frontend
npm install
npm run dev

Vite will provide the frontend URL, normally:

http://localhost:5173

🔐 Environment Variables

Do not commit API keys, passwords or secrets.

Add the following to .gitignore:

node_modules/
.env
.env.*

🧪 Demo Scenario

A recommended Milestone 2 demonstration is a checkout coupon defect.

Issue Title

Discount coupon validation fails during checkout

Description

During checkout, the discount coupon is applied but the final order
total does not match the expected discounted amount. The issue needs
validation against the expected calculation and regression testing
for different coupon values.

Expected Recommendation

Rahul Kumar
QA Engineer
95% Match

Demo flow

Create Issue
      ↓
Open Issue
      ↓
Recommend Developer
      ↓
AI recommends Rahul Kumar
      ↓
Assign Issue
      ↓
Generate Test Cases
      ↓
Resolve Defect
      ↓
Verify Resolution
      ↓
Update Status

📸 Screenshots

Project screenshots are available in the screenshots
folder.

Suggested screenshots include:

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

🔮 Future Scope — Milestone 3

The next milestone is planned to extend DefectIQ with:

📊 Analytics & Metrics

Defect trends

Resolution time

Team workload metrics

Sprint performance

Priority/severity distribution

🔁 CI/CD Integration

Pipeline integration

Automated defect creation from failures

Build and test failure tracking

🤖 Advanced AI

AI code review

AI fix suggestions

Root-cause assistance

Improved defect prioritization

Historical defect analysis

📈 Engineering Intelligence

Defect prediction

Resolution-time prediction

Team capacity insights

Quality metrics

📊 Project Status

Phase

Status

Milestone 1 — Core Foundation

✅ COMPLETED

Milestone 2 — Intelligent Defect Management

✅ COMPLETED

Milestone 3 — Advanced Analytics & AI

🔜 PLANNED

👩‍💻 Author

Mehak
BE — Computer Science Engineering

Project: DefectIQ — Intelligent Defect Management System
Repository: BugTrack-AI

⭐ Project Highlights

Milestone 1

Built the core defect-management foundation.

Milestone 2

Added intelligent workflows, team collaboration, sprint planning and
AI-assisted engineering features.

Milestone 3

Planned to add analytics, CI/CD integration, AI code review and AI fix
suggestions.

<div align="center">

🐞 DefectIQ

Track smarter. Collaborate better. Resolve faster.

</div>
