const express = require("express");
const router = express.Router();
const resultController = require("../controllers/resultController");
const auth = require("../middleware/auth.js");

router.post("/", auth.protect, resultController.submitResult);
router.get("/user/:userId", auth.protect, resultController.getResultsForUser);

module.exports = router;
