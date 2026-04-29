import React, { useState, useMemo } from 'react';
import InputPanel from './components/InputPanel';
import SeekChart from './components/SeekChart';
import BarChart from './components/BarChart';
import SummaryTable from './components/SummaryTable';
import { fcfs, sstf, scan, cscan, look, clook } from './algorithms';
import { useCountUp } from './hooks/useCountUp';

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

function App() {
  // Central State
  const [diskSize, setDiskSize] = useState(200);
  const [headPosition, setHeadPosition] = useState(53);
  const [requestQueue, setRequestQueue] = useState([98, 183, 37, 122, 14, 124, 65, 67]);
  const [direction, setDirection] = useState("right");
  const [selectedAlgo, setSelectedAlgo] = useState("FCFS");

  const handleRun = (config) => {
    setDiskSize(config.diskSize);
    setHeadPosition(config.headPosition);
    setRequestQueue(config.requestQueue);
    setDirection(config.direction);
  };

  // Calculate results for all algorithms
  const results = useMemo(() => {
    if (!requestQueue || requestQueue.length === 0) return null;
    
    return {
      "FCFS": fcfs(headPosition, requestQueue),
      "SSTF": sstf(headPosition, requestQueue),
      "SCAN": scan(headPosition, requestQueue, diskSize, direction),
      "C-SCAN": cscan(headPosition, requestQueue, diskSize),
      "LOOK": look(headPosition, requestQueue, direction),
      "C-LOOK": clook(headPosition, requestQueue)
    };
  }, [diskSize, headPosition, requestQueue, direction]);

  const currentResult = results ? results[selectedAlgo] : null;

  const resultsArray = useMemo(() => {
    if (!results) return [];
    const arr = Object.entries(results).map(([algo, data]) => ({
      algo,
      total: data.totalMovement,
      avg: (data.totalMovement / requestQueue.length).toFixed(1),
      sequence: data.sequence
    }));
    const minMovement = Math.min(...arr.map(r => r.total));
    return arr.map(r => ({ ...r, isBest: r.total === minMovement }));
  }, [results, requestQueue.length]);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <header className="border-b-2 border-gray-800 border-b-indigo-500/30 bg-gray-900/50 px-8 py-6">
        <h1 className="text-2xl font-bold tracking-tight text-indigo-400">Disk Scheduling Visualizer</h1>
        <p className="text-sm text-gray-400 mt-1">OS Mini Project — Seek Time Analyzer</p>
      </header>
      
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Phase 3: Input Panel */}
        <InputPanel onRun={handleRun} />

        {/* Algorithm Selector Tabs */}
        <div className="flex gap-2 flex-wrap">
          {["FCFS", "SSTF", "SCAN", "C-SCAN", "LOOK", "C-LOOK"].map(algo => (
            <button
              key={algo}
              onClick={() => setSelectedAlgo(algo)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                selectedAlgo === algo
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {algo}
            </button>
          ))}
        </div>

        {/* Phase 4: Seek Path Chart */}
        {currentResult ? (
          <SeekChart 
            sequence={currentResult.sequence} 
            diskSize={diskSize} 
            algoName={selectedAlgo} 
          />
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-1">Seek Path</h2>
            <div className="h-[350px] mt-5 flex items-center justify-center border border-dashed border-gray-700 rounded-xl text-gray-500">
              Seek Chart Placeholder
            </div>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Selected Algorithm", value: selectedAlgo },
            { label: "Total Movement", value: currentResult ? currentResult.totalMovement : '--' },
            { label: "Avg Seek Time", value: currentResult ? (currentResult.totalMovement / requestQueue.length).toFixed(1) : '--' },
            { label: "Requests", value: requestQueue && requestQueue.length > 0 ? requestQueue.length : '--' },
          ].map(card => (
            <StatCard key={card.label} label={card.label} value={card.value} />
          ))}
        </div>

        {/* Phase 5: Comparison Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BarChart data={resultsArray} />
          <SummaryTable data={resultsArray} />
        </div>
      </main>

      <footer className="border-t border-gray-800 py-6 text-center text-gray-500 text-xs">
        Mini Project 4 | Operating Systems Lab | 2025–26
      </footer>
    </div>
  );
}

export default App;
