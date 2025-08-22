'use client';

import numeral from 'numeral';

interface VisitKPIsProps {
  placeType: string; // e.g., "States", "Countries", "Continents"
  visited: number;
  notVisited: number;
  total: number;
}

export default function VisitKPIs({ placeType, visited, notVisited, total }: VisitKPIsProps) {
  const percentageVisited = visited / total;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {placeType} Visited
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {/* Visited */}
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {visited.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Visited
          </div>
        </div>

        {/* Not Visited */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">
            {notVisited.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Not Visited
          </div>
        </div>

        {/* Percentage */}
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {numeral(percentageVisited).format('0%')}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            % Visited
          </div>
        </div>
      </div>
    </div>
  );
}
