import Quiz from "../models/Quiz.js";

const createQuiz = async (req, res, next) => {
  try {
    const { title, description, timeLimit, rules } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }

    const payload = {
      title: title.trim(),
      description: description ? String(description).trim() : "",
      timeLimit: Number(timeLimit) || 0,
      rules: rules ? String(rules).trim() : "",
    };

    const quiz = await Quiz.create(payload);
    res.status(201).json({ success: true, quiz });
  } catch (err) {
    next(err);
  }
};

const getQuizzes = async (req, res, next) => {
  try {
    // By default return active quizzes only; teachers can request all via ?all=true
    const filter = req.query.all === "true" ? {} : { isActive: true };
    const quizzes = await Quiz.find(filter).limit(50);
    res.json({ success: true, quizzes });
  } catch (err) {
    next(err);
  }
};

const getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json({ success: true, quiz });
  } catch (err) {
    next(err);
  }
};

const deleteQuiz = async (req, res, next) => {
  try {
    // Soft-delete: mark inactive and record who deleted and when
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    quiz.isActive = false;
    quiz.deletedAt = new Date();
    quiz.deletedBy = req.user ? req.user.id : undefined;
    await quiz.save();
    res.json({ success: true, message: "Soft-deleted", quizId: quiz._id });
  } catch (err) {
    next(err);
  }
};

const undoQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    if (quiz.isActive)
      return res.status(400).json({ message: "Quiz is already active" });
    quiz.isActive = true;
    quiz.deletedAt = undefined;
    quiz.deletedBy = undefined;
    await quiz.save();
    res.json({ success: true, message: "Restored", quizId: quiz._id });
  } catch (err) {
    next(err);
  }
};

export default {
  createQuiz,
  getQuizzes,
  getQuiz,
  deleteQuiz,
  undoQuiz,
};
