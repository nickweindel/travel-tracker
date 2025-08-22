'use client';

import { useEffect, useState } from 'react';
import VisitKPIs from './visit-kpis';

interface USState {
  state_id: string;
  state_name: string;
  visited: boolean;
}

interface StatesTableProps {
  onStatesChange?: (states: USState[]) => void;
}

export default function StatesTable({ onStatesChange }: StatesTableProps) {
  const [states, setStates] = useState<USState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCheckboxChange = async (stateId: string, checked: boolean) => {
    try {
      const response = await fetch('/api/toggle-state-visit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stateId, visited: checked }),
      });

      if (!response.ok) {
        throw new Error('Failed to update visit status');
      }

      // Update local state
      const updatedStates = states.map(state =>
        state.state_id === stateId
          ? { ...state, visited: checked }
          : state
      );
      setStates(updatedStates);
      onStatesChange?.(updatedStates);
    } catch (err) {
      console.error('Error updating visit status:', err);
      // You could add a toast notification here
    }
  };

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('/api/get-states');
        if (!response.ok) {
          throw new Error('Failed to fetch states');
        }
        const data = await response.json();
        setStates(data);
        onStatesChange?.(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  const visitedCount = states.filter(state => state.visited).length;
  const notVisitedCount = states.filter(state => !state.visited).length;
  const totalCount = states.length;

  return (
    <div className="h-full flex flex-col">
      {/* KPIs Section */}
      <div className="mb-4">
        <VisitKPIs
          placeType="States"
          visited={visitedCount}
          notVisited={notVisitedCount}
          total={totalCount}
        />
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <tbody className="divide-y divide-gray-200">
              {states.map((state) => (
                <tr key={state.state_id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900 w-4/5">
                    {state.state_name}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 w-1/5 text-center">
                    <input
                      type="checkbox"
                      checked={state.visited}
                      onChange={(e) => handleCheckboxChange(state.state_id, e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}