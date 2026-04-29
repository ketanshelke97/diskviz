import { useEffect, useState } from "react";

export function useCountUp(targetValue, duration = 800) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (targetValue === 0 || targetValue === null) { setDisplay(0); return; }
    let start = null;
    const from = 0;
    const to = parseFloat(targetValue);

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(parseFloat((from + (to - from) * eased).toFixed(1)));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, [targetValue, duration]);

  return display;
}
