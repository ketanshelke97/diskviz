import React from 'react';

const SummaryTable = () => {
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
          <tr className="border-b border-gray-800/50">
            <td colSpan="4" className="px-6 py-10 text-center text-gray-500 italic">
              Run algorithms to see results
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SummaryTable;
