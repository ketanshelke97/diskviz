import React, { useMemo, useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import DiskAnimation from './DiskAnimation';

const algoColors = {
  "FCFS": "#818cf8",
  "SSTF": "#34d399",
  "SCAN": "#60a5fa",
  "C-SCAN": "#f59e0b",
  "LOOK": "#f472b6",
  "C-LOOK": "#a78bfa"
};

const SeekChart = ({ sequence = [], diskSize = 200, algoName = "FCFS" }) => {
  const chartData = useMemo(() => {
    return sequence.map((track, step) => ({ step, track }));
  }, [sequence]);

  const strokeColor = algoColors[algoName] || "#818cf8";

  // State for step-by-step needle animation
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    setStepIndex(0);
    const interval = setInterval(() => {
      setStepIndex(prev => {
        if (prev >= sequence.length - 1) { clearInterval(interval); return prev; }
        return prev + 1;
      });
    }, 1000); // 1000ms per step
    return () => clearInterval(interval);
  }, [sequence]);

  return (
    <div key={algoName} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl animate-fadeIn">
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-1">Seek Path</h2>
      <p className="text-xs text-gray-500 mb-6">Head position vs. service order</p>
      
      <DiskAnimation 
        currentTrack={sequence[stepIndex]} 
        diskSize={diskSize} 
        isRunning={true} 
      />

      <div className="h-[400px] w-full bg-gray-950/50 rounded-xl p-4 border border-gray-800/60 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} style={{ background: "transparent" }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis 
              dataKey="step" 
              stroke="#6b7280" 
              tick={{ fill: "#9ca3af", fontSize: 12 }} 
              label={{ value: "Service Order (Time)", position: "insideBottomRight", offset: -5, fill: "#6b7280", fontSize: 12 }} 
            />
            <YAxis 
              domain={[0, diskSize > 0 ? diskSize - 1 : 199]} 
              stroke="#6b7280" 
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              label={{ value: "Track Number", angle: -90, position: "insideLeft", fill: "#6b7280", fontSize: 12 }} 
            />
            <Tooltip 
              contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#f9fafb" }} 
              itemStyle={{ color: strokeColor }}
              labelStyle={{ color: "#9ca3af", marginBottom: "4px" }}
              formatter={(value) => [`Track ${value}`, algoName]}
              labelFormatter={(label) => `Step ${label}`}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Line 
              type="linear" 
              dataKey="track" 
              stroke={strokeColor} 
              strokeWidth={2}
              dot={{ fill: strokeColor, strokeWidth: 2, r: 4, stroke: "#111827" }} 
              activeDot={{ r: 6, strokeWidth: 0 }}
              name={`${algoName} Path`} 
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Seek Sequence Pills */}
      <div className="mt-8">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Seek Sequence</h3>
        <div className="flex flex-wrap gap-2">
          {sequence.map((track, i) => (
            <span
              key={`${i}-${track}`}
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                i === 0
                  ? "bg-indigo-900/40 text-indigo-300 border border-indigo-700/50 shadow-sm"
                  : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {i === 0 ? (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                  Start: {track}
                </>
              ) : (
                track
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeekChart;
