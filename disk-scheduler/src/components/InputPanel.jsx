import React, { useState } from 'react';

const InputPanel = ({ onRun }) => {
  const [diskSize, setDiskSize] = useState(200);
  const [headPosition, setHeadPosition] = useState(53);
  const [queueStr, setQueueStr] = useState("98 183 37 122 14 124 65 67");
  const [direction, setDirection] = useState("right");
  const [error, setError] = useState("");

  const handleRun = () => {
    setError("");
    const parsedDiskSize = parseInt(diskSize, 10);
    const parsedHead = parseInt(headPosition, 10);

    if (isNaN(parsedDiskSize) || parsedDiskSize <= 0) {
      setError("Disk size must be a positive number.");
      return;
    }
    if (isNaN(parsedHead) || parsedHead < 0 || parsedHead >= parsedDiskSize) {
      setError(`Head position must be between 0 and ${parsedDiskSize - 1}.`);
      return;
    }

    // Parse queue (allow comma or space separated)
    const queue = queueStr
      .split(/[\s,]+/)
      .filter(s => s.trim() !== "")
      .map(Number);

    if (queue.length === 0) {
      setError("Request queue cannot be empty.");
      return;
    }
    if (queue.some(isNaN)) {
      setError("Request queue contains invalid numbers.");
      return;
    }
    if (queue.some(n => n < 0 || n >= parsedDiskSize)) {
      setError(`All requests must be between 0 and ${parsedDiskSize - 1}.`);
      return;
    }

    if (onRun) {
      onRun({
        diskSize: parsedDiskSize,
        headPosition: parsedHead,
        requestQueue: queue,
        direction,
      });
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 border-l-2 border-l-indigo-500 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest">Configuration</h2>
        {error && <span className="text-red-400 text-xs font-medium bg-red-900/20 px-3 py-1 rounded-full border border-red-900/50">{error}</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Disk Size */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400 font-medium">Disk Size</label>
          <input
            type="number"
            value={diskSize}
            onChange={(e) => setDiskSize(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Head Position */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400 font-medium">Head Position</label>
          <input
            type="number"
            value={headPosition}
            onChange={(e) => setHeadPosition(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Request Queue */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400 font-medium">Request Queue (space separated)</label>
          <input
            type="text"
            value={queueStr}
            onChange={(e) => setQueueStr(e.target.value)}
            placeholder="e.g. 98 183 37 122"
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Direction */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400 font-medium">Direction</label>
          <select 
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="right">Right (toward {parseInt(diskSize) - 1 > 0 ? parseInt(diskSize) - 1 : 199})</option>
            <option value="left">Left (toward 0)</option>
          </select>
        </div>

      </div>

      <div className="mt-6 flex justify-end">
        <button 
          onClick={handleRun}
          className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition text-white text-sm font-medium px-8 py-2.5 rounded-xl shadow-lg shadow-indigo-900/20"
        >
          Run All Algorithms
        </button>
      </div>
    </div>
  );
};

export default InputPanel;
