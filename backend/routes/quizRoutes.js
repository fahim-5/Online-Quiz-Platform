import express from "express";
import quizController from "../controllers/quizController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", quizController.getQuizzes);
router.post("/", protect, authorize("admin"), quizController.createQuiz);
router.get("/:id", quizController.getQuiz);
router.delete("/:id", protect, authorize("admin"), quizController.deleteQuiz);

router.post("/:id/undo", protect, authorize("admin"), quizController.undoQuiz);

export default router;
