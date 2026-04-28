// FCFS — First Come First Served
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

// SSTF — Shortest Seek Time First
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

// SCAN — Elevator Algorithm
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

// C-SCAN — Circular SCAN
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

// LOOK — Smart SCAN
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

// C-LOOK — Circular LOOK
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
