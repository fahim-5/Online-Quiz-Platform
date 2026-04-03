import express from "express";
import {
  startResult,
  submitResult,
  getResultsForUser,
  getMyResults,
  getMySummary,
  leaderboardForQuiz,
  quizStats,
  participationSummary,
  exportLeaderboardCSV,
} from "../controllers/resultController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/start", protect, startResult);
router.post("/", protect, submitResult);
router.get("/user/:userId", protect, getResultsForUser);
router.get("/me", protect, getMyResults);
router.get("/me/summary", protect, getMySummary);
// Teacher analytics (formerly admin)
router.get(
  "/teacher/leaderboard/:quizId",
  protect,
  authorize("teacher"),
  leaderboardForQuiz,
);
router.get(
  "/teacher/quiz/:quizId/stats",
  protect,
  authorize("teacher"),
  quizStats,
);
router.get(
  "/teacher/participation",
  protect,
  authorize("teacher"),
  participationSummary,
);
router.get(
  "/teacher/quiz/:quizId/export",
  protect,
  authorize("teacher"),
  exportLeaderboardCSV,
);

export default router;
