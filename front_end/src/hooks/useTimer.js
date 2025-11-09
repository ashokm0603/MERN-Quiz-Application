import { useEffect, useRef, useState } from 'react';

// Hook: useTimer(seconds, { autoStart: true, onExpire })
export default function useTimer(durationSeconds, { autoStart = true, onExpire } = {}) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setSecondsLeft(durationSeconds);
    if (autoStart) setRunning(true);
    else setRunning(false);
    return () => clearInterval(ref.current);
  }, [durationSeconds]);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(ref.current);
          setRunning(false);
          if (onExpire) onExpire();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [running]);

  const reset = (newDuration = durationSeconds) => {
    clearInterval(ref.current);
    setSecondsLeft(newDuration);
    setRunning(autoStart);
  };

  const pause = () => {
    clearInterval(ref.current);
    setRunning(false);
  };

  const resume = () => setRunning(true);

  return { secondsLeft, running, pause, resume, reset };
}