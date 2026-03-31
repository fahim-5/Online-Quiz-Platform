const mongoose = require("mongoose");

async function connectDB(uri) {
  const mongoUri =
    uri || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/quizdb";
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
}

module.exports = connectDB;
