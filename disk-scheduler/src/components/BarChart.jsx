import React, { useState } from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { algo, total, avg, isBest } = payload[0].payload;
  const color = isBest ? '#10b981' : '#4f46e5';

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 shadow-xl"
      style={{ borderLeft: `3px solid ${color}` }}>
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{algo}</p>
      <p className="text-xl font-bold text-white">{total}
        <span className="text-xs text-gray-400 font-normal ml-1">tracks</span>
      </p>
      <p className="text-xs text-gray-400 mt-1">Avg seek: <span className="text-indigo-400">{avg}</span></p>
    </div>
  );
};

const BarChart = ({ data }) => {
  const [hoveredAlgo, setHoveredAlgo] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-1">Performance Comparison</h2>
        <p className="text-xs text-gray-500 mb-5">Total head movement comparison</p>
        <div className="h-[300px] flex items-center justify-center border border-dashed border-gray-700 rounded-xl text-gray-500">
          Bar Chart Placeholder
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-1">Performance Comparison</h2>
      <p className="text-xs text-gray-500 mb-5">Total head movement comparison</p>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="algo" stroke="#6b7280" tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <YAxis stroke="#6b7280" tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: "rgba(255, 255, 255, 0.04)" }} 
            />
            <Bar 
              dataKey="total" 
              radius={[6, 6, 0, 0]}
              onMouseEnter={(data) => setHoveredAlgo(data.algo)}
              onMouseLeave={() => setHoveredAlgo(null)}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isBest ? '#10b981' : '#4f46e5'} 
                  opacity={hoveredAlgo === null || hoveredAlgo === entry.algo ? 1 : 0.25}
                  style={{ transition: "opacity 0.2s ease" }}
                />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChart;
