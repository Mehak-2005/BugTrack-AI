const TeamMember = require("../models/TeamMember");
const Issue = require("../models/Issue");
const Project = require("../models/Project");
const crypto = require("crypto");

// ========================================
// CALCULATE WORKLOAD
// ========================================
//
// 1 active task  = 20%
// 2 active tasks = 40%
// 3 active tasks = 60%
// 4 active tasks = 80%
// 5+ active tasks = 100%
//
// Resolved tasks are not counted.
//

const calculateWorkload = (assignedTasks = []) => {
  const activeTasks = assignedTasks.filter(
    (task) => task.status !== "Resolved"
  );

  const workload = activeTasks.length * 20;

  return Math.min(workload, 100);
};

// ========================================
// GET ALL TEAM MEMBERS
// ========================================

const getTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find({
      owner: req.user.id,
    }).sort({ createdAt: -1 });

    // ========================================
    // RECALCULATE WORKLOAD
    // ========================================

    for (const member of members) {
      const calculatedWorkload =
        calculateWorkload(member.assignedTasks);

      if (member.workload !== calculatedWorkload) {
        member.workload = calculatedWorkload;
        await member.save();
      }
    }

    res.status(200).json(members);
  } catch (error) {
    console.error(
      "Error fetching team members:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch team members",
    });
  }
};

// ========================================
// ADD TEAM MEMBER
// ========================================

const addTeamMember = async (req, res) => {
  try {
    const {
      name,
      role,
      skills,
      experience,
      email,
      projectId,
    } = req.body;

    // ========================================
    // BASIC VALIDATION
    // ========================================

    if (!name || !role) {
      return res.status(400).json({
        message: "Name and role are required",
      });
    }

    if (!projectId) {
      return res.status(400).json({
        message: "Project ID is required",
      });
    }
   const project = await Project.findOne({
  _id: projectId,
  createdBy: req.user.id,
});

if (!project) {
  return res.status(404).json({
    message:
      "Project not found or you do not have permission to use it",
  });
}
    
    // ========================================
    // GENERATE UNIQUE PASSCODE
    // ========================================

    const passcode = crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase();
      // ========================================
    // PASSCODE EXPIRY
    // 24 HOURS
    // ========================================

    const passcodeExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    // ========================================
    // CREATE TEAM MEMBER
    // ========================================

    const member = await TeamMember.create({
      owner: req.user.id,
      project: project._id,
      name: name.trim(),
      role,
      skills: Array.isArray(skills)
        ? skills
        : skills
        ? skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : [],

      experience: Number(experience) || 0,

      // New member has no assigned tasks
      workload: 0,

      email: email?.trim() || "",

      assignedTasks: [],
    // ========================================
      // INVITATION DETAILS
      // ========================================

      passcode,

      passcodeExpiresAt,

      joined: false,
    });

    // ========================================
    // RESPONSE
    // ========================================

    res.status(201).json({
      message: "Team member added successfully",
      member,
       invitation: {
        passcode,
        expiresAt: passcodeExpiresAt,
      },
    });
    
  } catch (error) {
    console.error(
      "Error adding team member:",
      error
    );

    res.status(500).json({
      message: "Failed to add team member",
      error: error.message,
    });
  }
};

// ========================================
// ASSIGN ISSUE TO TEAM MEMBER
// ========================================

const assignIssueToTeamMember = async (
  req,
  res
) => {
  try {
    const {
      issueId,
      title,
      priority,
    } = req.body;

    const memberId = req.params.id;

    // ========================================
    // VALIDATE REQUIRED FIELDS
    // ========================================

    if (!issueId || !title) {
      return res.status(400).json({
        message:
          "Issue ID and issue title are required",
      });
    }

    // ========================================
    // CHECK WHETHER ISSUE EXISTS
    // ========================================

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    // ========================================
    // FIND TEAM MEMBER
    // ========================================

    const member = await TeamMember.findOne({
      _id: memberId,
      owner: req.user.id,
    });

    if (!member) {
      return res.status(404).json({
        message: "Team member not found",
      });
    }

    // ========================================
    // CHECK IF ISSUE ALREADY ASSIGNED
    // ========================================

    const alreadyAssigned =
      member.assignedTasks?.some(
        (task) =>
          task.issueId &&
          task.issueId.toString() ===
            issueId.toString()
      );

    if (alreadyAssigned) {
      return res.status(400).json({
        message:
          "This issue is already assigned to this team member",
      });
    }

    // ========================================
    // ADD TASK TO TEAM MEMBER
    // ========================================

    member.assignedTasks.push({
      issueId: issue._id,

      title: issue.title || title,

      priority:
        issue.priority ||
        priority ||
        "Medium",

      status:
        issue.status ||
        "Open",

      assignedAt: new Date(),
    });

    // ========================================
    // RECALCULATE WORKLOAD
    // ========================================

    member.workload = calculateWorkload(
      member.assignedTasks
    );

    // ========================================
    // SAVE TEAM MEMBER
    // ========================================

    await member.save();

    // ========================================
    // RESPONSE
    // ========================================

    res.status(200).json({
      message: "Issue assigned successfully",

      member,

      workload: member.workload,
    });
  } catch (error) {
    console.error(
      "Error assigning issue:",
      error
    );

    res.status(500).json({
      message: "Failed to assign issue",
      error: error.message,
    });
  }
};

// ========================================
// UPDATE ASSIGNED TASK STATUS
// ========================================

const updateAssignedTaskStatus = async (
  req,
  res
) => {
  try {
    const {
      taskId,
      status,
    } = req.body;

    const memberId = req.params.id;

    console.log(
      "========================================"
    );

    console.log(
      "UPDATING ASSIGNED TASK STATUS"
    );

    console.log(
      "Member ID:",
      memberId
    );

    console.log(
      "Task ID:",
      taskId
    );

    console.log(
      "New Status:",
      status
    );

    console.log(
      "========================================"
    );

    // ========================================
    // ALLOWED STATUSES
    // ========================================

    const allowedStatuses = [
      "Open",
      "In Progress",
      "In Review",
      "Resolved",
    ];

    // ========================================
    // VALIDATE INPUT
    // ========================================

    if (!taskId || !status) {
      return res.status(400).json({
        message:
          "Task ID and status are required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid task status",
      });
    }

    // ========================================
    // FIND TEAM MEMBER
    // ========================================

    const member = await TeamMember.findOne({
      _id: memberId,
      owner: req.user.id,
    });

    if (!member) {
      return res.status(404).json({
        message: "Team member not found",
      });
    }

    // ========================================
    // FIND ASSIGNED TASK
    // ========================================

    const task =
      member.assignedTasks.id(taskId);

    if (!task) {
      return res.status(404).json({
        message:
          "Assigned task not found",
      });
    }

    console.log(
      "Issue ID:",
      task.issueId
    );

    console.log(
      "Old Task Status:",
      task.status
    );

    // ========================================
    // UPDATE TEAM MEMBER TASK STATUS
    // ========================================

    task.status = status;

    // ========================================
    // UPDATE ACTUAL ISSUE STATUS
    // ========================================

    if (task.issueId) {
      const updatedIssue =
        await Issue.findByIdAndUpdate(
          task.issueId,
          {
            $set: {
              status: status,
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );

      // ========================================
      // ISSUE NOT FOUND
      // ========================================

      if (!updatedIssue) {
        return res.status(404).json({
          message:
            "The assigned issue could not be found",
        });
      }

      console.log(
        "Issue status successfully updated to:",
        updatedIssue.status
      );
    }

    // ========================================
    // RECALCULATE WORKLOAD
    // ========================================

    member.workload = calculateWorkload(
      member.assignedTasks
    );

    // ========================================
    // SAVE TEAM MEMBER
    // ========================================

    await member.save();

    console.log(
      "Team member task status updated to:",
      task.status
    );

    console.log(
      "New workload:",
      member.workload
    );

    // ========================================
    // RESPONSE
    // ========================================

    res.status(200).json({
      message:
        "Task and issue status updated successfully",

      task,

      issueStatus: status,

      workload: member.workload,
    });
  } catch (error) {
    console.error(
      "Error updating task status:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update task status",

      error: error.message,
    });
  }
};

// ========================================
// DELETE TEAM MEMBER
// ========================================

const deleteTeamMember = async (
  req,
  res
) => {
  try {
    const member =
      await TeamMember.findOneAndDelete({
        _id: req.params.id,
        owner: req.user.id,
      });

    // ========================================
    // MEMBER NOT FOUND
    // ========================================

    if (!member) {
      return res.status(404).json({
        message:
          "Team member not found",
      });
    }

    // ========================================
    // RESPONSE
    // ========================================

    res.status(200).json({
      message:
        "Team member removed successfully",
    });
  } catch (error) {
    console.error(
      "Error deleting team member:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete team member",
    });
  }
};
// ========================================
// GET MY PROJECT
// TEAM MEMBER DASHBOARD
// ========================================

exports.getMyProject = async (req, res) => {
  try {
    // --------------------------------------
    // CHECK TEAM MEMBER ID FROM JWT
    // --------------------------------------

    const teamMemberId = req.user.teamMemberId;

    if (!teamMemberId) {
      return res.status(401).json({
        success: false,
        message: "Team member information not found in token",
      });
    }

    // --------------------------------------
    // FIND TEAM MEMBER
    // --------------------------------------

    const teamMember = await TeamMember.findById(
      teamMemberId
    )
      .populate("project")
      .populate("owner", "name email");

    // --------------------------------------
    // TEAM MEMBER NOT FOUND
    // --------------------------------------

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    // --------------------------------------
    // CHECK PROJECT
    // --------------------------------------

    if (!teamMember.project) {
      return res.status(404).json({
        success: false,
        message: "No project assigned to this team member",
      });
    }

    // --------------------------------------
    // FIND PROJECT ISSUES
    // --------------------------------------

    const Issue = require("../models/Issue");

    const issues = await Issue.find({
      project: teamMember.project._id,
    }).sort({
      createdAt: -1,
    });

    // --------------------------------------
    // RESPONSE
    // --------------------------------------

    return res.status(200).json({
      success: true,

      teamMember: {
        id: teamMember._id,
        name: teamMember.name,
        email: teamMember.email,
        role: teamMember.role,
        skills: teamMember.skills,
        experience: teamMember.experience,
        workload: teamMember.workload,
      },

      project: {
        id: teamMember.project._id,
        projectName:
          teamMember.project.projectName,
        description:
          teamMember.project.description,
      },

      issues: issues,
    });

  } catch (error) {
    console.error(
      "Get team member project error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while retrieving team member project",
      error: error.message,
    });
  }
};
// ========================================
// EXPORT
// ========================================

module.exports = {
  getTeamMembers,
  addTeamMember,
  assignIssueToTeamMember,
  updateAssignedTaskStatus,
  deleteTeamMember,
  getMyProject: exports.getMyProject,
};