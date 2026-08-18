const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    // ========================================
    // ISSUE TITLE
    // ========================================
    title: {
      type: String,
      trim: true,
    },

    // ========================================
    // ISSUE DESCRIPTION
    // ========================================
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // ========================================
    // AI GENERATED REPORT
    // ========================================
    report: {
      type: String,
    },

    // ========================================
    // ISSUE STATUS
    // ========================================
    status: {
      type: String,
      enum: [
        "Open",
        "In Progress",
        "In Review",
        "Resolved",
        "Closed",
      ],
      default: "Open",
    },

    // ========================================
    // PRIORITY
    // ========================================
    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
        "Critical",
      ],
      default: "Medium",
    },

    // ========================================
    // PROJECT
    // ========================================
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    // ========================================
    // SPRINT
    // ========================================
    sprint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sprint",
      default: null,
    },

    // ========================================
    // SEVERITY
    // ========================================
    severity: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
        "Critical",
      ],
      default: "Medium",
    },

    // ========================================
    // ISSUE CATEGORY
    // ========================================
    category: {
      type: String,
      enum: [
        "UI",
        "Authentication",
        "Backend",
        "Database",
        "API",
        "Performance",
        "Security",
        "Navigation",
        "Checkout",
        "Other",
      ],
      default: "Other",
    },

    // ========================================
    // DEFECT TYPE
    // ========================================
    defectType: {
      type: String,
      enum: [
        "Functional",
        "UI",
        "Performance",
        "Security",
        "Integration",
        "Data",
        "Other",
      ],
      default: "Other",
    },

    // ========================================
    // AFFECTED MODULE
    // ========================================
    affectedModule: {
      type: String,
      default: "",
      trim: true,
    },

    // ========================================
    // USER WHO REPORTED THE ISSUE
    // ========================================
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ========================================
    // SEMANTIC SEARCH EMBEDDING
    // ========================================
    embedding: {
      type: [Number],
      default: [],
    },

    // ========================================
    // AI RESOLUTION ASSISTANCE
    // ========================================
    aiAnalysis: {
      // ----------------------------------------
      // PROBABLE ROOT CAUSE
      // ----------------------------------------
      probableRootCause: {
        type: String,
        default: "",
      },

      // ----------------------------------------
      // AFFECTED MODULE
      // ----------------------------------------
      affectedModule: {
        type: String,
        default: "",
      },

      // ----------------------------------------
      // REASONING SUMMARY
      // ----------------------------------------
      reasoningSummary: {
        type: String,
        default: "",
      },

      // ----------------------------------------
      // RECOMMENDED FIX
      // ----------------------------------------
      recommendedFix: {
        type: String,
        default: "",
      },

      // ----------------------------------------
      // DEBUGGING STEPS
      // ----------------------------------------
      debuggingSteps: {
        type: [String],
        default: [],
      },

      // ----------------------------------------
      // AI CONFIDENCE
      // ----------------------------------------
      confidence: {
        type: Number,
        default: 0,
      },

      // ----------------------------------------
      // WARNINGS / ASSUMPTIONS
      // ----------------------------------------
      warnings: {
        type: [String],
        default: [],
      },

      // ----------------------------------------
      // WHEN ANALYSIS WAS GENERATED
      // ----------------------------------------
      generatedAt: {
        type: Date,
      },
    },

    // ========================================
    // AI GENERATED TEST CASES
    // ========================================
    // Stores validation, regression, positive,
    // negative and boundary test cases generated
    // from the defect and proposed resolution.
    generatedTestCases: [
      {
        // ----------------------------------------
        // TEST CASE ID
        // ----------------------------------------
        testCaseId: {
          type: String,
          required: true,
        },

        // ----------------------------------------
        // TEST TYPE
        // ----------------------------------------
        testType: {
          type: String,
          enum: [
            "Positive",
            "Negative",
            "Boundary",
            "Regression",
            "Functional",
            "Other",
          ],
          default: "Functional",
        },

        // ----------------------------------------
        // TEST SCENARIO
        // ----------------------------------------
        scenario: {
          type: String,
          required: true,
        },

        // ----------------------------------------
        // TEST STEPS
        // ----------------------------------------
        steps: {
          type: [String],
          default: [],
        },

        // ----------------------------------------
        // EXPECTED RESULT
        // ----------------------------------------
        expectedResult: {
          type: String,
          required: true,
        },

        // ----------------------------------------
        // TEST PRIORITY
        // ----------------------------------------
        priority: {
          type: String,
          enum: [
            "Low",
            "Medium",
            "High",
            "Critical",
          ],
          default: "Medium",
        },

        // ----------------------------------------
        // WHEN TEST WAS GENERATED
        // ----------------------------------------
        generatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ========================================
    // AI RESOLUTION VERIFICATION
    // ========================================
    // Stores the AI evaluation of the
    // developer's proposed fix.
    resolutionVerification: {

      // ----------------------------------------
      // FIX VALIDITY SCORE
      // ----------------------------------------
      fixValidityScore: {
        type: Number,
        default: 0,
      },

      // ----------------------------------------
      // ROOT CAUSE ADDRESSED
      // ----------------------------------------
      rootCauseAddressed: {
        type: Boolean,
        default: false,
      },

      // ----------------------------------------
      // VERIFICATION SUMMARY
      // ----------------------------------------
      verificationSummary: {
        type: String,
        default: "",
      },

      // ----------------------------------------
      // REMAINING ISSUES
      // ----------------------------------------
      remainingIssues: {
        type: [String],
        default: [],
      },

      // ----------------------------------------
      // REGRESSION RISK
      // ----------------------------------------
      regressionRisk: {
        type: String,
        enum: [
          "Low",
          "Medium",
          "High",
        ],
        default: "Medium",
      },

      // ----------------------------------------
      // RECOMMENDED TESTS
      // ----------------------------------------
      recommendedTests: {
        type: [String],
        default: [],
      },

      // ----------------------------------------
      // FINAL RECOMMENDATION
      // ----------------------------------------
      recommendation: {
        type: String,
        enum: [
          "Approve resolution",
          "Needs review",
          "Reject resolution",
        ],
        default: "Needs review",
      },

      // ----------------------------------------
      // DEVELOPER'S FIX
      // ----------------------------------------
      developerFix: {
        type: String,
        default: "",
      },

      // ----------------------------------------
      // WHEN VERIFICATION WAS GENERATED
      // ----------------------------------------
      generatedAt: {
        type: Date,
      },
    },
  },

  // ========================================
  // AUTOMATIC CREATED / UPDATED TIMESTAMPS
  // ========================================
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Issue", issueSchema);