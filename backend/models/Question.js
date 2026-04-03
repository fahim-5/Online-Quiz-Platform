import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  text: { type: String, required: true },
  options: [{ text: String }],
  correctIndex: { type: Number, required: true },
  points: { type: Number, default: 1, min: 0 },
});

// Ensure correctIndex is within options bounds
QuestionSchema.pre("validate", function (next) {
  if (!Array.isArray(this.options) || this.options.length === 0) {
    return next(new Error("Question must have at least one option"));
  }
  if (
    typeof this.correctIndex !== "number" ||
    !Number.isInteger(this.correctIndex)
  ) {
    return next(new Error("correctIndex must be an integer"));
  }
  if (this.correctIndex < 0 || this.correctIndex >= this.options.length) {
    return next(new Error("correctIndex out of range for options"));
  }
  next();
});

const Question = mongoose.model("Question", QuestionSchema);

export default Question;
