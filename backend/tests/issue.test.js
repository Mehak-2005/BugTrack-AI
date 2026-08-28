const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
jest.setTimeout(30000);
const issueRoutes = require("../routes/issueRoutes");
const User = require("../models/User");
const Issue = require("../models/Issue");
const TeamMember = require("../models/TeamMember");


// ========================================
// MOCK EMBEDDING SERVICE
// ========================================

jest.mock("../services/embeddingService", () => ({
  generateEmbedding: jest.fn(async () => [0.1, 0.2, 0.3]),
  cosineSimilarity: jest.fn(() => 0.5),
}));

// ========================================
// EXPRESS TEST APP
// ========================================

const app = express();
const TEST_DB_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bugtrack_test";

app.use(express.json());
app.use("/api/issues", issueRoutes);


let token;
let userId;

// ========================================
// SETUP BEFORE ALL TESTS
// ========================================
beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret-key";

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_DB_URI, {
      serverSelectionTimeoutMS: 30000,
    });
  }
  // Create test user
  const user = await User.create({
    name: "Test User",
    email: "testuser@example.com",
    password: "hashedpassword",
  });

  userId = user._id;
  // Generate JWT token
  token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
},30000);

// ========================================
// CLEAN DATABASE AFTER EACH TEST
// ========================================

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    await Issue.deleteMany({});
    await TeamMember.deleteMany({});
  }
});

  // Keep the main test user

// ========================================
// CLOSE DATABASE
// ========================================

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
});

// ========================================
// ISSUE CREATION TESTS
// ========================================

describe("Issue Creation Tests", () => {
  // ----------------------------------------
  // CREATE ISSUE SUCCESSFULLY
  // ----------------------------------------

  test("Should create a new issue successfully", async () => {
    const response = await request(app)
      .post("/api/issues")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Login page error",
        description:
          "The application crashes when clicking the login button",
        priority: "High",
        severity: "High",
        category: "Authentication",
        defectType: "Functional",
        status: "Open",
      });

    expect(response.statusCode).toBe(201);

    expect(response.body).toBeDefined();
    expect(response.body._id).toBeDefined();

    expect(response.body.title).toBe("Login page error");

    expect(response.body.description).toBe(
      "The application crashes when clicking the login button"
    );
  });

  // ----------------------------------------
  // CREATE ISSUE WITHOUT DESCRIPTION
  // ----------------------------------------

  test("Should reject issue creation without description", async () => {
    const response = await request(app)
      .post("/api/issues")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Login page error",
        priority: "High",
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.message).toBe("Description is required");
  });

  // ----------------------------------------
  // CREATE ISSUE WITH INVALID STATUS
  // ----------------------------------------

  test("Should reject issue creation with invalid status", async () => {
    const response = await request(app)
      .post("/api/issues")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Invalid status issue",
        description: "Testing invalid status validation",
        status: "Invalid Status",
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.message).toBe("Invalid status");
  });

  // ----------------------------------------
  // CREATE ISSUE WITH INVALID PRIORITY
  // ----------------------------------------

  test("Should reject issue creation with invalid priority", async () => {
    const response = await request(app)
      .post("/api/issues")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Invalid priority issue",
        description: "Testing invalid priority validation",
        priority: "Very Urgent",
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.message).toBe("Invalid priority");
  });

  // ----------------------------------------
  // CREATE ISSUE WITHOUT AUTHENTICATION
  // ----------------------------------------

  test(
    "Should reject issue creation without authentication token",
    async () => {
      const response = await request(app)
        .post("/api/issues")
        .send({
          title: "Unauthorized issue",
          description:
            "This request does not contain a JWT token",
        });

      expect(response.statusCode).toBe(401);
    }
  );
});

// ========================================
// PERMISSION TESTS
// ========================================

describe("Permission Tests", () => {
  test("Should not allow another user to update an issue", async () => {
    // Create issue using original user
    const createResponse = await request(app)
      .post("/api/issues")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Permission Test Issue",
        description:
          "Testing whether another user can update this issue",
        priority: "High",
        severity: "High",
        category: "Authentication",
        defectType: "Functional",
        status: "Open",
      });

    expect(createResponse.statusCode).toBe(201);

    const issueId = createResponse.body._id;

    // Create another user
    const anotherUser = await User.create({
      name: "Another User",
      email: "anotheruser@example.com",
      password: "hashedpassword",
    });

    // Generate token for another user
    const anotherUserToken = jwt.sign(
      {
        id: anotherUser._id,
        name: anotherUser.name,
        email: anotherUser.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Try to update original user's issue
    const updateResponse = await request(app)
      .put(`/api/issues/${issueId}`)
      .set("Authorization", `Bearer ${anotherUserToken}`)
      .send({
        status: "In Progress",
      });

    expect(updateResponse.statusCode).toBe(404);

    expect(updateResponse.body.message).toBe(
      "Issue not found or you do not have permission to update it"
    );
  });

  test(
    "Should not allow another user to access an issue they do not own",
    async () => {
      // Create issue using original user
      const createResponse = await request(app)
        .post("/api/issues")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Private Issue",
          description: "This issue belongs to the original user",
          priority: "Medium",
          severity: "Medium",
          category: "Authentication",
          defectType: "Functional",
          status: "Open",
        });

      expect(createResponse.statusCode).toBe(201);

      const issueId = createResponse.body._id;

      // Create another user
      const anotherUser = await User.create({
        name: "Unauthorized User",
        email: "unauthorized@example.com",
        password: "hashedpassword",
      });

      // Generate JWT for another user
      const anotherUserToken = jwt.sign(
        {
          id: anotherUser._id,
          name: anotherUser.name,
          email: anotherUser.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      // Try to update the issue
      const response = await request(app)
        .put(`/api/issues/${issueId}`)
        .set("Authorization", `Bearer ${anotherUserToken}`)
        .send({
          priority: "Critical",
        });

      expect(response.statusCode).toBe(404);

      expect(response.body.message).toBe(
        "Issue not found or you do not have permission to update it"
      );
    }
  );
});

// ========================================
// RESOLUTION WORKFLOW TESTS
// ========================================

describe("Resolution Workflow Tests", () => {
  test("Should complete the full issue resolution workflow", async () => {
    // ========================================
    // CREATE ISSUE
    // ========================================

    const createResponse = await request(app)
      .post("/api/issues")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Resolution Workflow Issue",
        description: "Testing the complete resolution workflow",
        priority: "High",
        severity: "High",
        category: "Authentication",
        defectType: "Functional",
        status: "Open",
      });

    expect(createResponse.statusCode).toBe(201);

    const issueId = createResponse.body._id;

    // ========================================
    // OPEN → IN PROGRESS
    // ========================================

    let response = await request(app)
      .put(`/api/issues/${issueId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "In Progress",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.issue.status).toBe("In Progress");

    // ========================================
    // IN PROGRESS → IN REVIEW
    // ========================================

    response = await request(app)
      .put(`/api/issues/${issueId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "In Review",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.issue.status).toBe("In Review");

    // ========================================
    // IN REVIEW → RESOLVED
    // ========================================

    response = await request(app)
      .put(`/api/issues/${issueId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "Resolved",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.issue.status).toBe("Resolved");

    // Check resolution timestamp
    expect(response.body.issue.resolvedAt).toBeDefined();
    expect(response.body.issue.resolvedAt).not.toBeNull();

    // ========================================
    // RESOLVED → CLOSED
    // ========================================

    response = await request(app)
      .put(`/api/issues/${issueId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "Closed",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.issue.status).toBe("Closed");
  });

  test("Should reject an invalid status transition", async () => {
    // Create issue in Open status
    const createResponse = await request(app)
      .post("/api/issues")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Invalid Transition Issue",
        description: "Testing invalid workflow transition",
        priority: "Medium",
        severity: "Medium",
        category: "Authentication",
        defectType: "Functional",
        status: "Open",
      });

    expect(createResponse.statusCode).toBe(201);

    const issueId = createResponse.body._id;

    // Open → Resolved should be invalid
    const response = await request(app)
      .put(`/api/issues/${issueId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "Resolved",
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.message).toBe(
      "Invalid status transition: Open → Resolved"
    );
  });
});

// ========================================
// GET ISSUES TESTS
// ========================================

describe("Get Issues Tests", () => {
  test("Should get all issues for the logged-in user", async () => {
    // Create first issue
    const firstIssueResponse = await request(app)
      .post("/api/issues")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "First Issue",
        description: "Description for the first issue",
        priority: "High",
        severity: "High",
        category: "Authentication",
        defectType: "Functional",
        status: "Open",
      });

    expect(firstIssueResponse.statusCode).toBe(201);

    // Create second issue
    const secondIssueResponse = await request(app)
      .post("/api/issues")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Second Issue",
        description: "Description for the second issue",
        priority: "Medium",
        severity: "Medium",
        category: "UI",
        defectType: "Functional",
        status: "Open",
      });

    expect(secondIssueResponse.statusCode).toBe(201);

    // Get all issues
    const response = await request(app)
      .get("/api/issues")
      .set("Authorization", `Bearer ${token}`);

    // Check response
    expect(response.statusCode).toBe(200);

    expect(Array.isArray(response.body)).toBe(true);

    expect(response.body.length).toBeGreaterThanOrEqual(2);

    const issueTitles = response.body.map(
      (issue) => issue.title
    );

    expect(issueTitles).toContain("First Issue");
    expect(issueTitles).toContain("Second Issue");
  });

  // ----------------------------------------
  // GET ISSUES WITHOUT AUTHENTICATION
  // ----------------------------------------

  test(
    "Should reject getting issues without authentication",
    async () => {
      const response = await request(app)
        .get("/api/issues");

      expect(response.statusCode).toBe(401);
    }
  );
});

// ========================================
// ISSUE UPDATE AND STATUS TRANSITION TESTS
// ========================================

describe("Issue Update and Status Transition Tests", () => {
  test(
    "Should update issue status from Open to In Progress",
    async () => {
      // Create an issue
      const createResponse = await request(app)
        .post("/api/issues")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Status Transition Issue",
          description: "Testing issue status transition",
          priority: "High",
          severity: "High",
          category: "Authentication",
          defectType: "Functional",
          status: "Open",
        });

      expect(createResponse.statusCode).toBe(201);

      const issueId = createResponse.body._id;

      // Update status
      const updateResponse = await request(app)
        .put(`/api/issues/${issueId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          status: "In Progress",
        });

      expect(updateResponse.statusCode).toBe(200);

      expect(updateResponse.body.message).toBe(
        "Issue updated successfully"
      );

      expect(updateResponse.body.issue.status).toBe(
        "In Progress"
      );
    }
  );
});

// ========================================
// DEFECT ASSIGNMENT TESTS
// ========================================

describe("Defect Assignment Tests", () => {
  test(
    "Should assign an issue to a developer successfully",
    async () => {
      // Create a developer
      const developer = await TeamMember.create({
        owner: userId,
        name: "Test Developer",
        role: "Backend Developer",
        skills: ["Node.js", "MongoDB"],
        experience: 2,
        workload: 30,
        email: "developer@example.com",
      });

      // Create an issue
      const createResponse = await request(app)
        .post("/api/issues")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Assignment Test Issue",
          description: "Testing issue assignment to a developer",
          priority: "High",
          severity: "High",
          category: "Authentication",
          defectType: "Functional",
          status: "Open",
        });

      expect(createResponse.statusCode).toBe(201);

      const issueId = createResponse.body._id;

      // Assign issue to developer
      const updateResponse = await request(app)
        .put(`/api/issues/${issueId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          assignedDeveloper: developer._id.toString(),
        });

      expect(updateResponse.statusCode).toBe(200);

      expect(updateResponse.body.issue).toBeDefined();

      expect(
        updateResponse.body.issue.assignedDeveloper._id.toString()
      ).toBe(developer._id.toString());
    }
  );

  test(
    "Should reject assignment to an invalid developer ID",
    async () => {
      // Create an issue
      const createResponse = await request(app)
        .post("/api/issues")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Invalid Developer Assignment Issue",
          description: "Testing invalid developer assignment",
          priority: "Medium",
          severity: "Medium",
          category: "Authentication",
          defectType: "Functional",
          status: "Open",
        });

      expect(createResponse.statusCode).toBe(201);

      const issueId = createResponse.body._id;

      // Try assigning invalid ID
      const updateResponse = await request(app)
        .put(`/api/issues/${issueId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          assignedDeveloper: "invalid-developer-id",
        });

      expect(updateResponse.statusCode).toBe(400);

      expect(updateResponse.body.message).toBe(
        "Invalid assigned developer ID"
      );
    }
  );
});