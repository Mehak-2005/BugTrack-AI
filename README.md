## 🐞 DefectIQ — Intelligent Defect Management System ##

AI-powered defect tracking, team collaboration, sprint planning, and intelligent resolution assistance.

DefectIQ is a full-stack software defect management platform designed to help development and QA teams manage the complete defect lifecycle from reporting to verification.

The project is developed incrementally through milestones.

## Milestone ## 

Focus

Status

 Milestone 1 

Core defect-management foundation

✅ Completed

Milestone 2

Intelligent defect management, team workflow, sprint planning, and AI assistance

✅ Completed

Milestone 3

Analytics, CI/CD, AI code review, and AI fix suggestions

🔜 Planned

📌 Table of Contents

Project Overview

Problem Statement

Objectives

Key Features

Milestone 1

Milestone 2

End-to-End Workflow

AI Features

Technology Stack

System Architecture

Project Structure

Installation and Setup

Environment Variables

Running the Application

Demo Workflow

Screenshots

Milestone Comparison

Future Scope

Project Status

Author

## 📖 Project Overview ## 

DefectIQ provides a centralized workspace where software teams can:

Create and manage software defects

Organize defects by category, priority, and severity

Track defects through a controlled lifecycle

Manage team members, skills, experience, and workload

Assign defects to suitable team members

Plan defect-related work using sprints

Add comments and attachments

Maintain an activity and audit history

Search and filter defects

Use AI to understand, classify, compare, resolve, test, and verify defects

The goal is to move beyond a basic bug tracker and provide an intelligent engineering workflow.

## 🎯 Problem Statement ## 

Traditional defect tracking systems often require developers, testers, and project managers to perform many activities manually.

Common challenges include:

Unstructured defect reports

Manual priority and severity decisions

Difficulty identifying duplicate defects

Repeated investigation of similar issues

Difficulty selecting the right team member for a defect

Limited visibility into team workload

Manual sprint planning

Time-consuming test-case preparation

Limited assistance during defect resolution

Poor traceability across the defect lifecycle

DefectIQ addresses these challenges by combining structured defect management, team collaboration, workflow management, and AI-assisted engineering features in one platform.

## 🎯 Objectives ##

The main objectives of DefectIQ are to:

Provide a centralized defect-management workspace.

Create a controlled and traceable defect lifecycle.

Separate priority and severity for better defect classification.

Improve collaboration between developers, QA engineers, testers, and project managers.

Manage team members using role, skills, experience, and workload.

Support sprint-based defect planning.

Use AI to assist with defect triage and understanding.

Detect semantically similar or duplicate defects.

Provide AI-assisted resolution guidance.

Generate useful test cases from defect information.

Recommend suitable developers or team members.

Verify whether a proposed resolution addresses the defect.

Maintain an activity history for traceability.

## 🚀 Key Features ## 

🐞 Defect Management

Structured issue creation

Defect title and description

Project association

Category classification

Affected module information

Priority management

Severity management

Status-based defect views

Search and filtering

Defect lifecycle tracking

👥 Team Management

Add and manage team members

Role-based team information

Skill tracking

Experience tracking

Workload tracking

Assigned-task visibility

Team-member task assignment

🔄 Workflow Management 

Controlled defect lifecycle

Status transitions

Assignment workflow

Sprint planning

Resolution workflow

Testing and verification

Activity history and traceability

🤝 Collaboration

Comments on defects

Attachments

Activity history

Assigned-task visibility

Team workload visibility

🤖 AI-Assisted Engineering

AI defect analysis

AI-assisted triage

Semantic duplicate detection

AI resolution assistance

AI-generated test cases

Developer/team-member recommendation

AI resolution verification

## 🏗️ Milestone 1 — Core Defect Management Foundation ## 

Status: ✅ Completed

Milestone 1 established the foundation of DefectIQ.

The focus was on creating a structured platform where projects, team members, and defects could be managed in a centralized workspace.

1. Authentication and User Access

Milestone 1 provides the basic user-access foundation required for the application.

Users can access the system through the authentication flow and work with their project and defect data.

2. Project Management

Projects provide the organizational structure for defects.

The system supports:

Project creation

Project information

Project-based defect organization

Project association with issues

This allows defects to be managed within the correct project context.

3. Dashboard

The dashboard provides a centralized overview of project and defect information.

It helps users understand the current state of the system without opening every individual defect.

4. Defect / Issue Creation

Users can create structured defects with information such as:

Title

Description

Project

Category

Priority

Severity

Affected module

This converts an unstructured bug report into a manageable engineering issue.

5. Priority and Severity

DefectIQ treats priority and severity as separate concepts.

Priority

Priority represents the business importance and urgency of the defect.

Supported levels include:

Critical

High

Medium

Low

Severity

Severity represents the technical or user impact of the defect.

Supported levels include:

Critical

High

Medium

Low

Keeping these values separate gives teams more flexibility when deciding which defects require immediate attention.

6. Defect Search and Filtering

The issues workspace supports searching and filtering defects using information such as:

Title

Description

Category

Project

Priority

This becomes increasingly useful as the number of tracked defects grows.

7. Team Member Management

The platform stores important information about team members, including:

Name

Email

Role

Skills

Experience

Workload

This information becomes important for intelligent assignment in Milestone 2.

8. Comments

Comments allow team members to communicate within the context of a defect.

This helps keep technical discussion connected to the issue instead of spreading information across different communication channels.

9. Attachments

Defects can contain supporting attachments.

Attachments can provide additional context such as:

Screenshots

Documents

Supporting files

Evidence related to the defect

10. Activity History

Important issue actions are recorded in activity history.

This provides traceability and helps users understand what happened to a defect over time.

11. Milestone 1 Result

At the end of Milestone 1, DefectIQ provided a structured foundation for:

Projects → Defects → Team Members → Collaboration → Activity Tracking

This foundation enabled the intelligent workflow introduced in Milestone 2.

## 🧠 Milestone 2 — Intelligent Defect Management ## 

Status: ✅ Completed

Milestone 2 extends the foundation of DefectIQ by connecting defect management, team workflow, sprint planning, and AI-assisted engineering.

The main transformation is:

From simple bug tracking → to intelligent defect management.

1. Controlled Defect Lifecycle

Defects move through a structured lifecycle:

Reported → Assigned → In Progress → In Review → Resolved → Verified → Closed

Reported

A new defect is created and recorded.

Assigned

An appropriate team member becomes responsible for the issue.

In Progress

Development or testing work begins.

In Review

The completed work is reviewed.

Resolved

The fix has been completed.

Verified

The fix has been validated.

Closed

The defect lifecycle is complete.

This controlled lifecycle improves consistency and traceability.

2. Assignment and Workload Management

Milestone 2 introduces team-aware assignment.

Team members have information such as:

Role

Skills

Experience

Current workload

Assigned tasks

The system can use this information when recommending a suitable person for a defect.

This helps avoid assigning work without considering the person's responsibilities or expertise.

3. Sprint Planning

Defects can be organized into sprint-based work.

Sprint planning helps teams:

Select work for a sprint

Organize defect-related tasks

Track planned work

Manage sprint status

This connects individual defects with a broader development workflow.

4. AI-Assisted Defect Triage

AI analyzes the information contained in a defect to help the engineering team understand it.

The AI workflow can consider:

Title

Description

Category

Severity

Priority

Affected module

The goal is to transform a raw defect report into more actionable engineering information.

5. Semantic Duplicate Detection

DefectIQ can identify defects that are semantically similar rather than relying only on exact text matches.

This helps reduce:

Duplicate investigation

Repeated debugging

Redundant issue creation

The system can use related defect history to provide additional context.

6. AI Resolution Assistance

The platform provides AI-assisted guidance for resolving defects.

The AI can analyze the defect context and provide:

Possible causes

Suggested resolution approaches

Engineering guidance

Relevant reasoning based on the available issue information

The purpose is to assist developers rather than automatically make the final engineering decision.

7. AI-Generated Test Cases

DefectIQ can generate test cases from defect information.

Generated tests can help QA engineers validate:

The reported scenario

The expected behavior

The corrected behavior

Related regression scenarios

This reduces the amount of manual preparation required for common validation tasks.

8. AI Developer Recommendation

One of the important Milestone 2 features is intelligent developer/team-member recommendation.

The recommendation considers:

Defect title

Description

Category

Severity

Priority

Affected module

Team-member skills

Team-member experience

Current workload

The system returns a recommended team member along with an explanation of why that person is a suitable match.

Example

A defect involving checkout coupon validation may require strong testing and test-case skills.

If Rahul Kumar is a QA Engineer with:

Manual Testing

Selenium

API Testing

Test Case Design

the AI can recommend Rahul as a suitable person for the defect.

9. AI Resolution Verification

After a resolution is proposed, the system can assist in verifying the resolution.

Verification can help determine whether:

The proposed resolution addresses the reported issue

The expected behavior is covered

Additional validation may be required

This creates an important connection between:

Resolution → Testing → Verification

10. Search and Filtering

Milestone 2 continues the issue-search functionality and makes it more useful for larger defect collections.

Users can locate relevant defects using searchable issue information and available filters.

11. Activity and Audit Traceability

Milestone 2 strengthens traceability by recording meaningful workflow actions.

This allows teams to understand:

Who performed an action

What happened

When the action occurred

How the defect moved through its lifecycle

## 🔗 End-to-End Workflow ## 

Milestone 2 connects the individual features into one engineering workflow:

Report
↓
Create defect

Triage
↓
AI-assisted understanding

Similarity
↓
Find related or duplicate defects

Assignment
↓
Use skills, experience, and workload

Sprint
↓
Plan the work

Resolve
↓
Use AI-assisted resolution guidance

Test
↓
Generate and execute validation scenarios

Verify
↓
Confirm the resolution

History
↓
Maintain traceability

## Final Outcome ## 

A defect becomes an actionable engineering workflow instead of remaining only as a bug record.

🤖 AI Features

DefectIQ uses AI as an engineering assistant.

AI Pipeline

The Milestone 2 AI flow can be summarized as:

Defect Report → Triage → Similarity → Resolution → Test Generation → Verification

AI Capabilities

AI Feature

Purpose

AI Defect Analysis

Understand defect information

AI Triage

Assist with defect classification and understanding

Semantic Similarity

Find related or duplicate issues

Resolution Assistance

Suggest possible causes and fixes

Test Generation

Generate test scenarios from defects

Developer Recommendation

Match defects with suitable team members

Resolution Verification

Assist in validating proposed resolutions

👤 Human-in-the-Loop AI

DefectIQ follows a human-in-the-loop approach.

AI recommendations are intended to assist engineers rather than replace engineering judgment.

The final decision remains with the responsible developer, tester, QA engineer, or project manager.

AI assists with:

Understanding defects

Finding similar issues

Suggesting possible resolutions

Generating test cases

Recommending suitable team members

Supporting verification

Humans remain responsible for:

Reviewing recommendations

Modifying suggested actions

Approving assignments

Implementing fixes

Validating test results

Making the final engineering decision

## 🛠️ Technology Stack ## 

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

Gemini-based AI service integration

Development Tools

Visual Studio Code

Git

GitHub

npm

## 🏛️ System Architecture ## 

DefectIQ follows a full-stack architecture:

React Frontend
       │
       │ REST API
       ▼
Express.js Backend
       │
       ├── Controllers
       ├── Routes
       ├── Middleware
       └── Services
       │
       ├──────────────► MongoDB
       │
       └──────────────► Gemini AI

Frontend

Responsible for:

User interface

Dashboards

Issue management

Team management

Sprint management

AI result presentation

Backend

Responsible for:

API endpoints

Authentication

Business logic

Issue management

Team assignment

Sprint operations

AI service integration

Database

MongoDB stores application information such as:

Users

Projects

Issues

Team members

Sprints

Comments

Attachments

Activity records

AI Service

The Gemini service provides AI-assisted capabilities such as:

Defect analysis

Resolution assistance

Test generation

Developer recommendation

Resolution verification

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
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
│
├── screenshots/
│
├── .gitignore
├── README.md
└── package files

## ⚙️ Installation and Setup ##

Prerequisites

Make sure the following are installed:

Node.js

npm

MongoDB

Git

A Gemini API key for AI functionality

1. Clone the Repository

git clone https://github.com/Mehak-2005/BugTrack-AI.git

cd BugTrack-AI

2. Install Backend Dependencies

cd backend

npm install

3. Install Frontend Dependencies

Open another terminal:

cd frontend

npm install

4. Configure Environment Variables

Create a .env file inside the backend directory.

Example:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/defectiq

GEMINI_API_KEY=your_gemini_api_key

JWT_SECRET=your_secret_key

Use your actual values in the local environment.

Never commit API keys, passwords, or secrets to GitHub.

## ▶️ Running the Application ## 

Start MongoDB

Make sure your local MongoDB service is running.

Start Backend

From the backend directory:

npm start

or, if the project uses a development script:

npm run dev

The backend runs on the configured port, for example:

http://localhost:5000

Start Frontend

From the frontend directory:

npm run dev

Vite will provide a local development URL, commonly:

http://localhost:5173

Open the displayed URL in your browser.

## 🧪 Demo Workflow ## 

The following scenario can be used to demonstrate Milestone 2 to a mentor.

Sample Defect

Title:

Discount coupon validation fails during checkout

Description:

During checkout, the discount coupon is applied but the final order total does not match the expected discounted amount. The issue requires validation against the expected calculation and regression testing for different coupon values.

Category:

Functional

Priority:

High

Severity:

High

Affected Module:

Checkout / Coupon Validation

Expected AI Workflow

Step 1 — Create Defect

Create the issue using the sample information.

Step 2 — Analyze the Defect

Use the AI analysis functionality to understand and classify the issue.

Step 3 — Find Similar Issues

Use semantic similarity to check whether related coupon or checkout defects already exist.

Step 4 — Recommend a Team Member

Use Recommend Developer.

For a QA-oriented defect, the system can identify a team member whose skills and workload make them suitable.

Step 5 — Assign the Defect

Assign the recommended team member.

Step 6 — Add to Sprint

Place the issue into the appropriate sprint.

Step 7 — Generate Test Cases

Use Generate Test Cases to create validation scenarios for different coupon values and checkout conditions.

Step 8 — Resolve

Use the AI Resolution feature for possible causes and resolution guidance.

Step 9 — Verify Resolution

Use Verify Resolution after the fix to assist with validating whether the defect has been addressed.

Step 10 — Check Activity History

Open Activity History to demonstrate the traceability of the defect throughout the workflow.

## 📸 Screenshots ## 

Project screenshots can be stored in the screenshots/ directory.

Recommended screenshots for the GitHub repository include:

Dashboard

Project Management

Issue Creation

Issues Board

Team Members

Assigned Tasks

Sprint Planning

AI Defect Analysis

Recommended Developer

AI Resolution Assistance

Generated Test Cases

Resolution Verification

Activity History

Example Markdown:

![Dashboard](screenshots/dashboard.png)


## 📈 What Milestone 2 Adds ## 

Before Milestone 2

The platform provided a structured foundation for creating and managing projects, defects, teams, and collaboration.

After Milestone 2

The platform becomes a more complete engineering workflow with:

Controlled defect lifecycle

Team-aware assignment

Workload visibility

Sprint planning

AI-assisted triage

Semantic similarity detection

Resolution assistance

Test-case generation

Developer recommendation

Resolution verification

Stronger traceability

Engineering Value

Milestone 2 aims to provide:

Less manual triage

Less duplicate investigation

Better team-member matching

Faster defect understanding

Faster resolution assistance

Better validation

Stronger defect traceability

## 🔮 Future Scope — Milestone 3 ## 

Milestone 3 is planned to extend DefectIQ with additional engineering intelligence.

Planned areas include:

Analytics and engineering metrics

CI/CD integration

AI code review

AI fix suggestions

Advanced project insights

Additional automation around the defect lifecycle

These features are planned future enhancements and are not represented as completed Milestone 1 or Milestone 2 functionality.

## 🔐 Security Notes ## 

Keep API keys in environment variables.

Do not commit .env files.

Do not expose database credentials.

Use .gitignore for sensitive configuration.

Authentication and authorization should be enforced on protected API routes.

## 📌 Project Status ## 

Area

Status

Milestone 1

✅ Completed

Milestone 2

✅ Completed

Milestone 3

🔜 Planned

Frontend

✅ Implemented

Backend

✅ Implemented

MongoDB Integration

✅ Implemented

Gemini AI Integration

✅ Implemented

## 👩‍💻 Author ## 

Mehak

Computer Science Engineering Student

GitHub: Mehak-2005

## ⭐ Project Summary ## 

DefectIQ transforms traditional defect tracking into an intelligent engineering workflow.

It combines:

Defect Management + Team Collaboration + Sprint Planning + AI Assistance + Testing + Verification + Traceability

The completed Milestone 1 and Milestone 2 provide the foundation for evolving DefectIQ into a more intelligent software engineering platform.
