'use client';

import { useEffect, useState } from 'react';

interface USState {
  state_id: string;
  state_name: string;
}

export default function StatesTable() {
  const [states, setStates] = useState<USState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('/api/get-states');
        if (!response.ok) {
          throw new Error('Failed to fetch states');
        }
        const data = await response.json();
        setStates(data);
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

      return (
      <div className="h-full">
        <div className="h-full overflow-y-auto pr-2">
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
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
  );
}