const crypto = require("crypto");

const Project = require("../models/Project");
const ProjectInvitation = require("../models/ProjectInvitation");

// ========================================
// GENERATE INVITATION
// ========================================

exports.createInvitation = async (req, res) => {
  try {
    const {
      projectId,
      email,
      role,
      skills,
      experience,
    } = req.body;

    // ========================================
    // VALIDATE REQUIRED FIELDS
    // ========================================

    if (!projectId || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "Project, email and role are required",
      });
    }

    // ========================================
    // NORMALIZE EMAIL
    // ========================================

    const normalizedEmail = email.trim().toLowerCase();

    // ========================================
    // VERIFY PROJECT BELONGS TO TEAM LEAD
    // ========================================

    const project = await Project.findOne({
      _id: projectId,
      createdBy: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or you are not the project owner",
      });
    }

    // ========================================
    // CHECK EXISTING PENDING INVITATION
    // ========================================

    const existingInvitation =
      await ProjectInvitation.findOne({
        project: projectId,
        email: normalizedEmail,
        status: "Pending",
        expiresAt: { $gt: new Date() },
      });

    if (existingInvitation) {
      return res.status(400).json({
        success: false,
        message:
          "A pending invitation already exists for this member",
      });
    }

    // ========================================
    // GENERATE 8 CHARACTER PASSCODE
    // ========================================

    const code = crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase();

    // ========================================
    // GENERATE SECURE TOKEN FOR QR CODE
    // ========================================

    const token = crypto.randomBytes(32).toString("hex");

    // ========================================
    // INVITATION EXPIRES IN 30 MINUTES
    // ========================================

    const expiresAt = new Date(
      Date.now() + 30 * 60 * 1000
    );

    // ========================================
    // CREATE INVITATION
    // ========================================

    const invitation = await ProjectInvitation.create({
      owner: req.user.id,

      project: projectId,

      email: normalizedEmail,

      role,

      skills: Array.isArray(skills) ? skills : [],

      experience: Number(experience) || 0,

      code,

      token,

      status: "Pending",

      expiresAt,
    });

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(201).json({
      success: true,

      message: "Project invitation created successfully",

      invitation: {
        id: invitation._id,

        projectId: project._id,

        projectName: project.projectName,

        email: invitation.email,

        role: invitation.role,

        skills: invitation.skills,

        experience: invitation.experience,

        code: invitation.code,

        token: invitation.token,

        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    console.error(
      "Create invitation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error while creating invitation",
      error: error.message,
    });
  }
};
// ========================================
// VERIFY PROJECT INVITATION
// ========================================

exports.verifyInvitation = async (req, res) => {
  try {
    const { code, token } = req.body;

    if (!code && !token) {
      return res.status(400).json({
        success: false,
        message: "Invitation code or QR token is required",
      });
    }

    // Find invitation using either code or token
    const invitation = await ProjectInvitation.findOne(
      code
        ? {
            code: code.trim().toUpperCase(),
          }
        : {
            token: token.trim(),
          }
    )
      .populate("project", "projectName description")
      .populate("owner", "name email");

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "Invalid invitation",
      });
    }

    // Check invitation status
    if (invitation.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `This invitation has already been ${invitation.status.toLowerCase()}.`,
      });
    }

    // Check expiration
    if (new Date() > invitation.expiresAt) {
      invitation.status = "Expired";
      await invitation.save();

      return res.status(400).json({
        success: false,
        message: "This invitation has expired.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Invitation is valid",

      invitation: {
        id: invitation._id,
        email: invitation.email,
        role: invitation.role,
        skills: invitation.skills,
        experience: invitation.experience,

        project: {
          id: invitation.project._id,
          name: invitation.project.projectName,
          description: invitation.project.description,
        },

        owner: {
          name: invitation.owner.name,
          email: invitation.owner.email,
        },

        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    console.error(
      "Verify invitation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error while verifying invitation",
      error: error.message,
    });
  }
};


// ========================================
// ACCEPT PROJECT INVITATION
// ========================================

exports.acceptInvitation = async (req, res) => {
  try {
    const { invitationId } = req.body;

    if (!invitationId) {
      return res.status(400).json({
        success: false,
        message: "Invitation ID is required",
      });
    }

    // Find invitation
    const invitation =
      await ProjectInvitation.findById(invitationId);

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "Invitation not found",
      });
    }

    // Check status
    if (invitation.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "This invitation is no longer active.",
      });
    }

    // Check expiry
    if (new Date() > invitation.expiresAt) {
      invitation.status = "Expired";
      await invitation.save();

      return res.status(400).json({
        success: false,
        message: "This invitation has expired.",
      });
    }

    // ========================================
    // VERIFY LOGGED-IN USER EMAIL
    // ========================================

    const User = require("../models/User");

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    if (
      user.email.trim().toLowerCase() !==
      invitation.email.trim().toLowerCase()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "This invitation was created for a different email address.",
      });
    }

    // ========================================
    // CHECK IF ALREADY A MEMBER
    // ========================================

    const TeamMember = require("../models/TeamMember");

    const existingMember =
      await TeamMember.findOne({
        user: user._id,
        project: invitation.project,
      });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message:
          "You are already a member of this project.",
        teamMember: existingMember,
      });
    }

    // ========================================
    // CREATE TEAM MEMBER
    // ========================================

    const teamMember = await TeamMember.create({
      owner: invitation.owner,

      project: invitation.project,

      user: user._id,

      name: user.name,

      email: user.email,

      role: invitation.role,

      skills: invitation.skills,

      experience: invitation.experience,

      workload: 0,

      assignedTasks: [],
    });

    // ========================================
    // MARK INVITATION ACCEPTED
    // ========================================

    invitation.status = "Accepted";
    invitation.acceptedBy = user._id;
    invitation.acceptedAt = new Date();

    await invitation.save();

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,

      message: "You have successfully joined the project.",

      project: {
        id: invitation.project,
      },

      teamMember: {
        id: teamMember._id,
        name: teamMember.name,
        email: teamMember.email,
        role: teamMember.role,
      },
    });
  } catch (error) {
    console.error(
      "Accept invitation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while accepting invitation",
      error: error.message,
    });
  }
};