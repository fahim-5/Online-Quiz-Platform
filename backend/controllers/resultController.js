import mongoose from "mongoose";
import Result from "../models/Result.js";
import Question from "../models/Question.js";
import Quiz from "../models/Quiz.js";

// Create a draft result when a user starts a quiz. Records startedAt.
const startResult = async (req, res, next) => {
  try {
    const user = req.user && req.user.id ? req.user.id : req.body.user;
    const { quiz } = req.body;
    // Enforce scheduled start time when present
    const quizDoc = await Quiz.findById(quiz);
    if (!quizDoc)
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    const now = new Date();
    if (quizDoc.startFrom && now < new Date(quizDoc.startFrom)) {
      // allow teachers to create drafts early
      if (!(req.user && req.user.role === "teacher")) {
        return res
          .status(403)
          .json({ success: false, message: "Quiz not open yet" });
      }
    }

    const draft = await Result.create({
      user,
      quiz,
      startedAt: new Date(),
      status: "in-progress",
    });
    res.status(201).json({ success: true, result: draft });
  } catch (err) {
    next(err);
  }
};

// Submit result: server-side scoring for objective questions
// Accepts optional `resultId` to validate startedAt/timeLimit.
const submitResult = async (req, res, next) => {
  try {
    // Expect body: { quiz: quizId, answers: [{ question: questionId, answerIndex: Number }], resultId }
    const user = req.user && req.user.id ? req.user.id : req.body.user;
    const { quiz, answers = [], resultId } = req.body;

    // Sanitize answers
    const sanitizedAnswers = Array.isArray(answers)
      ? answers.map((a) => ({
          question: String(a.question),
          answerIndex: Number(a.answerIndex),
        }))
      : [];

    // If draft provided, load and validate
    let draft = null;
    let quizId = quiz;
    if (resultId) {
      draft = await Result.findById(resultId);
      if (!draft)
        return res
          .status(404)
          .json({ success: false, message: "Draft result not found" });
      if (draft.status === "completed")
        return res
          .status(400)
          .json({ success: false, message: "Result already submitted" });
      quizId = draft.quiz.toString();

      // enforce time limit
      const quizDoc = await Quiz.findById(quizId);
      const timeLimitSec = (quizDoc && quizDoc.timeLimit) || 0;
      if (timeLimitSec > 0 && draft.startedAt) {
        const elapsed = Date.now() - new Date(draft.startedAt).getTime();
        if (elapsed > timeLimitSec * 1000) {
          // mark draft completed to avoid retries
          await Result.findByIdAndUpdate(resultId, { status: "completed" });
          return res
            .status(400)
            .json({ success: false, message: "Time limit exceeded" });
        }
      }
    }

    // Fetch all quiz questions to compute total points and build map
    const quizQuestions = await Question.find({ quiz: quizId });
    const qMap = {};
    let totalPossible = 0;
    quizQuestions.forEach((q) => {
      const id = q._id.toString();
      qMap[id] = q;
      // total possible per question is q.points (legacy)
      totalPossible += q.points || 0;
    });

    // Compute score by checking correctIndex equality
    let score = 0;
    sanitizedAnswers.forEach((a) => {
      const q = qMap[a.question];
      if (!q) return; // ignore answers to questions not in this quiz
      const idx = a.answerIndex;
      if (
        Number.isFinite(idx) &&
        Number.isInteger(idx) &&
        Array.isArray(q.options) &&
        idx >= 0 &&
        idx < q.options.length
      ) {
        const correct =
          typeof q.correctIndex !== "undefined" ? Number(q.correctIndex) : null;
        if (correct !== null && idx === correct) {
          score += q.points || 0;
        }
      }
    });

    const endedAt = new Date();
    const durationSec =
      draft && draft.startedAt
        ? Math.round(
            (endedAt.getTime() - new Date(draft.startedAt).getTime()) / 1000,
          )
        : undefined;

    // Atomically update draft if present and still in-progress
    if (draft) {
      const updated = await Result.findOneAndUpdate(
        { _id: resultId, status: "in-progress" },
        {
          score,
          total: totalPossible,
          answers: sanitizedAnswers,
          status: "completed",
          endedAt,
          duration: durationSec,
          takenAt: endedAt,
        },
        { new: true, runValidators: true },
      );
      if (!updated)
        return res.status(409).json({
          success: false,
          message: "Result already submitted or updated",
        });
      // populate question details for review
      try {
        await updated.populate(
          "answers.question",
          "text options correctIndex points",
        );
      } catch (e) {
        // ignore populate errors
      }
      return res.status(200).json({ success: true, result: updated });
    }

    // No draft: create a completed result
    const created = await Result.create({
      user,
      quiz: quizId,
      score,
      total: totalPossible,
      answers: sanitizedAnswers,
      status: "completed",
      startedAt: undefined,
      endedAt,
      duration: durationSec,
      takenAt: endedAt,
    });
    // populate question details for review
    try {
      await created.populate(
        "answers.question",
        "text options correctIndex points",
      );
    } catch (e) {
      // ignore populate errors
    }

    return res.status(201).json({ success: true, result: created });
  } catch (err) {
    next(err);
  }
};

const getResultsForUser = async (req, res, next) => {
  try {
    const results = await Result.find({ user: req.params.userId });
    res.json({ success: true, results });
  } catch (err) {
    next(err);
  }
};

// Return results for the currently authenticated user
const getMyResults = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id ? req.user.id : null;
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    const results = await Result.find({ user: userId })
      .populate("quiz", "title timeLimit")
      .sort({ takenAt: -1, createdAt: -1 });
    res.json({ success: true, results });
  } catch (err) {
    next(err);
  }
};

// Return a simple summary for the current user: attempts, average %, best score, last taken
const getMySummary = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id ? req.user.id : null;
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });

    const results = await Result.find({
      user: userId,
      status: "completed",
    }).sort({ takenAt: -1 });
    const attempts = results.length;
    const totalPoints = results.reduce((acc, r) => acc + (r.total || 0), 0);
    const totalScore = results.reduce((acc, r) => acc + (r.score || 0), 0);
    const bestScore = results.reduce(
      (acc, r) => Math.max(acc, r.score || 0),
      0,
    );
    const lastTaken = results.length ? results[0].takenAt : null;
    const avgPercent =
      totalPoints > 0
        ? Math.round((totalScore / totalPoints) * 100 * 100) / 100
        : 0; // two decimals

    res.json({
      success: true,
      summary: {
        attempts,
        totalScore,
        totalPoints,
        avgPercent,
        bestScore,
        lastTaken,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default {
  startResult,
  submitResult,
  getResultsForUser,
  getMyResults,
  getMySummary,
};

// Teacher analytics
// Leaderboard for a quiz: top N users by best score
const leaderboardForQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const skip = Math.max(Number(req.query.skip) || 0, 0);
    const { startDate, endDate } = req.query;

    // build date filter if provided
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const match = {
      quiz: new mongoose.Types.ObjectId(quizId),
      status: "completed",
    };
    if (startDate || endDate) match.takenAt = dateFilter;

    const agg = await Result.aggregate([
      { $match: match },
      { $sort: { score: -1 } },
      {
        $group: {
          _id: "$user",
          bestScore: { $max: "$score" },
          total: { $max: "$total" },
          lastTaken: { $max: "$takenAt" },
        },
      },
      { $sort: { bestScore: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          user: {
            _id: "$user._id",
            name: "$user.name",
            identifier: "$user.identifier",
          },
          bestScore: 1,
          total: 1,
          lastTaken: 1,
        },
      },
    ]);

    res.json({ success: true, leaderboard: agg });
  } catch (err) {
    next(err);
  }
};

// Quiz-level stats: attempts, avg score, avg percent, top score
const quizStats = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const { startDate, endDate } = req.query;

    const match = {
      quiz: new mongoose.Types.ObjectId(quizId),
      status: "completed",
    };
    if (startDate || endDate) {
      const dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
      match.takenAt = dateFilter;
    }

    const agg = await Result.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          attempts: { $sum: 1 },
          totalScore: { $sum: "$score" },
          totalPossible: { $sum: "$total" },
          avgScore: { $avg: "$score" },
          topScore: { $max: "$score" },
          minScore: { $min: "$score" },
        },
      },
    ]);

    const data = agg[0] || {
      attempts: 0,
      totalScore: 0,
      totalPossible: 0,
      avgScore: 0,
      topScore: 0,
      minScore: 0,
    };
    const avgPercent =
      data.totalPossible > 0
        ? Math.round((data.totalScore / data.totalPossible) * 100 * 100) / 100
        : 0;
    res.json({
      success: true,
      stats: {
        attempts: data.attempts,
        avgScore: data.avgScore,
        avgPercent,
        topScore: data.topScore,
        minScore: data.minScore,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Participation summary across quizzes: attempts per quiz and avg percent
const participationSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const match = { status: "completed" };
    if (startDate || endDate) {
      const dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
      match.takenAt = dateFilter;
    }

    const agg = await Result.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$quiz",
          attempts: { $sum: 1 },
          totalScore: { $sum: "$score" },
          totalPossible: { $sum: "$total" },
        },
      },
      {
        $lookup: {
          from: "quizzes",
          localField: "_id",
          foreignField: "_id",
          as: "quiz",
        },
      },
      { $unwind: { path: "$quiz", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          quizId: "$_id",
          title: "$quiz.title",
          attempts: 1,
          avgPercent: {
            $cond: [
              { $gt: ["$totalPossible", 0] },
              {
                $multiply: [
                  { $divide: ["$totalScore", "$totalPossible"] },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },
      { $sort: { attempts: -1 } },
    ]);

    res.json({ success: true, participation: agg });
  } catch (err) {
    next(err);
  }
};

// Export leaderboard CSV for a quiz (teacher)
const exportLeaderboardCSV = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const { startDate, endDate } = req.query;
    const match = {
      quiz: new mongoose.Types.ObjectId(quizId),
      status: "completed",
    };
    if (startDate || endDate) {
      const dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
      match.takenAt = dateFilter;
    }

    const agg = await Result.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$user",
          bestScore: { $max: "$score" },
          total: { $max: "$total" },
          lastTaken: { $max: "$takenAt" },
          attempts: { $sum: 1 },
        },
      },
      { $sort: { bestScore: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: "$user.name",
          identifier: "$user.identifier",
          bestScore: 1,
          total: 1,
          attempts: 1,
          lastTaken: 1,
        },
      },
    ]);

    // Build CSV
    const header = [
      "Name",
      "Identifier",
      "BestScore",
      "Total",
      "Attempts",
      "LastTaken",
    ].join(",");
    const lines = agg.map((r) =>
      [
        (r.name || "").replace(/"/g, '""'),
        r.identifier || "",
        r.bestScore || 0,
        r.total || 0,
        r.attempts || 0,
        r.lastTaken ? new Date(r.lastTaken).toISOString() : "",
      ].join(","),
    );
    const csv = [header, ...lines].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=leaderboard_${quizId}.csv`,
    );
    res.send(csv);
  } catch (err) {
    next(err);
  }
};

// Export functions (named exports) — include core and teacher helpers
export {
  startResult,
  submitResult,
  getResultsForUser,
  getMyResults,
  getMySummary,
  leaderboardForQuiz,
  quizStats,
  participationSummary,
  exportLeaderboardCSV,
};
