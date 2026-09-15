const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    passkey: { type: String, required: true, unique: true }, // One shared passkey for the project
    teamMembers: [{ type: String }], // List of allowed member names (e.g. ["Sneha Reddy", "Rahul Kumar"])
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);