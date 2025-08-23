'use client';

import numeral from 'numeral';
import Switcher from './switcher';

export type countryOrContinent = "Countries" | "Continents"

interface VisitKPIsProps {
  placeType: string; // e.g., "States", "Countries", "Continents"
  visited: number;
  notVisited: number;
  total: number;
  countryOrContinent: countryOrContinent;
  setCountryOrContinent: React.Dispatch<React.SetStateAction<countryOrContinent>>
}

export default function VisitKPIs({ 
  placeType, 
  visited, 
  notVisited, 
  total, 
  countryOrContinent, 
  setCountryOrContinent }: VisitKPIsProps) {
  const percentageVisited = visited / total;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="flex flex-row text-lg font-semibold text-gray-900 mb-4">
        {placeType} Visited
        {placeType !== "States" && (
          <div className="ms-auto">
            <Switcher
              option1="Countries"
              option2="Continents"
              switchValue={countryOrContinent}
              setSwitchValue={setCountryOrContinent}
              padding="p-0"
            />
          </div>
        )}
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
