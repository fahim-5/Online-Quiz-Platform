import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  text: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true },
    },
  ],
  correctIndex: { type: Number },
  points: { type: Number, default: 1, min: 0 },
});

// Validate options and correctIndex
QuestionSchema.pre("validate", function (next) {
  if (!Array.isArray(this.options) || this.options.length < 2) {
    return next(new Error("Question must have at least two options"));
  }
  for (const opt of this.options) {
    if (!opt || typeof opt.text !== "string" || opt.text.trim() === "") {
      return next(new Error("Each option must have text"));
    }
  }
  if (typeof this.correctIndex !== "undefined" && this.correctIndex !== null) {
    if (
      !Number.isInteger(this.correctIndex) ||
      this.correctIndex < 0 ||
      this.correctIndex >= this.options.length
    ) {
      return next(new Error("correctIndex must be a valid option index"));
    }
  }
  next();
});

const Question = mongoose.model("Question", QuestionSchema);

export default Question;
