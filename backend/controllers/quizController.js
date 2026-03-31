const Quiz = require("../models/Quiz");

exports.createQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json({ success: true, quiz });
  } catch (err) {
    next(err);
  }
};

exports.getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find().limit(50);
    res.json({ success: true, quizzes });
  } catch (err) {
    next(err);
  }
};

exports.getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json({ success: true, quiz });
  } catch (err) {
    next(err);
  }
};

exports.deleteQuiz = async (req, res, next) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
