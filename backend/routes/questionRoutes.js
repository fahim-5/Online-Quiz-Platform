const express = require("express");
const router = express.Router({ mergeParams: true });
const questionController = require("../controllers/questionController");
const auth = require("../middleware/auth.js");

router.get("/quiz/:quizId", questionController.getQuestionsForQuiz);
router.post("/", auth.protect, questionController.createQuestion);
router.delete("/:id", auth.protect, questionController.deleteQuestion);

module.exports = router;
