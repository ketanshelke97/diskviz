# Disk Scheduling Visualizer — Animation Implementation Plan

> **Phase 7 — Animations & Visual Polish**
> **New component:** `DiskAnimation.jsx`
> **Libraries needed:** None — pure CSS + React state (no extra installs)

---

## Overview

Add 4 animations to make the project visually impressive:

1. **Spinning disk with moving head arm** — the hero animation
2. **Seek chart line draw animation** — chart draws itself on load
3. **Stat cards count-up animation** — numbers count up from 0
4. **Algorithm tab fade transition** — smooth content switch

---

## New File to Create

```
src/
└── components/
    └── DiskAnimation.jsx   ← NEW — the spinning disk component
```

No other new files needed. The other 3 animations are small additions to existing files.

---

## Animation 1 — Spinning Disk with Moving Head Arm

> This is the most impactful animation. Place it between the algorithm tab buttons and the seek chart. It shows a visual hard disk with a spinning platter and a needle arm that rotates to point at the current head track position.

### How it works

- The outer disk ring stays still
- The inner platter (gray circles = tracks) spins continuously using CSS
- The needle arm is a thin line from the center — it rotates to an angle that represents the current track position
- Track 0 = needle points left (0°), Track 199 = needle points right (180°)
- When you click Run All Algorithms or switch tabs, the needle smoothly rotates to the new head position using CSS `transition`

### DiskAnimation.jsx — full code

```jsx
import { useEffect, useState } from "react";

// Converts a track number to a rotation angle for the needle
// Track 0 = -90deg (left), Track 199 = 90deg (right)
function trackToAngle(track, diskSize) {
  return ((track / (diskSize - 1)) * 180) - 90;
}

export default function DiskAnimation({ currentTrack, diskSize, isRunning }) {
  const [angle, setAngle] = useState(trackToAngle(currentTrack, diskSize));
  const [rotation, setRotation] = useState(0);

  // Spin the platter continuously
  useEffect(() => {
    let frame;
    let start = null;
    const speed = isRunning ? 2 : 0.4; // spin faster when running

    function animate(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      setRotation(prev => (prev + speed * 0.1) % 360);
      frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isRunning]);

  // Move needle smoothly when track changes
  useEffect(() => {
    setAngle(trackToAngle(currentTrack, diskSize));
  }, [currentTrack, diskSize]);

  return (
    <div className="flex flex-col items-center gap-3 py-4">

      {/* Disk label */}
      <p className="text-xs text-gray-500 uppercase tracking-widest">
        Hard Disk — Track {currentTrack}
      </p>

      {/* Disk container */}
      <div className="relative w-48 h-48">

        {/* Outer ring — static */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-700 bg-gray-900" />

        {/* Spinning platter */}
        <div
          className="absolute inset-2 rounded-full bg-gray-800"
          style={{ transform: `rotate(${rotation}deg)`, transition: "transform 0.05s linear" }}
        >
          {/* Track rings — decorative circles */}
          {[85, 68, 51, 34, 17].map((size, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-gray-600/40"
              style={{
                width: `${size}%`,
                height: `${size}%`,
                top: `${(100 - size) / 2}%`,
                left: `${(100 - size) / 2}%`,
              }}
            />
          ))}

          {/* Center hole */}
          <div className="absolute w-6 h-6 rounded-full bg-gray-950 border-2 border-gray-600"
            style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          />

          {/* Platter shine effect */}
          <div className="absolute inset-0 rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)"
            }}
          />
        </div>

        {/* Needle arm — rotates to track position, does NOT spin with platter */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `rotate(${angle}deg)`,
            transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)", // springy feel
          }}
        >
          {/* Arm line */}
          <div
            className="absolute bg-indigo-400"
            style={{
              width: "2px",
              height: "44%",
              bottom: "50%",
              left: "calc(50% - 1px)",
              transformOrigin: "bottom center",
              borderRadius: "2px 2px 0 0",
            }}
          />
          {/* Arm tip dot — glows at the track */}
          <div
            className="absolute w-3 h-3 rounded-full bg-indigo-400"
            style={{
              bottom: "calc(50% + 42%)",
              left: "calc(50% - 6px)",
              boxShadow: "0 0 8px 2px rgba(129, 140, 248, 0.6)",
            }}
          />
        </div>

        {/* Center pivot */}
        <div className="absolute w-4 h-4 rounded-full bg-indigo-500 border-2 border-indigo-300"
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10 }}
        />
      </div>

      {/* Track position bar below the disk */}
      <div className="w-48">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>0</span>
          <span>{diskSize - 1}</span>
        </div>
        <div className="relative h-1.5 bg-gray-800 rounded-full">
          <div
            className="absolute top-0 h-1.5 bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${(currentTrack / (diskSize - 1)) * 100}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-indigo-400 border-2 border-gray-950 transition-all duration-500"
            style={{ left: `calc(${(currentTrack / (diskSize - 1)) * 100}% - 6px)` }}
          />
        </div>
        <p className="text-center text-xs text-indigo-400 mt-1 font-medium">
          Head at track {currentTrack}
        </p>
      </div>
    </div>
  );
}
```

### How to use it in SeekChart.jsx

```jsx
import DiskAnimation from "./DiskAnimation";

// Inside your SeekChart component, add this above the Recharts chart:
<DiskAnimation
  currentTrack={sequence[sequence.length - 1] ?? headPosition}
  diskSize={diskSize}
  isRunning={hasResults}
/>
```

Pass `currentTrack` as the last track in the current algorithm's sequence. This way the needle points to where the head ended up after serving all requests.

### Optional — make needle follow each step

If you want the needle to animate step by step (head moves to each track one by one), add a step counter with `setInterval`:

```jsx
// In SeekChart.jsx — animate through the sequence step by step
const [stepIndex, setStepIndex] = useState(0);

useEffect(() => {
  setStepIndex(0);
  const interval = setInterval(() => {
    setStepIndex(prev => {
      if (prev >= sequence.length - 1) { clearInterval(interval); return prev; }
      return prev + 1;
    });
  }, 600); // 600ms per step
  return () => clearInterval(interval);
}, [sequence]);

// Then pass to DiskAnimation:
<DiskAnimation currentTrack={sequence[stepIndex]} diskSize={diskSize} isRunning={true} />
```

---

## Animation 2 — Seek Chart Line Draw Animation

> The chart line draws itself from left to right instead of appearing instantly. Recharts supports this natively — just two props to add.

### Changes in SeekChart.jsx

Find your `<Line>` component and add these two props:

```jsx
<Line
  type="linear"
  dataKey="track"
  stroke={algoColor}
  dot={true}
  name={`${selectedAlgo} Path`}

  // ADD THESE TWO LINES:
  isAnimationActive={true}
  animationDuration={800}       // 800ms to draw the full line
  animationEasing="ease-out"    // smooth deceleration at the end
/>
```

Also animate the chart container appearing when you switch tabs. Wrap your chart div with this:

```jsx
<div
  key={selectedAlgo}  // key change forces remount = animation replays on tab switch
  className="opacity-0 animate-fadeIn"  // see Tailwind config below
>
  {/* your ResponsiveContainer here */}
</div>
```

Add this custom animation to your `tailwind.config.js`:

```js
theme: {
  extend: {
    keyframes: {
      fadeIn: {
        "0%": { opacity: "0", transform: "translateY(8px)" },
        "100%": { opacity: "1", transform: "translateY(0)" },
      },
    },
    animation: {
      fadeIn: "fadeIn 0.3s ease-out forwards",
    },
  },
},
```

---

## Animation 3 — Stat Cards Count-Up Animation

> When results load, numbers like 640, 236, 40.3 count up from 0. Makes the data feel alive.

### Create a custom hook — useCountUp

Add this small hook directly at the top of your `SummaryTable.jsx` or in a separate `src/hooks/useCountUp.js` file:

```js
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
```

### Use it in your stat cards

```jsx
import { useCountUp } from "../hooks/useCountUp";

function StatCard({ label, value }) {
  const animatedValue = useCountUp(parseFloat(value) || 0, 900);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-white">
        {typeof value === "string" && isNaN(value) ? value : animatedValue}
      </p>
    </div>
  );
}
```

> Note: For the "Selected Algorithm" card which shows text like "C-LOOK", skip the count-up and just display the string directly — the `isNaN` check above handles this.

---

## Animation 4 — Algorithm Tab Fade Transition

> When switching between FCFS, SSTF, SCAN etc., the seek path section fades out and fades in instead of switching instantly.

### Changes in SeekChart.jsx

This is the simplest animation. Add `key={selectedAlgo}` to the outer wrapper of your seek path section:

```jsx
{/* The key prop forces React to unmount and remount when algo changes */}
{/* This automatically triggers the CSS animation again */}
<div key={selectedAlgo} className="animate-fadeIn">
  <DiskAnimation ... />
  <ResponsiveContainer ... >
    {/* chart */}
  </ResponsiveContainer>
  {/* seek sequence pills */}
</div>
```

The `animate-fadeIn` class you added to `tailwind.config.js` in Animation 2 handles this automatically. No extra code needed.

---

## Implementation Order

Do these in this exact order — each one builds on the previous:

- [ ] Step 1 — Add `fadeIn` keyframe to `tailwind.config.js` (needed by animations 2 and 4)
- [ ] Step 2 — Add `animationDuration` and `key` prop to the Recharts `<Line>` and chart wrapper (Animation 2 — easiest, instant win)
- [ ] Step 3 — Create `src/hooks/useCountUp.js` and update stat cards (Animation 3)
- [ ] Step 4 — Create `src/components/DiskAnimation.jsx` with the full code above (Animation 1 — the big one)
- [ ] Step 5 — Import and place `<DiskAnimation>` in `SeekChart.jsx`
- [ ] Step 6 — Test all 6 algorithms and verify needle moves correctly for each
- [ ] Step 7 — Optional: add the step-by-step needle animation using `setInterval`

---

## What Each Animation Scores You

| Animation | Effort | Visual Impact | Viva Value |
|---|---|---|---|
| Spinning disk + needle | Medium | ⭐⭐⭐⭐⭐ | High — directly shows OS concept |
| Chart line draw | Tiny (2 props) | ⭐⭐⭐ | Low but looks professional |
| Count-up numbers | Small (1 hook) | ⭐⭐⭐ | Low but very polished |
| Tab fade transition | Tiny (1 prop) | ⭐⭐ | Low but smooth feel |

---

## Quick Sanity Check Before You Start

Run this and confirm the app still works before adding any animation:

```bash
npm run dev
```

Open `localhost:5173`, run all algorithms, verify charts and table show correct values. Only then start adding animations — never add animations to broken functionality.

---

*Mini Project 4 | Operating Systems Lab | 2025–26 | Animation Phase*
