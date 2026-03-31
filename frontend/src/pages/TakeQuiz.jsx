import React from "react";
import QuizCard from "../components/QuizCard";
import Timer from "../components/Timer";

export default function TakeQuiz() {
  const handleStart = () => {
    // TODO: start quiz flow
  };
  const handleExpire = () => {
    // TODO: submit answers
  };

  return (
    <div className="page take-quiz-page">
      <h2 className="text-2xl font-bold">Take Quiz</h2>
      <Timer initialSeconds={300} onExpire={handleExpire} />
      <QuizCard
        title="Sample Quiz"
        description="A short sample quiz"
        onStart={handleStart}
      />
    </div>
  );
}
