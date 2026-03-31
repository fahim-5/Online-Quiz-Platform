const Result = require("../models/Result");

exports.submitResult = async (req, res, next) => {
  try {
    const result = await Result.create(req.body);
    res.status(201).json({ success: true, result });
  } catch (err) {
    next(err);
  }
};

exports.getResultsForUser = async (req, res, next) => {
  try {
    const results = await Result.find({ user: req.params.userId });
    res.json({ success: true, results });
  } catch (err) {
    next(err);
  }
};
