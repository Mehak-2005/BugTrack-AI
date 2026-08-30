const mongoose = require("mongoose");

const projectInvitationSchema = new mongoose.Schema(
  {
    // ========================================
    // TEAM LEAD / PROJECT OWNER
    // ========================================
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ========================================
    // PROJECT
    // ========================================
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    // ========================================
    // INVITED MEMBER EMAIL
    // ========================================
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // ========================================
    // ROLE ASSIGNED BY TEAM LEAD
    // ========================================
    role: {
      type: String,
      required: true,
      trim: true,
    },

    // ========================================
    // MEMBER SKILLS
    // ========================================
    skills: {
      type: [String],
      default: [],
    },

    // ========================================
    // EXPERIENCE
    // ========================================
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ========================================
    // INVITATION CODE
    // ========================================
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // ========================================
    // SECURE TOKEN FOR QR CODE
    // ========================================
    token: {
      type: String,
      required: true,
      unique: true,
    },

    // ========================================
    // INVITATION STATUS
    // ========================================
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Expired"],
      default: "Pending",
    },

    // ========================================
    // EXPIRATION
    // ========================================
    expiresAt: {
      type: Date,
      required: true,
    },

    // ========================================
    // USER WHO ACCEPTED INVITATION
    // ========================================
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ========================================
    // ACCEPTED DATE
    // ========================================
    acceptedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ProjectInvitation",
  projectInvitationSchema
);