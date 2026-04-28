# Disk Scheduling Visualizer — Implementation Plan

> **Subject:** Operating Systems (Mini Project 4)
> **Tech Stack:** React + Vite + Recharts + Tailwind CSS

---

## Project Overview

Build a web app that simulates 6 disk scheduling algorithms, visualizes the disk head movement on a seek-path graph, and compares all algorithms via a bar chart and summary table.

**Algorithms:** FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK

---

## File Structure

```
my-project/
├── src/
│   ├── App.jsx                  ← main file, holds all state
│   ├── algorithms.js            ← all 6 algorithm functions
│   └── components/
│       ├── InputPanel.jsx       ← user input form
│       ├── SeekChart.jsx        ← line graph (head movement)
│       ├── BarChart.jsx         ← bar chart (comparison)
│       └── SummaryTable.jsx     ← results table
├── index.html
└── package.json
```

---

## Phase 1 — Project Setup

### Tasks

- [ ] Create React app using Vite
  ```bash
  npm create vite@latest disk-scheduler -- --template react
  cd disk-scheduler
  npm install
  npm install recharts
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```
- [ ] Set up central state in `App.jsx`
  - `diskSize` (default: 200)
  - `headPosition` (default: 53)
  - `requestQueue` (default: [98, 183, 37, 122, 14, 124, 65, 67])
  - `direction` (default: "right")
- [ ] Verify app runs on `localhost:5173`

---

## UI Design Guidelines — Tailwind CSS

> The UI must look **premium and professional**. This is not just a college project — it should look like a real product. Every component must be polished.

### Tailwind config setup

In `tailwind.config.js`:
```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

In `src/index.css`, replace everything with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Overall layout

```jsx
// App.jsx — full page layout
<div className="min-h-screen bg-gray-950 text-white">
  <header className="border-b border-gray-800 px-8 py-5">
    <h1 className="text-xl font-semibold tracking-tight">Disk Scheduling Visualizer</h1>
    <p className="text-sm text-gray-400 mt-1">OS Mini Project — Seek Time Analyzer</p>
  </header>
  <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
    {/* InputPanel, SeekChart, BarChart, SummaryTable go here */}
  </main>
</div>
```

### Input panel styling

```jsx
// Clean card with dark background
<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
  <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-5">Configuration</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

    {/* Each input field */}
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-gray-400 font-medium">Disk Size</label>
      <input
        type="number"
        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
      />
    </div>

    {/* Direction dropdown */}
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-gray-400 font-medium">Direction</label>
      <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500">
        <option value="right">Right (toward 199)</option>
        <option value="left">Left (toward 0)</option>
      </select>
    </div>

  </div>

  {/* Run button */}
  <button className="mt-5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition text-white text-sm font-medium px-6 py-2.5 rounded-lg">
    Run All Algorithms
  </button>
</div>
```

### Algorithm selector tabs

```jsx
// Tab bar for switching between algorithms
<div className="flex gap-2 flex-wrap">
  {["FCFS", "SSTF", "SCAN", "C-SCAN", "LOOK", "C-LOOK"].map(algo => (
    <button
      key={algo}
      onClick={() => setSelected(algo)}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
        selected === algo
          ? "bg-indigo-600 text-white"
          : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
      }`}
    >
      {algo}
    </button>
  ))}
</div>
```

### Chart section styling

```jsx
<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
  <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-1">Seek Path</h2>
  <p className="text-xs text-gray-500 mb-5">Head position vs. service order</p>
  {/* Recharts chart goes here */}
</div>
```

### Seek sequence pills

```jsx
<div className="flex flex-wrap gap-2 mt-4">
  {sequence.map((track, i) => (
    <span
      key={i}
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        i === 0
          ? "bg-indigo-900 text-indigo-300 border border-indigo-700"
          : "bg-gray-800 text-gray-300 border border-gray-700"
      }`}
    >
      {i === 0 ? `Start: ${track}` : track}
    </span>
  ))}
</div>
```

### Summary table styling

```jsx
<div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
  <table className="w-full text-sm">
    <thead>
      <tr className="border-b border-gray-800 text-xs text-gray-400 uppercase tracking-widest">
        <th className="text-left px-6 py-3">Algorithm</th>
        <th className="text-right px-6 py-3">Total Movement</th>
        <th className="text-right px-6 py-3">Avg Seek Time</th>
        <th className="text-right px-6 py-3">Status</th>
      </tr>
    </thead>
    <tbody>
      {results.map((row, i) => (
        <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition">
          <td className="px-6 py-4 font-medium text-white">{row.algo}</td>
          <td className="px-6 py-4 text-right text-gray-300">{row.total}</td>
          <td className="px-6 py-4 text-right text-gray-300">{row.avg}</td>
          <td className="px-6 py-4 text-right">
            {row.isBest && (
              <span className="bg-emerald-900 text-emerald-400 text-xs px-2 py-0.5 rounded-full border border-emerald-700">
                Best
              </span>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

### Stat cards (total movement, avg seek time)

```jsx
<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
  {[
    { label: "Algorithm", value: "C-LOOK" },
    { label: "Total Movement", value: "226" },
    { label: "Avg Seek Time", value: "28.3" },
    { label: "Requests", value: "8" },
  ].map(card => (
    <div key={card.label} className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4">
      <p className="text-xs text-gray-500 mb-1">{card.label}</p>
      <p className="text-2xl font-semibold text-white">{card.value}</p>
    </div>
  ))}
</div>
```

### Color theme for Recharts lines

Use these stroke colors for the 6 algorithm lines in your charts — they all look good on the dark background:

| Algorithm | Stroke Color |
|---|---|
| FCFS | `#818cf8` (indigo-400) |
| SSTF | `#34d399` (emerald-400) |
| SCAN | `#60a5fa` (blue-400) |
| C-SCAN | `#f59e0b` (amber-400) |
| LOOK | `#f472b6` (pink-400) |
| C-LOOK | `#a78bfa` (violet-400) |

Also add this to your Recharts chart for dark background compatibility:
```jsx
<LineChart style={{ background: "transparent" }}>
  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
  <XAxis stroke="#6b7280" tick={{ fill: "#9ca3af", fontSize: 12 }} />
  <YAxis stroke="#6b7280" tick={{ fill: "#9ca3af", fontSize: 12 }} />
  <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#f9fafb" }} />
  <Legend wrapperStyle={{ color: "#9ca3af" }} />
</LineChart>
```

---

## Phase 2 — algorithms.js (The Brain)

> This is the most important file. Write each function as a pure function — no React, no UI. Just logic.

**Every function signature:**
```js
functionName(head, requests, diskSize, direction)
// Returns: { sequence: [53, 65, 98, ...], totalMovement: 236 }
```

### 2.1 FCFS — First Come First Served

```js
// Serve requests in the exact order they arrive. No reordering.
export function fcfs(head, requests) {
  let sequence = [head];
  let total = 0;
  let current = head;
  for (let req of requests) {
    total += Math.abs(req - current);
    current = req;
    sequence.push(req);
  }
  return { sequence, totalMovement: total };
}
```

### 2.2 SSTF — Shortest Seek Time First

```js
// Always jump to the nearest unvisited track.
export function sstf(head, requests) {
  let remaining = [...requests];
  let sequence = [head];
  let total = 0;
  let current = head;
  while (remaining.length > 0) {
    // Find the closest track
    let closest = remaining.reduce((a, b) =>
      Math.abs(a - current) <= Math.abs(b - current) ? a : b
    );
    total += Math.abs(closest - current);
    current = closest;
    sequence.push(current);
    remaining.splice(remaining.indexOf(closest), 1);
  }
  return { sequence, totalMovement: total };
}
```

### 2.3 SCAN — Elevator Algorithm

```js
// Sweep in one direction to disk boundary, then reverse and sweep back.
export function scan(head, requests, diskSize, direction = "right") {
  let sequence = [head];
  let total = 0;
  let current = head;
  let above = requests.filter(r => r >= head).sort((a, b) => a - b);
  let below = requests.filter(r => r < head).sort((a, b) => b - a);

  if (direction === "right") {
    for (let r of above) { total += Math.abs(r - current); current = r; sequence.push(r); }
    // Go to disk boundary
    total += Math.abs((diskSize - 1) - current); current = diskSize - 1; sequence.push(diskSize - 1);
    for (let r of below) { total += Math.abs(r - current); current = r; sequence.push(r); }
  } else {
    for (let r of below) { total += Math.abs(r - current); current = r; sequence.push(r); }
    // Go to disk boundary
    total += Math.abs(0 - current); current = 0; sequence.push(0);
    for (let r of above) { total += Math.abs(r - current); current = r; sequence.push(r); }
  }
  return { sequence, totalMovement: total };
}
```

### 2.4 C-SCAN — Circular SCAN

```js
// Sweep to end, jump to track 0 (count the jump), sweep again.
export function cscan(head, requests, diskSize) {
  let sequence = [head];
  let total = 0;
  let current = head;
  let above = requests.filter(r => r >= head).sort((a, b) => a - b);
  let below = requests.filter(r => r < head).sort((a, b) => a - b);

  for (let r of above) { total += Math.abs(r - current); current = r; sequence.push(r); }
  if (below.length > 0) {
    // Go to end of disk
    total += Math.abs((diskSize - 1) - current); current = diskSize - 1; sequence.push(diskSize - 1);
    // Jump to track 0
    total += (diskSize - 1); current = 0; sequence.push(0);
    for (let r of below) { total += Math.abs(r - current); current = r; sequence.push(r); }
  }
  return { sequence, totalMovement: total };
}
```

### 2.5 LOOK — Smart SCAN

```js
// Like SCAN but reverse at the LAST REQUEST, not at the disk boundary.
export function look(head, requests, direction = "right") {
  let sequence = [head];
  let total = 0;
  let current = head;
  let above = requests.filter(r => r >= head).sort((a, b) => a - b);
  let below = requests.filter(r => r < head).sort((a, b) => b - a);

  if (direction === "right") {
    for (let r of above) { total += Math.abs(r - current); current = r; sequence.push(r); }
    for (let r of below) { total += Math.abs(r - current); current = r; sequence.push(r); }
  } else {
    for (let r of below) { total += Math.abs(r - current); current = r; sequence.push(r); }
    for (let r of above) { total += Math.abs(r - current); current = r; sequence.push(r); }
  }
  return { sequence, totalMovement: total };
}
```

### 2.6 C-LOOK — Circular LOOK

```js
// Like C-SCAN but jump to the SMALLEST REQUEST (not track 0).
export function clook(head, requests) {
  let sequence = [head];
  let total = 0;
  let current = head;
  let above = requests.filter(r => r >= head).sort((a, b) => a - b);
  let below = requests.filter(r => r < head).sort((a, b) => a - b);

  for (let r of above) { total += Math.abs(r - current); current = r; sequence.push(r); }
  if (below.length > 0) {
    // Jump directly to smallest request (NOT to track 0)
    total += Math.abs(below[0] - current); current = below[0]; sequence.push(below[0]);
    for (let r of below.slice(1)) { total += Math.abs(r - current); current = r; sequence.push(r); }
  }
  return { sequence, totalMovement: total };
}
```

---

## Phase 3 — InputPanel.jsx

### What to build

A form with these fields:

| Field | Type | Default | Validation |
|---|---|---|---|
| Disk Size | Number input | 200 | Must be > 0 |
| Head Position | Number input | 53 | Must be between 0 and diskSize |
| Request Queue | Text input | 98 183 37 122 14 124 65 67 | All values between 0 and diskSize |
| Direction | Dropdown | Right | "left" or "right" |

### Parse the request queue

```js
const queue = inputValue.split(" ").map(Number).filter(n => !isNaN(n));
```

### Validate before running

```js
if (headPosition < 0 || headPosition >= diskSize) {
  setError("Head position must be between 0 and disk size");
  return;
}
```

---

## Phase 4 — SeekChart.jsx

### What it shows

A line chart where:
- **X-axis** = time step (0, 1, 2, 3...)
- **Y-axis** = track number (0 to diskSize)
- **Each line** = one algorithm's head movement path (the zigzag)

### Data format for Recharts

```js
// Transform sequence array into Recharts-ready data
function toChartData(sequence) {
  return sequence.map((track, step) => ({ step, track }));
}
// Example: [53, 65, 98, 122, ...] → [{step:0, track:53}, {step:1, track:65}, ...]
```

### Recharts code skeleton

```jsx
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={350}>
  <LineChart data={chartData}>
    <XAxis dataKey="step" label="Service Order" />
    <YAxis label="Track Number" domain={[0, diskSize]} />
    <Tooltip />
    <Legend />
    <Line type="linear" dataKey="track" stroke="#534AB7" dot={true} name="FCFS" />
  </LineChart>
</ResponsiveContainer>
```

### Also show seek sequence as pills

```
53 → 65 → 67 → 98 → 122 → 124 → 183 → 37 → 14
```

---

## Phase 5 — BarChart.jsx + SummaryTable.jsx

### Bar chart

Compare total head movement of all 6 algorithms side by side. Highlight the lowest bar in green.

```js
const barData = [
  { algo: "FCFS",   total: 640 },
  { algo: "SSTF",   total: 236 },
  { algo: "SCAN",   total: 208 },
  { algo: "C-SCAN", total: 382 },
  { algo: "LOOK",   total: 208 },
  { algo: "C-LOOK", total: 226 },
];
```

### Summary table columns

| Algorithm | Seek Sequence | Total Movement | Avg Seek Time |
|---|---|---|---|
| FCFS | 53→98→183→... | 640 | 80.0 |
| SSTF | 53→65→67→... | 236 | 29.5 |
| ... | ... | ... | ... |

**Formula:** `avgSeekTime = totalMovement / numberOfRequests`

---

## Phase 6 — Polish & Submission

- [ ] Handle empty request queue (show error, don't crash)
- [ ] Handle duplicate values in request queue
- [ ] Handle head position already matching a request
- [ ] Add comments above every algorithm function
- [ ] Test with the standard textbook example (head=53, queue=98 183 37 122 14 124 65 67, disk=200)
- [ ] Build for submission: `npm run build` → submit the `/dist` folder

---

## Key Concepts for Viva

### Definitions

| Term | Definition |
|---|---|
| Disk size | Total number of tracks on the disk (e.g. 0–199 = 200 tracks) |
| Head position | The track the read/write head is currently at |
| Request queue | List of tracks waiting to be accessed |
| Head movement | Distance the head travels in one jump = |current track − next track| |
| Total head movement | Sum of all individual head movements |
| Avg seek time | Total head movement ÷ number of requests |

### Algorithm Comparison

| Algorithm | Key Idea | Advantage | Disadvantage |
|---|---|---|---|
| FCFS | Serve in arrival order | Simple, fair | Worst movement, lots of back-and-forth |
| SSTF | Go to nearest track | Low movement | Starvation of far tracks |
| SCAN | Sweep to boundary, reverse | No starvation | Wasted travel to disk edges |
| C-SCAN | Sweep to end, jump to 0 | Uniform wait time | Wasted jump to track 0 |
| LOOK | Sweep to last request, reverse | Saves edge travel | Slight unfairness |
| C-LOOK | Sweep to last, jump to smallest | Best balance | Slightly complex to implement |

### Common Viva Questions

**Q: What is starvation in SSTF?**
A: Tracks far from the current head keep getting skipped because closer tracks are always selected first. They may wait forever to be served.

**Q: Difference between SCAN and LOOK?**
A: SCAN travels all the way to track 0 or track 199 (disk boundary) before reversing. LOOK reverses at the last actual request — it never wastes movement going to the boundary.

**Q: Why is C-LOOK better than C-SCAN?**
A: C-SCAN always jumps back to track 0 even if the smallest request is at track 14. C-LOOK jumps directly to the smallest request — less wasted movement.

**Q: Which algorithm has the least head movement?**
A: LOOK and SSTF typically give the least movement. SSTF is best for random workloads; LOOK is more predictable and avoids starvation.

**Q: How do you calculate average seek time?**
A: `Avg Seek Time = Total Head Movement / Number of Requests`
Example: 640 total movement ÷ 8 requests = 80 tracks per request average.

---

*Mini Project 4 | Operating Systems Lab | 2025–26*
