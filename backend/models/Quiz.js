import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  timeLimit: { type: Number, default: 0 }, // seconds
  rules: { type: String }, // human readable rules/notes
  isActive: { type: Boolean, default: true },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const Quiz = mongoose.model("Quiz", QuizSchema);

export default Quiz;
