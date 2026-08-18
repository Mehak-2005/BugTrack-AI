const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ========================================
    // USER NAME
    // ========================================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // ========================================
    // EMAIL
    // ========================================
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // ========================================
    // PASSWORD
    // ========================================
    password: {
      type: String,
      required: true,
    },

    // ========================================
    // DEVELOPER SKILLS
    // ========================================
    skills: {
      type: [String],
      default: [],
    },

    // ========================================
    // DEVELOPER EXPERIENCE
    // ========================================
    experience: {
      type: Number,
      default: 0,
    },

    // ========================================
    // CURRENT WORKLOAD
    // ========================================
    workload: {
      type: Number,
      default: 0,
       min: 0,
      max: 100,
    },

    // ========================================
    // DEVELOPER ROLE
    // ========================================
    role: {
      type: String,
      enum: [
        "Developer",
        "Tester",
        "Project Manager",
        "Admin",
      ],
      default: "Developer",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);