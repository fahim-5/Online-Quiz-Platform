const Question = require("../models/Question");

exports.createQuestion = async (req, res, next) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json({ success: true, question });
  } catch (err) {
    next(err);
  }
};

exports.getQuestionsForQuiz = async (req, res, next) => {
  try {
    const questions = await Question.find({ quiz: req.params.quizId });
    res.json({ success: true, questions });
  } catch (err) {
    next(err);
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
