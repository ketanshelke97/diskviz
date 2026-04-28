import React, { useState, useMemo } from 'react';
import InputPanel from './components/InputPanel';
import SeekChart from './components/SeekChart';
import BarChart from './components/BarChart';
import SummaryTable from './components/SummaryTable';
import { fcfs, sstf, scan, cscan, look, clook } from './algorithms';

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

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <header className="border-b border-gray-800 px-8 py-5">
        <h1 className="text-xl font-semibold tracking-tight text-indigo-400">Disk Scheduling Visualizer</h1>
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
        {currentResult && (
          <SeekChart 
            sequence={currentResult.sequence} 
            diskSize={diskSize} 
            algoName={selectedAlgo} 
          />
        )}

        {/* Stat Cards */}
        {currentResult && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Selected Algorithm", value: selectedAlgo },
              { label: "Total Movement", value: currentResult.totalMovement },
              { label: "Avg Seek Time", value: (currentResult.totalMovement / requestQueue.length).toFixed(1) },
              { label: "Requests", value: requestQueue.length },
            ].map(card => (
              <div key={card.label} className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4">
                <p className="text-xs text-gray-500 mb-1">{card.label}</p>
                <p className="text-xl font-semibold text-white">{card.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Phase 5: Comparison Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BarChart />
          <SummaryTable />
        </div>
      </main>

      <footer className="border-t border-gray-800 py-6 text-center text-gray-500 text-xs">
        Mini Project 4 | Operating Systems Lab | 2025–26
      </footer>
    </div>
  );
}

export default App;
