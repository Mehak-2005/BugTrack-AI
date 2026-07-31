const express = require("express");

const router = express.Router();

const {
  generateAIReport
} = require("../controllers/aiController");

router.post(
  "/generate-bug-report",
  generateAIReport
);

module.exports = router;