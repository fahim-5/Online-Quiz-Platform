import Question from "../models/Question.js";

const createQuestion = async (req, res, next) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json({ success: true, question });
  } catch (err) {
    next(err);
  }
};

const getQuestionsForQuiz = async (req, res, next) => {
  try {
    // Do not send correctIndex to the client
    const questions = await Question.find({ quiz: req.params.quizId }).select(
      "-correctIndex",
    );
    res.json({ success: true, questions });
  } catch (err) {
    next(err);
  }
};

const deleteQuestion = async (req, res, next) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

const getQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id).select(
      "-correctIndex",
    );
    if (!question)
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    res.json({ success: true, question });
  } catch (err) {
    next(err);
  }
};

const updateQuestion = async (req, res, next) => {
  try {
    const updates = req.body;
    const question = await Question.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-correctIndex");

    if (!question)
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    res.json({ success: true, question });
  } catch (err) {
    next(err);
  }
};

export default {
  createQuestion,
  getQuestionsForQuiz,
  getQuestion,
  updateQuestion,
  deleteQuestion,
};
