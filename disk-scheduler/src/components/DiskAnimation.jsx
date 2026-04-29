import React, { useEffect, useState } from "react";

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
