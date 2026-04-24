import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";

const createQuiz = async (req, res, next) => {
  try {
    const {
      title,
      description,
      timeLimit,
      rules,
      visibleFrom,
      startFrom,
      attemptsAllowed,
      shuffleQuestions,
      showAnswersAfterSubmission,
      access,
      status,
      joinCode,
    } = req.body;

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
      visibleFrom: visibleFrom ? new Date(visibleFrom) : undefined,
      startFrom: startFrom ? new Date(startFrom) : undefined,
      attemptsAllowed: attemptsAllowed || "single",
      shuffleQuestions: !!shuffleQuestions,
      showAnswersAfterSubmission: !!showAnswersAfterSubmission,
      access: access || "public",
      status: status || "draft",
      allowedList: Array.isArray(req.body.allowedList)
        ? req.body.allowedList
        : typeof req.body.allowedList === "string"
          ? req.body.allowedList
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
    };

    // generate a 6-digit join code if not provided
    if (!joinCode) {
      const genCode = () =>
        Math.floor(100000 + Math.random() * 900000).toString();
      let code = genCode();
      // avoid unlikely collisions by checking existing codes a few times
      for (let i = 0; i < 5; i++) {
        const exists = await Quiz.findOne({ joinCode: code });
        if (!exists) break;
        code = genCode();
      }
      payload.joinCode = code;
    } else {
      payload.joinCode = String(joinCode).trim();
    }

    const quiz = await Quiz.create(payload);
    res.status(201).json({ success: true, quiz });
  } catch (err) {
    next(err);
  }
};

const getQuizByCode = async (req, res, next) => {
  try {
    const code = String(req.params.code || "").trim();
    if (!code)
      return res.status(400).json({ success: false, message: "Code required" });
    const quiz = await Quiz.findOne({ joinCode: code });
    if (!quiz)
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    res.json({ success: true, quiz });
  } catch (err) {
    next(err);
  }
};

const getQuizzes = async (req, res, next) => {
  try {
    // By default return active quizzes only and only those visible now.
    // Teachers/admins can request all via ?all=true.
    const now = new Date();
    if (req.query.all === "true") {
      const quizzes = await Quiz.find({}).limit(500);
      return res.json({ success: true, quizzes });
    }

    // If caller requests assigned quizzes for the logged-in user
    if (req.query.assigned === "true") {
      // require authentication for assigned filtering
      const user = req.user || null;
      if (!user)
        return res
          .status(401)
          .json({ success: false, message: "Not authenticated" });

      // Match active quizzes visible now
      const baseMatch = {
        isActive: true,
        $or: [
          { visibleFrom: { $exists: false } },
          { visibleFrom: null },
          { visibleFrom: { $lte: now } },
        ],
      };

      // For students: return quizzes that are public OR private quizzes where allowedList contains the user's identifier or email
      const candidate = await Quiz.find({
        ...baseMatch,
        $or: [
          { access: "public" },
          {
            access: "private",
            allowedList: { $in: [user.identifier, user.email] },
          },
        ],
      }).limit(200);
      return res.json({ success: true, quizzes: candidate });
    }

    // Default: Only return quizzes that are active and either have no visibleFrom or visibleFrom <= now
    const quizzes = await Quiz.find({
      isActive: true,
      $or: [
        { visibleFrom: { $exists: false } },
        { visibleFrom: null },
        { visibleFrom: { $lte: now } },
      ],
    }).limit(50);
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

const updateQuiz = async (req, res, next) => {
  try {
    const updates = req.body || {};
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
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

const duplicateQuiz = async (req, res, next) => {
  try {
    const orig = await Quiz.findById(req.params.id);
    if (!orig) return res.status(404).json({ message: "Quiz not found" });

    // clone quiz fields
    const payload = {
      title: `${orig.title} (copy)`,
      description: orig.description,
      timeLimit: orig.timeLimit,
      rules: orig.rules,
      visibleFrom: orig.visibleFrom,
      startFrom: orig.startFrom,
      attemptsAllowed: orig.attemptsAllowed,
      shuffleQuestions: orig.shuffleQuestions,
      showAnswersAfterSubmission: orig.showAnswersAfterSubmission,
      access: orig.access,
      status: "draft",
      allowedList: orig.allowedList || [],
    };

    // generate joinCode for the new quiz
    const genCode = () =>
      Math.floor(100000 + Math.random() * 900000).toString();
    let code = genCode();
    for (let i = 0; i < 5; i++) {
      const exists = await Quiz.findOne({ joinCode: code });
      if (!exists) break;
      code = genCode();
    }
    payload.joinCode = code;

    const created = await Quiz.create(payload);

    // duplicate questions
    const questions = await Question.find({ quiz: orig._id });
    if (questions && questions.length > 0) {
      const copies = questions.map((q) => {
        const obj = q.toObject();
        delete obj._id;
        obj.quiz = created._id;
        return obj;
      });
      await Question.insertMany(copies);
    }

    res.status(201).json({ success: true, quiz: created });
  } catch (err) {
    next(err);
  }
};

export default {
  createQuiz,
  getQuizzes,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  undoQuiz,
  getQuizByCode,
  duplicateQuiz,
};
