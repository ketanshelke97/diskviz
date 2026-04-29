import React from 'react';

const SummaryTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden h-full flex flex-col">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs text-gray-400 uppercase tracking-widest">
              <th className="text-left px-6 py-3">Algorithm</th>
              <th className="text-right px-6 py-3">Total Movement</th>
              <th className="text-right px-6 py-3">Avg Seek Time</th>
              <th className="text-right px-6 py-3">Status</th>
            </tr>
          </thead>
        </table>
        <div className="flex-1 flex items-center justify-center border-t border-dashed border-gray-700 m-4 rounded-xl text-gray-500 min-h-[200px]">
          Table Placeholder
        </div>
      </div>
    );
  }

  return (
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
          {data.map((row, i) => (
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
  );
};

export default SummaryTable;
