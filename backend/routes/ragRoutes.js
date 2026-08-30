const express = require("express");

const {
  searchSimilarIssues,
} = require("../controllers/ragController");

const router = express.Router();

// Search for similar historical issues using RAG
router.post("/search-similar", searchSimilarIssues);

module.exports = router;