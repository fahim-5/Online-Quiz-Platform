const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const auth = require("../middleware/auth.js");

router.get("/", quizController.getQuizzes);
router.post("/", auth.protect, quizController.createQuiz);
router.get("/:id", quizController.getQuiz);
router.delete("/:id", auth.protect, quizController.deleteQuiz);

module.exports = router;
