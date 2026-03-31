import React, { useEffect, useState } from "react";

export default function Timer({ initialSeconds = 60, onExpire }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      onExpire && onExpire();
      return;
    }
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds, onExpire]);

  return <div className="timer">Time: {seconds}s</div>;
}
